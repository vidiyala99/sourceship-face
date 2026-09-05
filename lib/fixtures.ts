import type { EventInfo, Pack, Person } from "./types";

export const SCOUT_EVENT: EventInfo = {
  url: "https://luma.com/burningtoken",
  title: "BURNING TOKEN, the AI Global hackathon",
  when: "2026-09-05 SF kickoff → 2026-09-12 submit",
  host: "NERDCONF",
  venue: "Frontier Tower @ Spaceship, 995 Market St, San Francisco",
};

export const SCOUT_PEOPLE: Person[] = [
  {
    person_id: "p_nerdconf",
    name: "NERDCONF",
    role: "Event host",
    org: "NERDCONF",
    context:
      "burningtoken.dev is a NERDCONF event; sponsor contact hey@nerdconf.com on Luma",
    links: ["https://burningtoken.dev", "mailto:hey@nerdconf.com"],
  },
  {
    person_id: "p_frontier",
    name: "Frontier Tower",
    role: "IRL venue / presenter",
    org: "Frontier Tower",
    context:
      "Luma hosts kickoff at Frontier Tower @ Spaceship, 995 Market St; apply https://frontiertower.io/apply",
    links: ["https://frontiertower.io/"],
  },
  {
    person_id: "p_nebius",
    name: "Nebius",
    role: "Challenge / AI partner",
    org: "Nebius",
    context:
      "Named with NERDCONF on invite coverage; online Luma lists Nebius among brought-to-you-by",
    links: ["https://luma.com/burningtoken-online"],
  },
  {
    person_id: "p_render",
    name: "Render",
    role: "Sponsor / challenge partner",
    org: "Render",
    context:
      "Online Luma: brought to you by Convex, Nebius, LinkUp, Tenki.Cloud and Render",
    links: ["https://luma.com/burningtoken-online"],
  },
  {
    person_id: "p_linkup",
    name: "LinkUp",
    role: "Sponsor",
    org: "LinkUp",
    context:
      "Listed on https://luma.com/burningtoken-online brought-to-you-by line",
    links: ["https://luma.com/burningtoken-online"],
  },
  {
    person_id: "p_convex",
    name: "Convex",
    role: "Sponsor",
    org: "Convex",
    context: "Same online Luma sponsor line; also named in NERDCONF promo",
    links: ["https://luma.com/burningtoken-online"],
  },
];

export const BRAIN_PACK: Pack = {
  shortlist: [
    {
      person_id: "p_nerdconf",
      name: "NERDCONF",
      role: "Event host",
      why: "burningtoken.dev is a NERDCONF event; Luma lists sponsor contact hey@nerdconf.com — first thank-you and partnership path.",
      note: "Thank you for hosting Burning Token. We’d like to follow up on a partnership and shout-out the team that made the IRL kickoff happen.",
      score: 0.91,
    },
    {
      person_id: "p_frontier",
      name: "Frontier Tower",
      role: "IRL venue / presenter",
      why: "Luma hosts the SF kickoff at Frontier Tower @ Spaceship, 995 Market St; apply path is frontiertower.io/apply.",
      note: "Thanks for hosting the kickoff at Frontier Tower @ Spaceship. We’d like to explore a follow-on space or partnership.",
      score: 0.74,
    },
    {
      person_id: "p_nebius",
      name: "Nebius",
      role: "Challenge / AI partner",
      why: "Named with NERDCONF on invite coverage; the online Luma page lists them among brought-to-you-by.",
      note: "Appreciate the challenge partnership on Burning Token. Happy to recap what we built and stay in the loop on future challenges.",
      score: 0.62,
    },
    {
      person_id: "p_render",
      name: "Render",
      role: "Sponsor / challenge partner",
      why: "Online Luma brought-to-you-by line includes them alongside the other named partners.",
      note: "Thanks for backing the online track. Sharing a short recap of our project and an open door for a follow-up.",
      score: 0.58,
    },
    {
      person_id: "p_linkup",
      name: "LinkUp",
      role: "Sponsor",
      why: "Listed on the online Luma brought-to-you-by line.",
      note: "Thank you for backing the online track. Quick note of appreciation and a line if you want a recap of what we shipped.",
      score: 0.55,
    },
    {
      person_id: "p_convex",
      name: "Convex",
      role: "Sponsor",
      why: "Same online Luma sponsor line; also named in NERDCONF promo.",
      note: "Thanks for showing up as a sponsor on the online track. Sending a brief thank-you and a recap offer.",
      score: 0.54,
    },
  ],
  summary:
    "Thank the host and IRL venue first, then named partners from public event pages. Every why is grounded in Scout context. No invented attendees.",
  metrics: {
    avg_score: 0.657,
    n_people: 6,
    latency_ms: 10800,
    grounded_pct: 1.0,
  },
};
