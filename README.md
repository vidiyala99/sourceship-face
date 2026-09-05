# SourceShip Face

Assign-and-leave task board for post-event follow-up. One job type: **Follow up this event**.

Paste a public Luma/event URL and a short goal → **Assign** → walk away → come back to a done pack → batch **Approve** (UI only — nothing is sent).

## Demo in under 2 minutes

1. Board shows one job: **Follow up this event**
2. URL is prefilled with `https://luma.com/burningtoken` and goal `shortlist who to thank / partner with` → **Assign** → walk-away beat
3. Stages: Queued → Researching → (flash **Retrying**) → Drafting → Ready
4. Pack: shortlist who / why / note / score → **Approve selected** or **Approve all** (no send)
5. Feeling: assign → leave → done

Demo mode runs this timeline locally in ~8–12 seconds. No backend required.

## Run (demo mode)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo mode is **on by default** (`NEXT_PUBLIC_DEMO_MODE` is treated as true unless it is exactly `false`). Assign plays the local stage timeline and loads the fixture pack.

Optional `.env.local`:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

## Point at a live Engine

Create `.env.local`:

```bash
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Restart `npm run dev`. Assign then:

- `POST /jobs` with `{ "event_url": string, "goal": string }` → `{ "job_id": string }`
- `GET /jobs/:id` every ~1s until `ready` or `failed`

Statuses: `queued | researching | drafting | ready | failed | retrying`

## Notes

- No auth, no history page, no chat box.
- Approve is UI-only (toast + card state). No email is sent.
- `npm run build` / `npm start` for a production build.
