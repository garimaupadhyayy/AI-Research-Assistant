import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import { searchWeb } from './services/search.js';
import { summarizeResearch } from './services/llm.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all requests, allowing localhost frontend
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Resilient in-memory storage fallback if SQLite fails
const inMemoryHistory = [];
let useInMemoryFallback = false;

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', usingFallbackDb: useInMemoryFallback });
});

// GET /api/history - Retrieve list of all past research sessions
app.get('/api/history', async (req, res) => {
  try {
    const rows = await db.query('SELECT id, topic, summary, created_at FROM research_sessions ORDER BY created_at DESC');
    
    // Parse the summary column from JSON if it was stored as such
    const history = rows.map(row => {
      let parsedSummary = row.summary;
      try {
        parsedSummary = JSON.parse(row.summary);
      } catch (e) {
        // Fallback if it's plain text
        parsedSummary = { summary: row.summary, key_insights: [] };
      }
      return {
        id: row.id,
        topic: row.topic,
        summary: parsedSummary.summary || '',
        key_insights: parsedSummary.key_insights || [],
        created_at: row.created_at
      };
    });
    
    res.json(history);
  } catch (error) {
    console.warn('[DB Warning] Failed to query SQLite database, falling back to in-memory history:', error.message);
    useInMemoryFallback = true;
    res.json(inMemoryHistory.map(session => ({
      id: session.id,
      topic: session.topic,
      summary: session.summary,
      key_insights: session.key_insights,
      created_at: session.created_at
    })));
  }
});

// GET /api/history/:id - Retrieve detail of a single session with sources
app.get('/api/history/:id', async (req, res) => {
  const sessionId = req.params.id;
  try {
    const sessionRows = await db.query('SELECT id, topic, summary, created_at FROM research_sessions WHERE id = ?', [sessionId]);
    if (sessionRows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const row = sessionRows[0];
    let parsedSummary = row.summary;
    try {
      parsedSummary = JSON.parse(row.summary);
    } catch (e) {
      parsedSummary = { summary: row.summary, key_insights: [] };
    }
    
    const sourceRows = await db.query('SELECT id, title, url, snippet FROM sources WHERE session_id = ?', [sessionId]);
    
    res.json({
      id: row.id,
      topic: row.topic,
      summary: parsedSummary.summary || '',
      key_insights: parsedSummary.key_insights || [],
      created_at: row.created_at,
      sources: sourceRows
    });
  } catch (error) {
    console.warn('[DB Warning] Failed to query SQLite database, checking in-memory history:', error.message);
    const session = inMemoryHistory.find(s => String(s.id) === String(sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found in-memory' });
    }
    res.json(session);
  }
});

// POST /api/research - Triggers search, synthesis, and saves result
app.post('/api/research', async (req, res) => {
  const { topic } = req.body;
  if (!topic || topic.trim() === '') {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    console.log(`[Research] Starting research session for topic: "${topic}"`);
    
    // 1. Fetch Search Results
    const searchResults = await searchWeb(topic);
    
    // 2. Synthesize using LLM
    const synthesis = await summarizeResearch(topic, searchResults);
    
    const sessionData = {
      topic: topic,
      summary: synthesis.summary,
      key_insights: synthesis.key_insights,
      sources: searchResults
    };

    // 3. Try to save to database
    try {
      const summaryJsonString = JSON.stringify({
        summary: synthesis.summary,
        key_insights: synthesis.key_insights
      });
      
      const sessionResult = await db.run(
        'INSERT INTO research_sessions (topic, summary) VALUES (?, ?)',
        [topic, summaryJsonString]
      );
      
      const newSessionId = sessionResult.lastID;
      sessionData.id = newSessionId;
      sessionData.created_at = new Date();

      // Insert sources
      for (const src of searchResults) {
        await db.run(
          'INSERT INTO sources (session_id, title, url, snippet) VALUES (?, ?, ?, ?)',
          [newSessionId, src.title, src.url, src.snippet]
        );
      }
      
      console.log(`[Research] Saved session ID ${newSessionId} to SQLite database.`);
    } catch (dbError) {
      console.warn('[DB Warning] Could not save research to SQLite, saving in-memory:', dbError.message);
      useInMemoryFallback = true;
      
      // Fallback save in-memory
      const mockId = Date.now();
      sessionData.id = mockId;
      sessionData.created_at = new Date();
      inMemoryHistory.unshift(sessionData);
    }

    res.json(sessionData);
  } catch (error) {
    console.error('[Research] Critical processing error:', error);
    res.status(500).json({ error: 'An error occurred during the research process.' });
  }
});

// DELETE /api/history/:id - Delete a past research session
app.delete('/api/history/:id', async (req, res) => {
  const sessionId = req.params.id;
  try {
    await db.run('DELETE FROM research_sessions WHERE id = ?', [sessionId]);
    res.json({ success: true, message: 'Session deleted from SQLite database.' });
  } catch (error) {
    console.warn('[DB Warning] Failed to delete from SQLite, trying in-memory delete:', error.message);
    const index = inMemoryHistory.findIndex(s => String(s.id) === String(sessionId));
    if (index !== -1) {
      inMemoryHistory.splice(index, 1);
      return res.json({ success: true, message: 'Session deleted from in-memory fallback.' });
    }
    res.status(404).json({ error: 'Session not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
