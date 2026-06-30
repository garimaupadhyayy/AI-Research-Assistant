<img width="1918" height="957" alt="image" src="https://github.com/user-attachments/assets/3a6f71b0-a350-454e-ba7c-2abc62920b2b" /><img width="1918" height="957" alt="image" src="https://github.com/user-attachments/assets/c0f333c5-4bc4-4e69-913f-a561dbe9aebb" />
# 🤖 AI Research Assistant

An AI-powered research assistant that searches the web, synthesizes information using Google's Gemini AI, and generates structured research reports with key insights and verified sources.

🌐 **Live Demo:** https://ai-research-assistant-livid-zeta.vercel.app

## 📖 Overview

AI Research Assistant helps users quickly gather and understand information on any research topic. It searches trusted web sources, summarizes the collected information using Generative AI, and presents an organized research report with key insights and audited references.

## ✨ Features

- 🔍 Real-time web search
- 🤖 AI-powered research synthesis using Gemini 1.5 Flash
- 📄 Detailed research summaries
- 💡 Key insights generation
- 🌐 Audited search sources with direct links
- 🗂️ Research history storage
- ☁️ Cloud database using TiDB Serverless
- 📱 Responsive and modern user interface
- 🚀 Fully deployed and accessible online

## 🛠 Tech Stack

### Frontend
- React
- Vite
- CSS3
- Axios

### Backend
- Node.js
- Express.js
- MySQL2
- SQLite (Development)
- TiDB Serverless (Production)

### AI & APIs
- Google Gemini 1.5 Flash
- Tavily Search API
- Serper Search API

### Deployment
- Vercel
- Render
- TiDB Cloud

## 📂 Project Structure

```
AI-Research-Assistant
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── services
│   │   ├── routes
│   │   ├── db.js
│   │   └── index.js
│   ├── schema.sql
│   └── package.json
│
└── README.md
```

## ⚙️ Environment Variables

### Backend (.env)

```env
NODE_ENV=production

DB_HOST=your_tidb_host
DB_PORT=4000
DB_USER=your_tidb_username
DB_PASSWORD=your_tidb_password
DB_NAME=your_database_name

GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
SERPER_API_KEY=your_serper_api_key
```

### Frontend (.env)

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/garimaupadhyayy/AI-Research-Assistant.git
```

Move into the project

```bash
cd AI-Research-Assistant
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🧠 How It Works

1. User enters a research topic.
2. The backend searches the web using Tavily or Serper.
3. Relevant search results are collected and cleaned.
4. Gemini AI synthesizes the collected information.
5. The application generates:
   - Comprehensive Summary
   - Key Insights
   - Audited Search Sources
6. Research history is stored in TiDB for future access.

## 🎯 Key Highlights

- AI-assisted research automation
- Cloud-native architecture
- Secure environment variable management
- Responsive React frontend
- RESTful Express backend
- Cloud database integration
- Production deployment

## 🚀 Future Improvements

- PDF report export
- Citation generation (APA/MLA)
- User authentication
- Dark mode
- Research categorization
- Multi-language support
- AI chat assistant
- Saved bookmarks
  
## 👩‍💻 Author

**Garima Upadhyay**

- GitHub: https://github.com/garimaupadhyayy


This project is licensed under the MIT License.

