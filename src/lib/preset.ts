export const BURNING_TOKEN = {
  eventUrl: "https://luma.com/burningtoken",
  goal: "shortlist who to thank / partner with",
  ask: "Follow up Burning Token — draft coffee-chat notes for who to thank and partner with.",
  title: "Weekend follow-up · Burning Token",
};

export function resolveAssignment(input: {
  preset?: string;
  ask?: string;
  eventUrl?: string;
  goal?: string;
}): {
  eventUrl: string;
  goal: string;
  ask: string;
  title: string;
} {
  const ask = (input.ask ?? "").trim();
  const eventUrl = (input.eventUrl ?? "").trim();
  const goal = (input.goal ?? "").trim();
  const preset = (input.preset ?? "").trim();

  const usePreset =
    preset === "burningtoken" ||
    (!eventUrl && (!ask || /weekend|burning|coffee|thank|partner|follow/i.test(ask)));

  if (usePreset) {
    return {
      eventUrl: eventUrl || BURNING_TOKEN.eventUrl,
      goal: goal || BURNING_TOKEN.goal,
      ask: ask || BURNING_TOKEN.ask,
      title: BURNING_TOKEN.title,
    };
  }

  if (!eventUrl) {
    return {
      eventUrl: BURNING_TOKEN.eventUrl,
      goal: goal || BURNING_TOKEN.goal,
      ask: ask || BURNING_TOKEN.ask,
      title: BURNING_TOKEN.title,
    };
  }

  return {
    eventUrl,
    goal: goal || ask || BURNING_TOKEN.goal,
    ask: ask || `Follow up ${eventUrl}`,
    title: ask ? ask.slice(0, 64) : "Event follow-up",
  };
}
