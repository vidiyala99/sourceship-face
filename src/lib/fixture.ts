import type { CrewAgent, JobResult, ShortlistItem } from "./types";

export const FIXTURE_PACK: JobResult = {
  eventTitle: "Burning Token, the AI Global hackathon",
  summary:
    "Coffee-chat shortlist from this weekend: hosts and sponsors named on the public Burning Token pages. No invented people.",
  sources: [
    { title: "Luma · Burning Token", url: "https://luma.com/burningtoken", fetched: true },
    { title: "burningtoken.dev", url: "https://burningtoken.dev", fetched: true },
  ],
  overallConfidence: 88,
  draftMode: "template",
  shortlist: [
    note(
      "NERDCONF",
      "org",
      "Host",
      "A NERDCONF event — they ran the week and left hey@nerdconf.com for partners.",
      "Coffee after Burning Token?",
      "I was at Burning Token this weekend and wanted to thank you for hosting — for nerds, by nerds, actually shipped.\n\nWould you have 20 minutes this week for coffee or a short call? I’d like to share what we built and ask who on your side is the right partner for a follow-on.\n\nIf now is chaos, a later intro is perfect.",
    ),
    note(
      "Nebius",
      "org",
      "Challenge sponsor",
      "Named as a presenting partner on the public event pages.",
      "Thank you + a short coffee?",
      "Thank you for backing Burning Token — your name was on the wall the whole week.\n\nI’m putting a tight thank-you / partner list together from the weekend. If a 20-minute coffee is useful (what builders actually used, what to do next), I’m around in SF / online.\n\nNo pitch deck. Just a debrief.",
    ),
    note(
      "Render",
      "org",
      "Challenge sponsor",
      "Listed with Convex, Nebius, and LinkUp as bringing the hackathon together.",
      "Weekend thank-you from Burning Token",
      "Quick thank-you from Burning Token. Render showed up as a real sponsor, not logo wallpaper.\n\nI’d love a short coffee chat — what you hoped builders would try, and whether a small next step is even interesting.\n\nIf the wrong inbox, point me.",
    ),
    note(
      "LinkUp",
      "org",
      "Challenge sponsor",
      "Publicly listed as a Burning Token partner on the online event page.",
      "Coffee after the hackathon?",
      "I spent the week on Burning Token and LinkUp was one of the names I kept seeing — and using.\n\nWould you take a 20-minute coffee chat? I want to thank you properly and hear what a good builder partnership looks like after a week like this.\n\nI’ll keep it human.",
    ),
  ],
};

export const CREW_SCRIPT: {
  agent: CrewAgent;
  text: string;
  stage: "queued" | "researching" | "drafting" | "ready";
  delay: number;
}[] = [
  {
    agent: "mira",
    text: "Got it. Weekend follow-up for Burning Token — thank / partner, coffee-chat notes. I’ll run the crew.",
    stage: "queued",
    delay: 700,
  },
  {
    agent: "mira",
    text: "Reed, look up the public pages. Tess, wait for names that are actually on them.",
    stage: "researching",
    delay: 900,
  },
  {
    agent: "reed",
    text: "Opening the Luma event and burningtoken.dev. Gathering hosts and sponsors only.",
    stage: "researching",
    delay: 1100,
  },
  {
    agent: "reed",
    text: "NERDCONF is the host. Nebius, Render, and LinkUp are named as partners. No random people.",
    stage: "researching",
    delay: 1100,
  },
  {
    agent: "reed",
    text: "Handing Mira four grounded names. That’s the shortlist.",
    stage: "researching",
    delay: 800,
  },
  {
    agent: "mira",
    text: "Good. Tess — write coffee-chat notes, one per name. Thank-you first, ask second.",
    stage: "drafting",
    delay: 900,
  },
  {
    agent: "tess",
    text: "Drafting four send-ready notes. Short, specific, no invented contacts.",
    stage: "drafting",
    delay: 1200,
  },
  {
    agent: "tess",
    text: "Pack is ready. Mira, you can take it back.",
    stage: "drafting",
    delay: 700,
  },
  {
    agent: "mira",
    text: "Outcome is on your desk. Shortlist, why, notes. You approve — we don’t send.",
    stage: "ready",
    delay: 400,
  },
];

function note(
  name: string,
  kind: ShortlistItem["kind"],
  role: string,
  why: string,
  subject: string,
  body: string,
): ShortlistItem {
  return {
    id: `fx-${name.toLowerCase()}`,
    name,
    kind,
    role,
    why,
    source: "public Burning Token pages",
    note: { subject, body },
    confidence: 86 + (name.length % 6),
    approved: false,
  };
}
