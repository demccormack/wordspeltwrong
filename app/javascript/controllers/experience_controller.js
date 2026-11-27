import { Controller } from "@hotwired/stimulus"
import { VisitorStore } from "lib/visitor_store"

const ACHIEVEMENTS = {
  "founding-stakeholder": { name: "Founding Stakeholder", detail: "You arrived before the org chart." },
  "one-percent-flatter": { name: "1% Flatter", detail: "You made the hierarchy meaningfully less meaningful." }
}

const PROFILE_DEFAULTS = {
  yearsExperience: "Not quantified",
  innovation: "It’s complicated",
  flatnessPreference: "We’ll discover this together",
  fiveSprints: "Open to emergent outcomes"
}

export default class extends Controller {
  static targets = [
    "screen", "nameInput", "yearsInput", "innovationInput", "flatnessInput", "sprintsInput",
    "greeting", "flatnessValue", "flatnessBar", "flatnessFill", "meetingsValue", "notification",
    "notifications", "achievements", "achievementCount", "profileName", "role", "profileYears",
    "profileInnovation", "profileFlatness", "profileSprints"
  ]

  connect() {
    this.state = VisitorStore.load() || VisitorStore.create()
    if (this.state.onboardingComplete) {
      this.renderProfile()
      this.renderDashboard()
      this.showScreen("dashboard")
    } else {
      this.showScreen("welcome")
    }
  }

  start() {
    this.showScreen("name")
    this.nameInputTarget.focus()
  }

  continueOnboarding(event) {
    event.preventDefault()
    this.pendingName = this.nameInputTarget.value.trim().slice(0, 40)
    this.showScreen("questions")
  }

  continueAnonymously() {
    this.pendingName = ""
    this.showScreen("questions")
  }

  finishOnboarding(event) {
    event.preventDefault()
    this.state = VisitorStore.create()
    this.state.onboardingComplete = true
    this.state.profile = {
      firstName: this.pendingName || "",
      yearsExperience: this.yearsInputTarget.value,
      innovation: this.innovationInputTarget.value,
      flatnessPreference: this.flatnessInputTarget.value,
      fiveSprints: this.sprintsInputTarget.value
    }
    this.state.achievements = ["founding-stakeholder"]
    this.addNotification("Welcome aboard. Your role is Founding Stakeholder; your reporting line is still under review.")
    VisitorStore.save(this.state)
    this.renderProfile()
    this.renderDashboard()
    this.showScreen("dashboard")
    this.element.dispatchEvent(new CustomEvent("experience:welcome", { bubbles: true }))
  }

  flatten() {
    if (!this.state.onboardingComplete) return

    this.state.progress.flatness = Math.min(100, this.state.progress.flatness + 1)
    this.state.progress.meetingsAvoided += 1
    if (!this.state.achievements.includes("one-percent-flatter")) {
      this.state.achievements.push("one-percent-flatter")
      this.addNotification("Achievement unlocked: 1% Flatter. The organisation has noticed your strategic absence.")
    } else {
      this.addNotification("Hierarchy reduced by 1%. A new alignment meeting has been proposed.")
    }
    VisitorStore.save(this.state)
    this.renderDashboard()
  }

  showDashboard() {
    this.renderDashboard()
    this.showScreen("dashboard")
  }

  showProfile() {
    this.renderProfile()
    this.showScreen("profile")
  }

  reset() {
    VisitorStore.reset()
    this.state = VisitorStore.create()
    this.showScreen("welcome")
  }

  showScreen(name) {
    this.screenTargets.forEach((screen) => {
      screen.hidden = screen.dataset.experienceScreenName !== name
    })
  }

  addNotification(message) {
    this.state.notifications.unshift(message)
    this.state.notifications = this.state.notifications.slice(0, 4)
  }

  renderDashboard() {
    this.greetingTarget.textContent = this.state.profile.firstName || "Stakeholder"
    const flatness = Math.min(100, Math.max(0, this.state.progress.flatness))
    this.flatnessValueTarget.textContent = flatness
    this.flatnessBarTarget.setAttribute("aria-valuenow", flatness)
    this.flatnessFillTarget.style.width = `${flatness}%`
    this.meetingsValueTarget.textContent = this.state.progress.meetingsAvoided || 0
    this.notificationTarget.replaceChildren()
    this.notificationsTarget.replaceChildren()
    this.state.notifications.forEach((message, index) => {
      const item = document.createElement("li")
      item.className = "notification"
      const icon = document.createElement("span")
      icon.setAttribute("aria-hidden", "true")
      icon.textContent = index === 0 ? "✨" : "📊"
      const copy = document.createElement("p")
      copy.textContent = message
      item.append(icon, copy)
      this.notificationsTarget.append(item)
    })
    this.achievementsTarget.replaceChildren()
    const achievements = this.state.achievements
      .map((key) => ACHIEVEMENTS[key])
      .filter(Boolean)
    this.achievementCountTarget.textContent = `${achievements.length} earned`
    achievements.forEach(({ name, detail }) => {
      const item = document.createElement("article")
      item.className = "rounded-xl border border-sparkle/40 bg-amber-50 p-4 animate-pop"
      const title = document.createElement("h3")
      title.className = "font-bold text-amber-800"
      title.textContent = `🏅 ${name}`
      const description = document.createElement("p")
      description.className = "mt-1 text-sm text-amber-900/80"
      description.textContent = detail
      item.append(title, description)
      this.achievementsTarget.append(item)
    })
  }

  renderProfile() {
    const { profile } = this.state
    this.profileNameTarget.textContent = profile.firstName || "Anonymous Stakeholder"
    this.roleTarget.textContent = this.state.achievements.includes("one-percent-flatter")
      ? "Director of Strategic Flatness"
      : "Founding Stakeholder"
    this.profileYearsTarget.textContent = profile.yearsExperience || PROFILE_DEFAULTS.yearsExperience
    this.profileInnovationTarget.textContent = profile.innovation || PROFILE_DEFAULTS.innovation
    this.profileFlatnessTarget.textContent = profile.flatnessPreference || PROFILE_DEFAULTS.flatnessPreference
    this.profileSprintsTarget.textContent = profile.fiveSprints || PROFILE_DEFAULTS.fiveSprints
  }
}
