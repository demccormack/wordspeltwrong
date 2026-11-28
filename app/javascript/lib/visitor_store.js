export const STORAGE_KEY = "wordspeltwrong.visitor";
export const CURRENT_VERSION = 2;

const emptyState = (now = new Date()) => ({
  version: CURRENT_VERSION,
  onboardingComplete: false,
  profile: {
    firstName: "",
    yearsExperience: "",
    innovation: "",
    flatnessPreference: "",
    favouriteWeather: "",
  },
  progress: {
    establishedAt: now.toISOString(),
    flattenings: [],
    observedEntropy: 0,
    meetingsAvoided: 0,
  },
  achievements: [],
  notifications: [],
});

const availableStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const validState = (state) =>
  state &&
  state.version === CURRENT_VERSION &&
  typeof state.onboardingComplete === "boolean" &&
  state.profile &&
  typeof state.profile.firstName === "string" &&
  state.profile.firstName.length <= 40 &&
  typeof state.profile.yearsExperience === "string" &&
  state.profile.yearsExperience.length <= 100 &&
  typeof state.profile.innovation === "string" &&
  state.profile.innovation.length <= 100 &&
  typeof state.profile.flatnessPreference === "string" &&
  state.profile.flatnessPreference.length <= 100 &&
  typeof state.profile.favouriteWeather === "string" &&
  state.profile.favouriteWeather.length <= 100 &&
  state.progress &&
  typeof state.progress.establishedAt === "string" &&
  Number.isFinite(Date.parse(state.progress.establishedAt)) &&
  Array.isArray(state.progress.flattenings) &&
  state.progress.flattenings.every(
    (event) =>
      event &&
      typeof event.at === "string" &&
      Number.isFinite(Date.parse(event.at)) &&
      typeof event.day === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(event.day),
  ) &&
  Number.isSafeInteger(state.progress.observedEntropy) &&
  state.progress.observedEntropy >= 0 &&
  Number.isInteger(state.progress.meetingsAvoided) &&
  state.progress.meetingsAvoided >= 0 &&
  Array.isArray(state.achievements) &&
  state.achievements.length <= 10 &&
  state.achievements.every((achievement) => typeof achievement === "string") &&
  Array.isArray(state.notifications) &&
  state.notifications.length <= 4 &&
  state.notifications.every(
    (notification) =>
      typeof notification === "string" && notification.length <= 250,
  );

export const VisitorStore = {
  create: emptyState,

  load() {
    const storage = availableStorage();
    if (!storage) return null;

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const state = JSON.parse(raw);
      if (!validState(state)) {
        storage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch {
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        return null;
      }
      return null;
    }
  },

  save(state) {
    const storage = availableStorage();
    if (!storage || !validState(state)) return false;

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  },

  reset() {
    try {
      availableStorage()?.removeItem(STORAGE_KEY);
    } catch {
      return false;
    }
    return true;
  },
};
