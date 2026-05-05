"use client";
import { useEffect, useState } from "react";
import FeedbackPanel from "./FeedbackPanel";

/**
 * Renders the FeedbackPanel only when feedback mode is enabled in localStorage.
 * Mode is controlled by FeedbackToggle.
 */
export default function FeedbackArea({ slug, number, title }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem("rsb-feedback-mode") === "1");
  }, []);

  if (!enabled) return null;
  return (
    <div className="feedback-rail">
      <FeedbackPanel slug={slug} challengeNumber={number} challengeTitle={title} />
    </div>
  );
}
