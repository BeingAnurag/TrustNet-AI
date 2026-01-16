# TrustNet AI Frontend

A Next.js-based frontend for the TrustNet AI answer evaluation system.

## Features

- Clean, responsive single-page UI
- Real-time evaluation of LLM-generated answers
- Visual trust score indicators
- Signal breakdown display
- Decision classification (Show, Warning, Flag)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in Vercel
3. Configure environment variables:
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
4. Deploy

### Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project Structure

```
frontend/
├── app/
│   ├── globals.css       # Global styles and Tailwind directives
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Main page component
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
├── .env.local.example    # Environment variable template
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## API Integration

The frontend expects the backend to expose a `/evaluate` endpoint that:

**Request:**
```json
{
  "question": "string",
  "context": "string",
  "answer": "string"
}
```

**Response:**
```json
{
  "predicted_label": "grounded" | "partially_grounded" | "hallucinated",
  "trust_score": 0.85,
  "decision": "show" | "show_with_warning" | "flag",
  "signals": [
    {
      "name": "semantic_similarity",
      "value": 0.92,
      "weight": 0.5
    }
  ],
  "question": "string",
  "context": "string",
  "answer": "string"
}
```

## License

MIT
