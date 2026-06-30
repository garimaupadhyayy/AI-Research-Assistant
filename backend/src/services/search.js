import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

function cleanSnippet(text = "") {
  const cleaned = text
    .replace(/\[\[.*?\]\]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 300
    ? cleaned.substring(0, 300) + "..."
    : cleaned;
}
export async function searchWeb(query) {
  const tavilyKey = process.env.TAVILY_API_KEY;
  const serperKey = process.env.SERPER_API_KEY;

  if (tavilyKey && tavilyKey.trim() !== '' && !tavilyKey.includes('your_tavily')) {
    try {
      console.log(`[Search] Querying Tavily API for: "${query}"`);
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: tavilyKey,
        query: query,
        search_depth: 'basic',
        max_results: 5
      });
      if (response.data && response.data.results) {
        return response.data.results.map(r => ({
          title: r.title || 'Untitled Source',
          url: r.url || '#',
          snippet: cleanSnippet(r.content || '')
        }));
      }
    } catch (error) {
      console.error('[Search] Tavily API error:', error.message);
    }
  }

  if (serperKey && serperKey.trim() !== '' && !serperKey.includes('your_serper')) {
    try {
      console.log(`[Search] Querying Serper API for: "${query}"`);
      const response = await axios.post('https://google.serper.dev/search', {
        q: query,
        num: 5
      }, {
        headers: {
          'X-API-KEY': serperKey,
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.data.organic) {
        return response.data.organic.map(r => ({
          title: r.title || 'Untitled Source',
          url: r.link || '#',
         snippet: cleanSnippet(r.snippet || '')
        }));
      }
    } catch (error) {
      console.error('[Search] Serper API error:', error.message);
    }
  }

  // Fallback / Mock Search Results
  console.log(`[Search] No active search API key found. Generating simulated mock results for: "${query}"`);
  return getMockSearchResults(query);
}

function getMockSearchResults(query) {
  return [
    {
      title: `Understanding ${query} - Wikipedia, the free encyclopedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
      snippet: `This encyclopedic entry details the fundamentals of ${query}, exploring its origins, major advancements, theoretical foundations, and modern practical applications across various industries.`
    },
    {
      title: `Latest Developments and Trends in ${query}`,
      url: `https://example.com/research/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
      snippet: `A modern research synthesis analyzing how ${query} is currently evolving. It highlights emerging frameworks, key industry challenges, market analysis, and predictions for future adoption over the next decade.`
    },
    {
      title: `A Guide to Mastering ${query}`,
      url: `https://starkacademy.org/guides/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
      snippet: `An educational resource covering the core concepts, common misconceptions, best practices, and a step-by-step tutorial for beginners and experts working with ${query}.`
    }
  ];
}
