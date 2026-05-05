"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rsb-feedback-mode";
const PASSWORD = "jay";

/**
 * Floating button that toggles feedback mode. First click prompts for the password.
 * Once unlocked, the choice is remembered in localStorage. The wrapping page
 * reads document.body.dataset.feedbackMode to lay out the split view.
 */
export default function FeedbackToggle() {
  const [enabled, setEnabled] = useState(false);

  // On mount, read prior state from localStorage and apply to body
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setEnabled(stored);
    document.body.dataset.feedbackMode = stored ? "on" : "off";
  }, []);

  const enter = () => {
    const pwd = window.prompt("Password?");
    if (pwd === null) return;
    if (pwd.trim().toLowerCase() !== PASSWORD) {
      alert("Wrong password.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, "1");
    setEnabled(true);
    document.body.dataset.feedbackMode = "on";
    // Re-render the page in feedback layout
    window.location.reload();
  };

  const leave = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEnabled(false);
    document.body.dataset.feedbackMode = "off";
    window.location.reload();
  };

  return (
    <button
      onClick={enabled ? leave : enter}
      className="fixed bottom-5 right-5 z-50 px-4 py-2 rounded-full font-display font-bold text-white shadow-lg hover:shadow-xl transition no-print"
      style={{ background: enabled ? "var(--color-hoda-blue)" : "var(--color-hoda-orange)" }}
    >
      {enabled ? "✓ Feedback mode (click to exit)" : "Give feedback"}
    </button>
  );
}
