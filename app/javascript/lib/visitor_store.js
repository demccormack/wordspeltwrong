export const STORAGE_KEY = "wordspeltwrong.visitor"
export const CURRENT_VERSION = 1

const emptyState = () => ({
  version: CURRENT_VERSION,
  onboardingComplete: false,
  profile: {
    firstName: "",
    yearsExperience: "",
    innovation: "",
    flatnessPreference: "",
    fiveSprints: ""
  },
  progress: { flatness: 73, meetingsAvoided: 0 },
  achievements: [],
  notifications: []
})

const availableStorage = () => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const validState = (state) =>
  state &&
  state.version === CURRENT_VERSION &&
  typeof state.onboardingComplete === "boolean" &&
  state.profile &&
  typeof state.profile.firstName === "string" &&
  typeof state.profile.yearsExperience === "string" &&
  typeof state.profile.innovation === "string" &&
  typeof state.profile.flatnessPreference === "string" &&
  typeof state.profile.fiveSprints === "string" &&
  state.progress &&
  Number.isInteger(state.progress.flatness) &&
  Number.isInteger(state.progress.meetingsAvoided) &&
  Array.isArray(state.achievements) &&
  state.achievements.every((achievement) => typeof achievement === "string") &&
  Array.isArray(state.notifications) &&
  state.notifications.every((notification) => typeof notification === "string")

export const VisitorStore = {
  create: emptyState,

  load() {
    const storage = availableStorage()
    if (!storage) return null

    try {
      const raw = storage.getItem(STORAGE_KEY)
      if (!raw) return null

      const state = JSON.parse(raw)
      if (!validState(state)) {
        storage.removeItem(STORAGE_KEY)
        return null
      }

      return state
    } catch {
      try {
        storage.removeItem(STORAGE_KEY)
      } catch {
        return null
      }
      return null
    }
  },

  save(state) {
    const storage = availableStorage()
    if (!storage || !validState(state)) return false

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state))
      return true
    } catch {
      return false
    }
  },

  reset() {
    try {
      availableStorage()?.removeItem(STORAGE_KEY)
    } catch {
      return false
    }
    return true
  }
}
