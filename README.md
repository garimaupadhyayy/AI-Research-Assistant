<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/cc7d48ae-c524-420b-8e4a-fd339fb54640" />

# 🤖 AI Research Assistant

AI Research Assistant is a full-stack web application that automates the research process by combining real-time web search with Generative AI. Instead of manually browsing multiple websites and reading lengthy articles, users can enter any research topic and receive a structured, AI-generated research report within seconds. The application searches the web using Tavily Search API and Serper API, retrieves relevant information from trusted sources, and then leverages Google Gemini 1.5 Flash to analyze, synthesize, and summarize the collected content. The generated report includes a comprehensive summary, key insights, and direct links to the original reference sources, enabling users to verify the information easily. To provide a seamless experience, the application also stores previous research sessions in a cloud-hosted TiDB MySQL database, allowing users to revisit earlier research without performing the search again. The backend is deployed on Render, while the frontend is hosted on Vercel, making the application publicly accessible.

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

