export const CREPE_LIMIT = 1000;
export const INITIAL_FLATNESS = 730;
export const ENTROPY_INTERVAL = 7 * 24 * 60 * 60 * 1000;

const LOG_DECAY = Math.log(0.99);
const LOG_INITIAL_THICKNESS = Math.log(270);

export function entropyCount(establishedAt, now = Date.now()) {
  return Math.max(
    0,
    Math.floor((now - Date.parse(establishedAt)) / ENTROPY_INTERVAL),
  );
}

export function effectiveCount(progress, now = Date.now()) {
  return (
    progress.legacyFlattenings +
    progress.flattenings.length -
    entropyCount(progress.establishedAt, now)
  );
}

export function flatness(count) {
  return CREPE_LIMIT - Math.exp(LOG_INITIAL_THICKNESS + count * LOG_DECAY);
}

function scientific(logValue) {
  const exponent = Math.floor(logValue / Math.LN10);
  const mantissa = Math.exp(logValue - exponent * Math.LN10);
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}

export function formatFlatness(count) {
  const logThickness = LOG_INITIAL_THICKNESS + count * LOG_DECAY;
  const value = flatness(count);
  if (!Number.isFinite(value)) return `−${scientific(logThickness)}`;
  if (value >= 999.995) return `1,000 − ${scientific(logThickness)}`;
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatImprovement(count) {
  const logImprovement = LOG_INITIAL_THICKNESS + count * LOG_DECAY + Math.log(0.01);
  const improvement = Math.exp(logImprovement);
  if (!Number.isFinite(improvement) || improvement < 0.01)
    return scientific(logImprovement);
  return improvement.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function classification(count) {
  const value = flatness(count);
  if (value >= 950) return "Ultra-thin crêpe";
  if (value >= 800) return "French crêpe";
  if (value >= 600) return "British pancake";
  if (value >= 400) return "Drop scone";
  if (value >= 200) return "Scotch pancake";
  if (value >= 0) return "American pancake";
  if (value >= -500) return "Ciabatta";
  return "Loaf";
}

export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function canFlatten(progress, date = new Date()) {
  return !progress.flattenings.some((event) => event.day === localDay(date));
}

export function recentHistory(progress, now = Date.now(), limit = 20) {
  const count = entropyCount(progress.establishedAt, now);
  const established = Date.parse(progress.establishedAt);
  const events = progress.flattenings.map((event) => ({
    at: event.at,
    type: "Deliberate flattening",
  }));
  for (let index = Math.max(1, count - limit + 1); index <= count; index++) {
    events.push({
      at: new Date(established + index * ENTROPY_INTERVAL).toISOString(),
      type: "Hierarchical Entropy",
    });
  }
  return events
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, limit);
}
