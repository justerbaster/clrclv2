# Cloracle - AI Prediction Oracle

AI-powered prediction market analyzer that fetches events from Polymarket and provides independent probability assessments using advanced language models.

![Cloracle](https://img.shields.io/badge/Cloracle-AI%20Oracle-cyan)

## Features

- **Real-time Polymarket Integration** - Fetches and syncs events from Polymarket API
- **AI Analysis** - Uses Groq (Llama 3.1 70B) to analyze events and provide probability estimates
- **Divergence Detection** - Highlights when AI assessment differs from market consensus
- **Interactive Chat** - Ask Cloracle questions about any event or prediction
- **Prediction History** - Tracks all predictions over time for accuracy analysis
- **Futuristic UI** - Dark theme with neon accents, particle effects, and smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: SQLite + Prisma ORM
- **AI**: Groq API (Llama 3.1 70B)
- **Data**: Polymarket Gamma API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API key ([Get one free](https://console.groq.com))

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd cloracle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```
   DATABASE_URL="file:./dev.db"
   GROQ_API_KEY="your-groq-api-key-here"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### First Steps

1. Click **"Sync"** in the header to fetch events from Polymarket
2. Click **"Analyze"** on any event card to get Cloracle's prediction
3. Visit the **Chat** page to ask questions about events

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | List all events |
| `/api/events/[id]` | GET | Get single event |
| `/api/sync` | POST | Sync events from Polymarket |
| `/api/sync` | GET | Get sync status |
| `/api/analyze` | POST | Analyze single event |
| `/api/analyze` | PUT | Batch analyze events |
| `/api/chat` | POST | Send chat message |
| `/api/chat` | GET | Get chat history |

## Project Structure

```
cloracle/
├── app/
│   ├── api/              # API routes
│   ├── chat/             # Chat page
│   ├── event/[id]/       # Event detail page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/
│   ├── db.ts             # Prisma client
│   ├── groq.ts           # Groq API client
│   ├── polymarket.ts     # Polymarket API client
│   └── prompts.ts        # AI prompts
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Configuration

### Categories

Events are categorized as:
- Politics
- Crypto
- Sports
- Pop Culture
- Business
- Science
- Entertainment
- Other

### AI Analysis

The AI analyzes each event considering:
- Historical precedents and patterns
- Current context and recent developments
- Key stakeholders and incentives
- Potential risks and uncertainties

## Disclaimer

This project is for educational and entertainment purposes only. AI predictions are not financial advice. Always do your own research before making any decisions based on prediction markets.

## License

MIT
