import assert from "node:assert/strict";
import {
  BURNING_TOKEN,
  BURNING_TOKEN_STARTER,
  resolveAssignment,
} from "./preset";

const custom = resolveAssignment({
  goal: "Find three designers in Berlin who could mentor our interns",
});
assert.equal(
  custom.goal,
  "Find three designers in Berlin who could mentor our interns",
);
assert.equal(
  custom.ask,
  "Find three designers in Berlin who could mentor our interns",
);
assert.notEqual(custom.title, BURNING_TOKEN.title);
assert.equal(custom.eventUrl, BURNING_TOKEN.eventUrl);

const starter = resolveAssignment({ goal: BURNING_TOKEN_STARTER });
assert.equal(starter.goal, BURNING_TOKEN.goal);
assert.equal(starter.ask, BURNING_TOKEN.ask);
assert.equal(starter.title, BURNING_TOKEN.title);

const preset = resolveAssignment({ preset: "burningtoken" });
assert.equal(preset.ask, BURNING_TOKEN.ask);
assert.equal(preset.title, BURNING_TOKEN.title);

const empty = resolveAssignment({});
assert.equal(empty.title, BURNING_TOKEN.title);

console.log("preset.resolveAssignment ok");
