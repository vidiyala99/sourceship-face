# SourceShip

An assistant crew. You hand work off. They look things up, talk it through, and bring back an outcome.

This slice is one job: follow up Burning Token — who to thank, coffee-chat notes, approve (no send).

## Run

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## 2-minute demo

1. Landing: one button — **Meet your assistant**.
2. App: one tap — **Follow up Burning Token**. No URL to paste.
3. Watch Mira, Reed, and Tess collaborate (look up → gather → draft).
4. Outcome pack: NERDCONF, Nebius, Render, LinkUp + coffee-chat notes + confidence.
5. **Approve** / **Approve remaining**. Nothing is emailed.

## Notes

- The live crew is a fixture-backed demo so the UI never hard-fails.
- Optional later: `OPENAI_API_KEY`, `NEBIUS_*`, `LINKUP_API_KEY`.
- Jobs sit in memory and `/tmp/sourceship-jobs.json`.

## Deploy

**Render:** Web Service, `npm install && npm run build`, `npm start`.

**Vercel:** `npx vercel`. Serverless resets the in-memory desk; local or Render is better for the live crew.

## Out of scope

Auth, calendar, real email, multi-tenant, extra job types.
