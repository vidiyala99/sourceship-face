# SourceShip

An assistant crew. You hand work off. They look things up, talk it through, and bring back an outcome.

One job: follow up Burning Token — who to thank, coffee-chat notes, approve (no send).

## Run

```bash
npm install
cp .env.example .env.local   # add keys when you have them
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## Sponsor keys

Set these in `.env.local` or on Render. The crew uses them as soon as they are present.

| Key | Who | What |
| --- | --- | --- |
| `LINKUP_API_KEY` | Reed | Live web research. Names must appear in results — no invented people. |
| `NEBIUS_API_KEY` or `NEBIUS_TOKEN` | Tess | OpenAI-compatible drafts + confidence score. |
| `NEBIUS_BASE_URL` | Tess | Default `https://api.studio.nebius.com/v1` |
| `OPENAI_API_KEY` + `OPENAI_BASE_URL` | Tess | Alternate if Nebius is exposed as OpenAI-compat. |

Without keys, Reed still fetches public event HTML and Tess writes template notes from those live entities. The header shows **LinkUp live / waiting** and **Nebius live / waiting**.

`GET /api/health` reports which integrations are configured (no secrets).

## 2-minute demo

1. `/` — **Meet your assistant**
2. `/app` — **Follow up Burning Token** (one tap, no paste)
3. Watch Mira / Reed / Tess on live research and drafts
4. Outcome pack → **Approve remaining** (not emailed)

## Deploy on Render

1. New Web Service from this repo (`render.yaml` included)
2. Build: `npm install && npm run build`
3. Start: `npm start` (long-lived Node — in-process worker + one retry per failed stage)
4. Add `LINKUP_API_KEY` and `NEBIUS_API_KEY` (or `OPENAI_*`)
5. Health check: `/api/health`

Vercel works for the UI but serverless isolates reset the worker. Prefer Render for the live crew.

## Out of scope

Auth, calendar, real email, multi-tenant.
