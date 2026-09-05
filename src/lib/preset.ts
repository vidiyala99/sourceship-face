export const BURNING_TOKEN = {
  eventUrl: "https://luma.com/burningtoken",
  goal: "shortlist who to thank / partner with",
  ask: "Follow up Burning Token — draft coffee-chat notes for who to thank and partner with.",
  title: "Weekend follow-up · Burning Token",
};

export const BURNING_TOKEN_STARTER = "Follow up Burning Token";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isBurningTokenStarter(text: string): boolean {
  const value = normalize(text);
  if (!value) return false;
  return (
    value === normalize(BURNING_TOKEN_STARTER) ||
    value === normalize(BURNING_TOKEN.ask) ||
    value === normalize(BURNING_TOKEN.goal) ||
    value === normalize(BURNING_TOKEN.title)
  );
}

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
  const useCase = goal || ask;

  const usePreset =
    preset === "burningtoken" || isBurningTokenStarter(useCase);

  if (usePreset) {
    return {
      eventUrl: eventUrl || BURNING_TOKEN.eventUrl,
      goal: goal && !isBurningTokenStarter(goal) ? goal : BURNING_TOKEN.goal,
      ask: ask && !isBurningTokenStarter(ask) ? ask : BURNING_TOKEN.ask,
      title: BURNING_TOKEN.title,
    };
  }

  if (useCase) {
    return {
      eventUrl: eventUrl || BURNING_TOKEN.eventUrl,
      goal: useCase,
      ask: useCase,
      title: useCase.slice(0, 72),
    };
  }

  if (eventUrl) {
    return {
      eventUrl,
      goal: BURNING_TOKEN.goal,
      ask: `Follow up ${eventUrl}`,
      title: "Event follow-up",
    };
  }

  return {
    eventUrl: BURNING_TOKEN.eventUrl,
    goal: BURNING_TOKEN.goal,
    ask: BURNING_TOKEN.ask,
    title: BURNING_TOKEN.title,
  };
}
