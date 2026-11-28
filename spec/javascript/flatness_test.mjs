import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ENTROPY_INTERVAL,
  canFlatten,
  classification,
  effectiveCount,
  entropyCount,
  flatness,
  formatFlatness,
  formatImprovement,
  localDay,
  recentHistory,
} from "../../app/javascript/lib/flatness.js";
import { VisitorStore } from "../../app/javascript/lib/visitor_store.js";

const start = Date.parse("2026-01-01T12:00:00Z");
const progress = () => ({
  establishedAt: new Date(start).toISOString(),
  legacyFlattenings: 0,
  flattenings: [],
  observedEntropy: 0,
  meetingsAvoided: 0,
});

test("asymptotic flatness and unbounded dysfunction", () => {
  for (const [count, expected] of [
    [0, 730],
    [1, 732.7],
    [2, 735.373],
    [30, 800.28],
    [100, 901.17],
    [365, 993.11],
    [-100, 262.36],
    [-200, -1015.23],
  ])
    assert.ok(Math.abs(flatness(count) - expected) < 0.01);
  assert.ok(flatness(-1000) < -1000000);
  assert.ok(flatness(100000) < 1000);
  assert.match(formatFlatness(10000), /^1,000 − /);
  assert.match(formatFlatness(-100000), /^−/);
  assert.match(formatImprovement(100000), /10\^/);
});

test("entropy is based on establishment and actions reverse it exactly", () => {
  const state = progress();
  assert.equal(
    entropyCount(state.establishedAt, start + ENTROPY_INTERVAL - 1),
    0,
  );
  assert.equal(entropyCount(state.establishedAt, start + ENTROPY_INTERVAL), 1);
  assert.equal(effectiveCount(state, start + 3 * ENTROPY_INTERVAL), -3);
  for (let day = 0; day < 7; day++) {
    const date = new Date(start + day * 86400000);
    state.flattenings.push({ at: date.toISOString(), day: localDay(date) });
  }
  assert.equal(effectiveCount(state, start + ENTROPY_INTERVAL), 6);
  assert.equal(recentHistory(state, start + ENTROPY_INTERVAL).length, 8);
  assert.equal(
    recentHistory(state, start + 3 * ENTROPY_INTERVAL).filter(
      (event) => event.type === "Hierarchical Entropy",
    ).length,
    3,
  );
});

test("daily restriction and classifications", () => {
  const state = progress();
  const date = new Date(start);
  assert.ok(canFlatten(state, date));
  state.flattenings.push({ at: date.toISOString(), day: localDay(date) });
  assert.ok(!canFlatten(state, date));
  assert.ok(canFlatten(state, new Date(start + 86400000)));
  assert.equal(classification(0), "British pancake");
  assert.equal(classification(30), "French crêpe");
  assert.equal(classification(200), "Ultra-thin crêpe");
  assert.equal(classification(-200), "Loaf");
  for (const [threshold, above, below] of [
    [950, "Ultra-thin crêpe", "French crêpe"],
    [800, "French crêpe", "British pancake"],
    [600, "British pancake", "Drop scone"],
    [400, "Drop scone", "Scotch pancake"],
    [200, "Scotch pancake", "American pancake"],
    [0, "American pancake", "Ciabatta"],
    [-500, "Ciabatta", "Loaf"],
  ]) {
    const boundary = Math.log((1000 - threshold) / 270) / Math.log(0.99);
    assert.equal(classification(Math.ceil(boundary)), above);
    assert.equal(classification(Math.floor(boundary)), below);
  }
});

test("visitor state persists and migrates legacy progress", () => {
  let saved;
  globalThis.window = {
    localStorage: {
      getItem: () => saved,
      setItem: (_key, value) => {
        saved = value;
      },
      removeItem: () => {
        saved = null;
      },
    },
  };
  const state = VisitorStore.create(new Date(start));
  state.onboardingComplete = true;
  state.progress.flattenings.push({
    at: new Date(start).toISOString(),
    day: localDay(new Date(start)),
  });
  state.progress.observedEntropy = 2;
  assert.ok(VisitorStore.save(state));
  assert.deepEqual(VisitorStore.load(), state);
  state.version = 1;
  state.progress = { flatness: 75, meetingsAvoided: 2 };
  saved = JSON.stringify(state);
  const migrated = VisitorStore.load();
  assert.equal(migrated.version, 2);
  assert.equal(migrated.progress.legacyFlattenings, 2);
  assert.deepEqual(VisitorStore.load(), migrated);
  VisitorStore.reset();
  assert.equal(VisitorStore.load(), null);
});
