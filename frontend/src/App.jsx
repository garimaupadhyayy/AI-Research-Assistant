import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [history, setHistory] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch History on Mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history`);
      if (!res.ok) throw new Error('Failed to fetch research history');
      const data = await res.json();
      setHistory(data);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Backend Connection Offline. Using local fallback server or database if available.');
    }
  };

  const loadSession = async (id) => {
    try {
      setLoading(true);
      setStatusText('Loading research details...');
      setErrorMsg('');
      const res = await fetch(`${API_URL}/history/${id}`);
      if (!res.ok) throw new Error('Failed to load session details');
      const data = await res.json();
      setActiveSession(data);
    } catch (err) {
      setErrorMsg('Failed to load the selected research session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setStatusText('Searching the web for relevant publications & data...');
      setErrorMsg('');
      setActiveSession(null);

      // Simple interval to simulate pipeline phase updates for transparency
      const statusInterval = setTimeout(() => {
        setStatusText('Web search finished. Synthesizing insights with Gemini AI...');
      }, 3500);

      const res = await fetch(`${API_URL}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchQuery.trim() })
      });

      clearTimeout(statusInterval);

      if (!res.ok) throw new Error('Research request failed');
      const data = await res.json();
      
      setActiveSession(data);
      setSearchQuery('');
      
      // Refresh history list
      fetchHistory();
    } catch (err) {
      setErrorMsg('An error occurred during synthesis. Verify that Node is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent loading the session being deleted
    if (!window.confirm('Delete this research session?')) return;
    try {
      const res = await fetch(`${API_URL}/history/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      
      setHistory(prev => prev.filter(item => item.id !== id));
      if (activeSession && activeSession.id === id) {
        setActiveSession(null);
      }
    } catch (err) {
      setErrorMsg('Failed to delete research session.');
    }
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar: Past Research History */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">/ HISTORY</span>
          {errorMsg && <span style={{ fontSize: '0.65rem', color: '#ff0000', fontWeight: 'bold' }}>OFFLINE</span>}
        </div>
        
        <div className="sidebar-content">
          {history.length === 0 ? (
            <div className="empty-history">
              NO PAST SESSIONS FOUND
            </div>
          ) : (
            <ul className="history-list">
              {history.map((item) => (
                <li 
                  key={item.id} 
                  className={`history-item ${activeSession && activeSession.id === item.id ? 'active' : ''}`}
                  onClick={() => loadSession(item.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <span className="history-item-topic" title={item.topic}>
                      {item.topic}
                    </span>
                    <span className="history-item-date">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <button 
                    className="delete-btn" 
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete research history item"
                  >
                    [X]
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-workspace">
        <section className="app-title-section">
          <h1>AI Research Assistant</h1>
          <p className="app-subtitle">Monochrome Knowledge Extraction & Synthesis Engine</p>
        </section>

        {/* Search & Topic Selection */}
        <section className="search-container">
          <label className="search-label" htmlFor="topic-input">Search Research Topic</label>
          <form onSubmit={handleSearch} className="search-box-row">
            <input 
              id="topic-input"
              type="text" 
              className="search-input"
              placeholder="e.g. Quantum Computing Advancements, CRIPSR gene therapy, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
              required
            />
            <button 
              type="submit" 
              className="search-btn"
              disabled={loading || !searchQuery.trim()}
            >
              [ RESEARCH ]
            </button>
          </form>
          {errorMsg && (
            <div style={{ 
              marginTop: '0.75rem', 
              padding: '0.75rem', 
              border: '1px solid #000000', 
              fontFamily: 'monospace', 
              fontSize: '0.8rem',
              backgroundColor: '#fff5f5'
            }}>
              WARNING: {errorMsg}
            </div>
          )}
        </section>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">PIPELINE RUNNING</div>
            <div className="loading-subtext">{statusText}</div>
          </div>
        )}

        {/* Results Dashboard */}
        {!loading && activeSession && (
          <div className="results-dashboard">
            <div className="results-header">
              <span className="results-topic-label">RESEARCH DOSSIER:</span>
              <h2 className="results-topic-title">{activeSession.topic}</h2>
            </div>

            {/* Structured Summary Card */}
            <div className="section-card">
              <h3 className="section-title">I. Synthesis & Structured Summary</h3>
              <p className="summary-text">{activeSession.summary}</p>
            </div>

            {/* Key Insights Card */}
            <div className="section-card">
              <h3 className="section-title">II. Key Highlights & Insights</h3>
              <ul className="insights-list">
                {activeSession.key_insights && activeSession.key_insights.map((insight, idx) => (
                  <li key={idx} className="insight-item">
                    <span className="insight-bullet">▪</span>
                    <span className="insight-content">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Referenced Resources Card */}
            <div className="section-card">
              <h3 className="section-title">III. Audited Search Sources</h3>
              <div className="sources-list">
                {activeSession.sources && activeSession.sources.length === 0 ? (
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>No references extracted.</p>
                ) : (
                  activeSession.sources && activeSession.sources.map((source, idx) => (
                    <div key={source.id || idx} className="source-item">
                      <div className="source-title-row">
                        <span className="source-title">
                          <span className="source-index">[{idx + 1}]</span> {source.title}
                        </span>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.85rem' }}
                        >
                          Visit Source
                        </a>
                      </div>
                      {source.snippet && <p className="source-snippet">{source.snippet}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !activeSession && (
          <div className="empty-state">
            <h3 className="empty-state-title">SYSTEM IDLE</h3>
            <p className="empty-state-desc">Enter a research query above to scrape the web and synthesize information using generative AI models.</p>
          </div>
        )}
      </main>
    </div>
  );
}
