import { Controller } from "@hotwired/stimulus";
import { VisitorStore } from "lib/visitor_store";
import {
  canFlatten,
  classification,
  effectiveCount,
  entropyCount,
  flatness,
  formatFlatness,
  formatImprovement,
  localDay,
  recentHistory,
} from "lib/flatness";

const ACHIEVEMENTS = {
  "founding-stakeholder": {
    name: "Founding Stakeholder",
    detail: "You arrived before the org chart.",
  },
  "one-percent-flatter": {
    name: "1% Flatter",
    detail: "You made the management hierarchy meaningfully less vertical.",
  },
};

const PROFILE_DEFAULTS = {
  yearsExperience: "Not quantified",
  innovation: "It’s complicated",
  flatnessPreference: "We’ll discover this together",
  favouriteWeather: "Open to emergent forecasts",
};

export default class extends Controller {
  static targets = [
    "screen",
    "nameInput",
    "yearsInput",
    "innovationInput",
    "flatnessInput",
    "weatherInput",
    "greeting",
    "flatnessValue",
    "flatnessBar",
    "flatnessFill",
    "flatnessClassification",
    "flatnessImprovement",
    "flattenButton",
    "flatnessHistory",
    "meetingsValue",
    "notification",
    "notifications",
    "achievements",
    "achievementCount",
    "profileName",
    "role",
    "profileYears",
    "profileInnovation",
    "profileFlatness",
    "profileWeather",
    "questionStage",
    "questionNumber",
    "questionProgress",
    "questionProgressFill",
    "welcomeName",
    "questionContinue",
  ];

  connect() {
    this.state = VisitorStore.load() || VisitorStore.create();
    this.storageFailed = false;
    if (this.state.onboardingComplete) {
      this.renderProfile();
      this.renderDashboard();
      this.showScreen("dashboard");
    } else {
      this.showScreen("welcome");
    }
    this.refreshTimer = window.setInterval(() => {
      if (this.state.onboardingComplete) this.renderDashboard();
    }, 60_000);
  }

  disconnect() {
    window.clearInterval(this.refreshTimer);
  }

  start() {
    this.showScreen("name");
    this.nameInputTarget.focus();
  }

  continueOnboarding(event) {
    event.preventDefault();
    this.pendingName = this.nameInputTarget.value.trim().slice(0, 40);
    this.startQuestions();
  }

  continueAnonymously() {
    this.pendingName = "";
    this.startQuestions();
  }

  startQuestions() {
    this.answers = {};
    this.questionIndex = 0;
    this.welcomeNameTarget.textContent = this.pendingName
      ? `${this.pendingName}, we're so glad you're here.`
      : "We're so glad you're here.";
    this.showScreen("questions");
    this.showQuestion();
  }

  answerQuestion(event) {
    event.preventDefault();
    const fields = [
      "yearsExperience",
      "innovation",
      "flatnessPreference",
      "favouriteWeather",
    ];
    const targets = [
      this.yearsInputTarget,
      this.innovationInputTarget,
      this.flatnessInputTarget,
      this.weatherInputTarget,
    ];
    this.answers[fields[this.questionIndex]] =
      targets[this.questionIndex].value;

    if (this.questionIndex < fields.length - 1) {
      this.questionIndex += 1;
      this.showQuestion();
      return;
    }

    this.finishOnboarding();
  }

  finishOnboarding() {
    this.state = VisitorStore.create();
    this.state.onboardingComplete = true;
    this.state.profile = {
      firstName: this.pendingName || "",
      ...this.answers,
    };
    this.state.achievements = ["founding-stakeholder"];
    this.addNotification(
      "Welcome aboard. Your role is Founding Stakeholder; your reporting line is still under review.",
    );
    this.persistState();
    this.renderProfile();
    this.renderDashboard();
    this.showScreen("dashboard");
    this.element.dispatchEvent(
      new CustomEvent("experience:welcome", { bubbles: true }),
    );
  }

  flatten() {
    if (!this.state.onboardingComplete) return;

    if (!this.storageFailed) this.state = VisitorStore.load() || this.state;
    const now = new Date();
    this.accountForEntropy(now.getTime());
    if (!canFlatten(this.state.progress, now)) {
      this.renderDashboard();
      return;
    }
    const before = effectiveCount(this.state.progress, now.getTime());
    const previousClassification = classification(before);
    this.state.progress.flattenings.push({
      at: now.toISOString(),
      day: localDay(now),
    });
    this.state.progress.meetingsAvoided += 1;
    const nextClassification = classification(before + 1);
    const recovery = flatness(before) < 0 && flatness(before + 1) >= 0;
    this.flatnessImprovementTarget.textContent = `+${formatImprovement(before)} mPc. Congratulations! You've eliminated 1% of your remaining hierarchical thickness. You're one step closer to the Crêpe Limit.`;
    if (recovery) {
      this.addNotification(
        "A significant organisational milestone: you have returned from the bread domain to the pancake domain.",
      );
    } else if (previousClassification !== nextClassification) {
      this.addNotification(
        `Organisational milestone: your maturity classification is now ${nextClassification}.`,
      );
    }
    if (!this.state.achievements.includes("one-percent-flatter")) {
      this.state.achievements.push("one-percent-flatter");
      this.addNotification(
        "Achievement unlocked: 1% Flatter. The organisation has noticed your strategic absence.",
      );
    }
    this.persistState();
    this.renderDashboard();
    this.element.dispatchEvent(
      new CustomEvent("experience:flattened", { bubbles: true }),
    );
  }

  showDashboard() {
    this.renderDashboard();
    this.showScreen("dashboard");
  }

  showProfile() {
    this.renderProfile();
    this.showScreen("profile");
  }

  reset() {
    VisitorStore.reset();
    this.state = VisitorStore.create();
    this.storageFailed = false;
    this.element.querySelectorAll("form").forEach((form) => form.reset());
    this.showScreen("welcome");
  }

  showScreen(name) {
    this.screenTargets.forEach((screen) => {
      screen.hidden = screen.dataset.experienceScreenName !== name;
    });
  }

  showQuestion() {
    this.questionStageTargets.forEach((stage, index) => {
      stage.hidden = index !== this.questionIndex;
    });
    const step = this.questionIndex + 2;
    const progress = step * 20;
    this.questionNumberTarget.textContent = `Step ${step} of 5`;
    this.questionProgressTarget.setAttribute("aria-valuenow", progress);
    this.questionProgressFillTarget.style.width = `${progress}%`;
    this.questionContinueTarget.textContent =
      this.questionIndex === this.questionStageTargets.length - 1
        ? "✨ Align me with the organisation ✨"
        : "Continue →";
  }

  addNotification(message) {
    this.state.notifications.unshift(message);
    this.state.notifications = this.state.notifications.slice(0, 4);
  }

  persistState() {
    if (VisitorStore.save(this.state)) {
      this.storageFailed = false;
      return;
    }
    if (!this.storageFailed) {
      this.addNotification(
        "Your progress could not be saved in this browser and may be lost when you leave.",
      );
    }
    this.storageFailed = true;
  }

  accountForEntropy(now = Date.now()) {
    const progress = this.state.progress;
    const count = entropyCount(progress.establishedAt, now);
    if (count > progress.observedEntropy) {
      const previous = classification(
        progress.legacyFlattenings +
          progress.flattenings.length -
          progress.observedEntropy,
      );
      const current = classification(effectiveCount(progress, now));
      this.addNotification(
        `Your organisation has experienced spontaneous hierarchical regrowth in accordance with the Law of Hierarchical Entropy (${count - progress.observedEntropy} event${count - progress.observedEntropy === 1 ? "" : "s"}), reducing organisational flatness.${previous !== current ? ` Its maturity classification is now ${current}.` : ""}`,
      );
      progress.observedEntropy = count;
      this.persistState();
    }
  }

  renderDashboard() {
    const now = new Date();
    this.accountForEntropy(now.getTime());
    this.greetingTarget.textContent =
      this.state.profile.firstName || "Stakeholder";
    const count = effectiveCount(this.state.progress, now.getTime());
    const value = flatness(count);
    const percentage = Math.min(100, Math.max(0, value / 10));
    this.flatnessValueTarget.textContent = formatFlatness(count);
    this.flatnessClassificationTarget.textContent = classification(count);
    this.flatnessBarTarget.setAttribute("aria-valuenow", percentage);
    this.flatnessBarTarget.setAttribute(
      "aria-valuetext",
      `${formatFlatness(count)} mPc; ${classification(count)}`,
    );
    this.flatnessFillTarget.style.width = `${percentage}%`;
    this.flattenButtonTarget.disabled = !canFlatten(this.state.progress, now);
    this.flatnessHistoryTarget.replaceChildren();
    recentHistory(this.state.progress, now.getTime()).forEach((event) => {
      const item = document.createElement("li");
      item.textContent = `${new Date(event.at).toLocaleDateString("en-GB")} — ${event.type}`;
      this.flatnessHistoryTarget.append(item);
    });
    this.meetingsValueTarget.textContent =
      this.state.progress.meetingsAvoided || 0;
    this.notificationTarget.replaceChildren();
    this.notificationsTarget.replaceChildren();
    this.state.notifications.forEach((message, index) => {
      const item = document.createElement("li");
      item.className = "notification";
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = index === 0 ? "✨" : "📊";
      const copy = document.createElement("p");
      copy.textContent = message;
      item.append(icon, copy);
      this.notificationsTarget.append(item);
    });
    this.achievementsTarget.replaceChildren();
    const achievements = this.state.achievements
      .map((key) => ACHIEVEMENTS[key])
      .filter(Boolean);
    this.achievementCountTarget.textContent = `${achievements.length} earned`;
    achievements.forEach(({ name, detail }) => {
      const item = document.createElement("article");
      item.className =
        "rounded-xl border border-sparkle/40 bg-amber-50 p-4 animate-pop";
      const title = document.createElement("h3");
      title.className = "font-bold text-amber-800";
      title.textContent = `🏅 ${name}`;
      const description = document.createElement("p");
      description.className = "mt-1 text-sm text-amber-900/80";
      description.textContent = detail;
      item.append(title, description);
      this.achievementsTarget.append(item);
    });
  }

  renderProfile() {
    const { profile } = this.state;
    this.profileNameTarget.textContent =
      profile.firstName || "Anonymous Stakeholder";
    this.roleTarget.textContent = this.state.achievements.includes(
      "one-percent-flatter",
    )
      ? "Director of Strategic Flatness"
      : "Founding Stakeholder";
    this.profileYearsTarget.textContent =
      profile.yearsExperience || PROFILE_DEFAULTS.yearsExperience;
    this.profileInnovationTarget.textContent =
      profile.innovation || PROFILE_DEFAULTS.innovation;
    this.profileFlatnessTarget.textContent =
      profile.flatnessPreference || PROFILE_DEFAULTS.flatnessPreference;
    this.profileWeatherTarget.textContent =
      profile.favouriteWeather || PROFILE_DEFAULTS.favouriteWeather;
  }
}
