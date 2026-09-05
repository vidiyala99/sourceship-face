import type { EntityKind } from "./types";

export type CatalogEntity = {
  name: string;
  aliases: string[];
  kind: EntityKind;
  role: string;
  why: string;
};

/** Real orgs/venues named on public Burning Token pages — never invented people. */
export const BURNING_TOKEN_CATALOG: CatalogEntity[] = [
  {
    name: "NERDCONF",
    aliases: ["nerdconf", "hey@nerdconf.com"],
    kind: "org",
    role: "Host / organizer",
    why: "Hosts Burning Token (a NERDCONF event). Public sponsor inbox is hey@nerdconf.com.",
  },
  {
    name: "Frontier Tower",
    aliases: ["frontier tower", "frontiertower", "frontiertower.io"],
    kind: "venue",
    role: "IRL host venue",
    why: "SF kickoff is hosted at Frontier Tower @ Spaceship, 995 Market Street.",
  },
  {
    name: "Nebius",
    aliases: ["nebius ai", "nebius"],
    kind: "org",
    role: "Challenge sponsor",
    why: "Named as a presenting/sponsor partner on the public event pages.",
  },
  {
    name: "Convex",
    aliases: ["convex"],
    kind: "org",
    role: "Challenge sponsor",
    why: "Listed as bringing the hackathon together on the online Luma page.",
  },
  {
    name: "Render",
    aliases: ["render"],
    kind: "org",
    role: "Challenge sponsor",
    why: "Named alongside Convex, Nebius, and LinkUp as a supporting partner.",
  },
  {
    name: "LinkUp",
    aliases: ["linkup", "linkup.so"],
    kind: "org",
    role: "Challenge sponsor",
    why: "Publicly listed as a Burning Token partner (research/search tooling).",
  },
  {
    name: "Tenki Cloud",
    aliases: ["tenki.cloud", "tenki cloud", "tenki"],
    kind: "org",
    role: "Challenge sponsor",
    why: "Named on the online event page as Tenki.Cloud, a supporting partner.",
  },
];

export const DEMO_EVENT_URLS = [
  "https://luma.com/burningtoken",
  "https://luma.com/burningtoken-online",
  "https://burningtoken.dev",
];

export function isDemoEventUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/$/, "");
    if (host === "luma.com" && path.startsWith("/burningtoken")) return true;
    if (host === "burningtoken.dev") return true;
    return false;
  } catch {
    return false;
  }
}

export function matchCatalog(text: string): CatalogEntity[] {
  const hay = text.toLowerCase();
  return BURNING_TOKEN_CATALOG.filter((entity) =>
    entity.aliases.some((alias) => hay.includes(alias.toLowerCase())),
  );
}
