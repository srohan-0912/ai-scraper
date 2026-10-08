# AI Web Scraper & Summarizer

An AI-powered web application that extracts readable content from a webpage and generates a concise summary using Groq AI.

## 🚀 Live Demo

Coming soon — deployed with Vercel.

## 📌 Project Overview

AI Web Scraper & Summarizer allows users to enter a webpage URL and receive an AI-generated summary within seconds.

The application:

1. Accepts a webpage URL from the user.
2. Validates the URL.
3. Fetches the webpage.
4. Extracts readable text using Cheerio.
5. Limits the extracted content to avoid unnecessarily large AI requests.
6. Sends the content to Groq AI.
7. Generates a concise 5–8 bullet-point summary.
8. Displays the result through a simple web interface.

## ✨ Features

- 🔗 Webpage URL input
- 🕷️ Server-side web scraping
- 🧹 HTML content extraction using Cheerio
- 🤖 AI-powered summarization using Groq
- 📄 Automatic webpage title extraction
- ⏳ Loading state while processing
- ❌ User-friendly error handling
- 🔒 Environment-based API key management
- 🛡️ HTTP/HTTPS URL validation
- 🛡️ Local and internal URL protection
- 📏 30,000-character content limit
- 📱 Responsive interface
- ☁️ Ready for Vercel deployment

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Cheerio
- Groq SDK

### AI

- Groq
- OpenAI GPT-OSS 20B

### Deployment

- Vercel

### Development Tools

- Git
- GitHub
- VS Code

## 🏗️ Architecture

```text
User
  │
  ▼
Next.js Frontend
  │
  │ POST /api/summarize
  ▼
Next.js API Route
  │
  ├── Validate URL
  │
  ├── Check URL security
  │
  ▼
Fetch Webpage
  │
  ▼
Cheerio
  │
  ├── Remove scripts/styles
  └── Extract readable text
  │
  ▼
Groq AI
  │
  ▼
AI Summary
  │
  ▼
Next.js Frontend
  │
  ▼
Display Summary