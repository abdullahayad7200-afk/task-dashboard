# HumanizeX

HumanizeX is a lightweight writing editor for making a draft clearer and easier to read while keeping its meaning and voice. This first version runs entirely in your browser and does not send text to a server.

## What it does

- Simplifies a small set of common wordy phrases (for example, “in order to” to “to”).
- Offers clear, warm, and professional editing focuses. Warm and professional focuses convert a limited set of common contractions.
- Shows each phrase edit so you can review the result before copying it.
- Limits drafts to 5,000 characters.

Edits use transparent phrase-matching rules, not an AI model or a rewriting service. HumanizeX does not understand context, generate synonyms, or guarantee that every edit preserves meaning; review the output and make the final wording your own.

## Getting started

Requires Node.js 18 or later and npm 10 or later.

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm start` — Run the Vite development server.
- `npm run build` — Create a production build.
- `npm test` — Run the Vitest suite.
