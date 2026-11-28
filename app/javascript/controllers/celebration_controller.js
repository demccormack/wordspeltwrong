import { Controller } from "@hotwired/stimulus";
import confetti from "canvas-confetti";

// Fires confetti, unless the visitor prefers reduced motion.
export default class extends Controller {
  static values = { auto: { type: Boolean, default: false } };

  connect() {
    if (this.autoValue) this.fire();
  }

  fire() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      disableForReducedMotion: true,
    });
  }
}
