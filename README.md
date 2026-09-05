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
| `NEBIUS_BASE_URL` | Tess | Default `https://api.tokenfactory.nebius.com/v1` |
| `OPENAI_API_KEY` + `OPENAI_BASE_URL` | Tess | Alternate if Nebius is exposed as OpenAI-compat. |

Without keys, Reed still fetches public event HTML and Tess writes notes from those live entities. The header says **Using public pages** / **Drafting from what we found** — never credential status.

`GET /api/health` reports which integrations are configured (no secrets).

## 2-minute demo

1. `/` — **Meet your assistant**
2. `/app` — **Follow up Burning Token** (one tap, no paste)
3. Watch Mira / Reed / Tess on live research and drafts
4. Outcome pack → **Approve remaining** (not emailed)

## Deploy on Render (public demo)

`render.yaml` is in the repo. The worker is in-process (`npm start` = long-lived Node). `PORT` comes from Render.

**A. Blueprint (fastest)**
1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect this Git repo (branch `main`)
3. Apply `render.yaml` (service `sourceship`)
4. In the service → **Environment**, paste:
   - `LINKUP_API_KEY` = value from `/workspace/secrets/LINKUP_API_KEY`
   - `NEBIUS_API_KEY` = value from `/workspace/secrets/NEBIUS_API_KEY`
5. Deploy. Confirm `https://<service>.onrender.com/api/health` is  
   `{ "ok": true, "linkup": true, "llm": true, "llmProvider": "nebius" }`
6. Public app: `https://<service>.onrender.com`

**B. Manual Web Service**
1. **New** → **Web Service** → this repo
2. Runtime: Node · Build: `npm install && npm run build` · Start: `npm start`
3. Health check: `/api/health`
4. Same env vars as above (`NEBIUS_BASE_URL` defaults in `render.yaml`)

Do not commit secrets. `.env.local` and `/workspace/secrets/*` are gitignored.

Vercel is UI-only; serverless resets the worker. Use Render for the live crew.

## Out of scope

Auth, calendar, real email, multi-tenant.
