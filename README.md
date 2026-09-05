# SourceShip

Assign event follow-up work to a teammate named Scout. Not a chat box.

You paste a public Luma/event URL and a short goal. Scout moves the job **Queued → Researching → Drafting → Ready** (and flashes **Retrying** if a step fails once). You come back to a Done pack: grounded shortlist, send-ready notes, confidence score. **Approve** is UI-only — nothing is emailed.

Built as a thin Burning Token hackathon slice.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

Optional env (copy `.env.example` to `.env.local`):

- `OPENAI_API_KEY` or `NEBIUS_API_KEY` — rewrite notes with an LLM
- `LINKUP_API_KEY` — extra public research
- Without keys, Scout still finishes using public HTML + template notes

## 2-minute demo script

1. Leave the seeded URL `https://luma.com/burningtoken` and goal `shortlist who to thank / partner with`.
2. Click **Assign to Scout**. Do not type in a chat.
3. Watch the card move across the board. If a fetch flakes, you should see a brief **Retrying** badge.
4. Open the Ready card. The pack should name real event entities (NERDCONF, Frontier Tower, Nebius, Convex, Render, LinkUp, Tenki Cloud) — not invented people.
5. Click **Approve** on one note, then **Approve remaining**. Badges flip to Approved. No email is sent.

## How it works

- In-process worker plus poll-on-GET so stages keep moving even if you walk away
- Research fetches the event URL plus related public pages (`burningtoken.dev`, the online Luma page for the seeded event)
- Entities are matched against names that actually appear on those pages
- Drafts call an OpenAI-compatible API when a key is present; otherwise templates are filled from the shortlist
- Jobs live in memory and `/tmp/sourceship-jobs.json` (fine for a demo, not multi-tenant)

## Deploy

### Render (better for the live worker)

1. New **Web Service** from this repo
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add optional env keys
5. Open the service URL

A long-lived Node process keeps the desk and worker in one place.

### Vercel

```bash
npx vercel
```

Or import the Git repo in the Vercel dashboard. Framework preset: Next.js.

Caveat: serverless isolates reset the in-memory desk. Polling can resume a job **on the same warm instance**, but a cold start looks empty. For the hackathon demo, local or Render is more reliable.

## Out of scope (intentionally)

Auth, calendar sync, real email send, Convex, RevenueCat, multi-tenant, extra job types, polished visual design.
