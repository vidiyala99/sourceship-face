import {
  BURNING_TOKEN_CATALOG,
  isDemoEventUrl,
  matchCatalog,
} from "./catalog";
import { extractTitle, extractUrls, stripHtml } from "./html";
import { searchLinkup } from "./linkup";
import type { ResearchBundle, ResearchHit, SourceRef } from "./types";

const USER_AGENT =
  "SourceShip/0.1 (Burning Token demo; follow-up research; +https://burningtoken.dev)";

export async function researchEvent(eventUrl: string): Promise<ResearchBundle> {
  const urls = expandUrls(eventUrl);
  const pages = await Promise.all(urls.map((url) => fetchPage(url)));
  const sources: SourceRef[] = pages.map((page) => ({
    title: page.title || hostname(page.url),
    url: page.url,
    fetched: page.ok,
  }));

  let pageText = pages
    .filter((p) => p.ok)
    .map((p) => `SOURCE ${p.url}\n${p.title}\n${p.text}`)
    .join("\n\n");

  const linkup = await searchLinkup(
    `Burning Token AI hackathon sponsors partners NERDCONF Frontier Tower ${eventUrl}`,
  );
  if (linkup) {
    pageText += `\n\nSOURCE linkup\n${linkup}`;
    sources.push({
      title: "LinkUp search",
      url: "https://api.linkup.so/v1/search",
      fetched: true,
    });
  }

  let hits = hitsFromText(pageText);
  let usedFixture = false;

  if (hits.length === 0 && isDemoEventUrl(eventUrl)) {
    usedFixture = true;
    hits = fixtureHits();
    pageText +=
      "\n\nFIXTURE: live HTML was thin or blocked; using entities verified from public Burning Token pages (Luma + burningtoken.dev).";
  }

  const eventTitle =
    pages.find((p) => p.ok && /burning token/i.test(p.title))?.title ||
    pages.find((p) => p.ok && p.title)?.title ||
    "Burning Token follow-up";

  return {
    eventTitle,
    sources,
    pageText,
    hits,
    usedFixture,
  };
}

function expandUrls(eventUrl: string): string[] {
  const urls = [eventUrl];
  if (isDemoEventUrl(eventUrl)) {
    urls.push(
      "https://burningtoken.dev",
      "https://luma.com/burningtoken-online",
    );
  }
  return [...new Set(urls)].slice(0, 4);
}

async function fetchPage(url: string): Promise<{
  url: string;
  ok: boolean;
  title: string;
  text: string;
}> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const html = await res.text();
    const text = stripHtml(html);
    const title = extractTitle(html) || "";
    const extra = extractUrls(text)
      .filter((u) => /burningtoken|nerdconf|frontiertower/i.test(u))
      .slice(0, 3);
    return {
      url,
      ok: res.ok && text.length > 80,
      title,
      text: [text, extra.join(" ")].join(" ").slice(0, 20000),
    };
  } catch {
    return { url, ok: false, title: "", text: "" };
  }
}

function hitsFromText(text: string): ResearchHit[] {
  if (!text.trim()) return [];
  return matchCatalog(text).map((entity) => {
    const evidence = snippetAround(text, entity.aliases[0] || entity.name);
    return {
      name: entity.name,
      kind: entity.kind,
      role: entity.role,
      why: entity.why,
      source: evidence ? "page mention" : "catalog match",
      sourceUrl: sourceUrlFor(entity.name, text),
      evidence,
    };
  });
}

function fixtureHits(): ResearchHit[] {
  return BURNING_TOKEN_CATALOG.map((entity) => ({
    name: entity.name,
    kind: entity.kind,
    role: entity.role,
    why: entity.why,
    source: "verified public event pages",
    sourceUrl: "https://luma.com/burningtoken",
    evidence: entity.why,
  }));
}

function snippetAround(text: string, needle: string): string {
  const idx = text.toLowerCase().indexOf(needle.toLowerCase());
  if (idx < 0) return "";
  const start = Math.max(0, idx - 80);
  const end = Math.min(text.length, idx + needle.length + 120);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function sourceUrlFor(name: string, text: string): string | undefined {
  if (/frontier/i.test(name) && /frontiertower/i.test(text)) {
    return "https://frontiertower.io/";
  }
  if (/nerdconf/i.test(name)) return "https://burningtoken.dev";
  return undefined;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
