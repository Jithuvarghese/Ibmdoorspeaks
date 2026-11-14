# DoorSpeaks 🚪💬

**Know before you sign.**

Bangalore's tenant-first rental transparency platform — Glassdoor for landlords and rental properties.

> ⚠️ All demo data is clearly marked. Reviews are user opinions. This is not legal advice.

---

## What It Is

DoorSpeaks empowers tenants in Bengaluru, Karnataka, India with:

- **Landlord reviews** — Honest ratings from previous tenants (maintenance, deposit, communication, privacy, rent fairness)
- **Deposit checker** — Is your deposit legal? Checks against Bangalore market norms and Karnataka Rent Act 1999
- **Tenant rights hub** — 12+ articles on Karnataka rental law, in plain language
- **AI chat** — Ask rental questions; powered by Ollama (local LLM) or Gemini, with a mock provider for demos
- **Locality intelligence** — Rent ranges, deposit norms, metro access for 30+ Bangalore areas
- **Agreement scanner** — Paste your lease; get red flags highlighted
- **Deposit demand letter** — Generate a legally-toned letter to recover your deposit

---

## Repository Layout

```
doorspeaks/
├── apps/
│   ├── api/          # Fastify + TypeScript + SQLite backend (port 4000)
│   └── web/          # React 18 + Vite + Tailwind frontend (port 5173)
├── packages/
│   └── shared/       # Zod schemas + TypeScript types shared by both apps
├── docs/
│   └── PRODUCT_SPEC.md
├── Logo.svg
├── package.json      # npm workspaces root
└── tsconfig.base.json
```

---

## Prerequisites

- **Node.js 20+** (`node --version`)
- **npm 10+** (comes with Node 20)
- *(Optional)* **Ollama** for local AI: https://ollama.ai  
  After installing: `ollama pull llama3.1:8b`

---

## Install

```bash
git clone https://github.com/Jithuvarghese/Doorspeaks
cd doorspeaks
npm install
```

---

## Environment Setup

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — set ADMIN_TOKEN, optionally LLM_PROVIDER
```

The defaults work out of the box with the **mock** LLM provider (no Ollama needed).

---

## Seed Demo Data

```bash
npm run seed
```

Creates 25+ landlords, 60+ reviews, 30 localities, and 12 rights articles in the SQLite database.

---

## Run

**Both apps together:**
```bash
npm run dev
```

**Separately:**
```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:5173
```

---

## API Health Check

```
GET http://localhost:4000/api/health
```

---

## Local LLM Setup (Ollama)

1. Install Ollama: https://ollama.ai/download
2. Pull a model: `ollama pull llama3.1:8b`
3. Set in `apps/api/.env`:
   ```
   LLM_PROVIDER=ollama
   OLLAMA_MODEL=llama3.1:8b
   ```

For Gemini:
```
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
```

For offline demo (default):
```
LLM_PROVIDER=mock
```

---

## Run Tests

```bash
npm test
```

Tests cover: deposit rules, review validation, search/sort, RAG retrieval, API integration.

---

## Demo Script (2-Minute Hackathon Pitch)

1. **Home** (`:5173`) — Hero "Know before you sign", four feature tiles
2. **Search a landlord** — Type "Sharma" in Koramangala; see cards with ratings and badges
3. **Landlord detail** — Click a landlord; see rating breakdown, reviews, properties
4. **Write a review** — Multi-step form; fill in locality, rent, 5-category ratings
5. **Deposit checker** — Enter ₹35,000 rent, 11-month deposit; see "High" verdict, negotiating tips
6. **Rights hub** — Browse articles; click "Security Deposit Return"; read with TOC
7. **Locality page** — Click Koramangala; see rent ranges, BHK data, metro info
8. **AI chat** — Ask "Can my landlord keep my deposit?"; see streamed answer + source chips
9. **Agreement scanner** — Paste a sample clause; see red-flag analysis

---

## Roadmap

| Phase | Description |
|-------|-------------|
| Phase 1 | Research & data collection, Bangalore locality dataset |
| Phase 2 | MVP (this release) — search, reviews, deposit check, rights, AI chat |
| Phase 3 | Verification & maps — lease upload verification, Leaflet map view |
| Phase 4 | Scale — multi-city, mobile app, landlord response feature |

---

## Legal Disclaimer

DoorSpeaks is an independent platform. Reviews are opinions of users and do not constitute legal advice. Landlords may request takedowns via the report flow. Deposit norms stated are market observations, not statutory caps. Always consult a qualified lawyer for legal matters.

---

## License

MIT © DoorSpeaks Contributors
