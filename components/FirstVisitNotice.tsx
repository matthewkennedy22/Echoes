"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "echoes-first-visit-notice-v1";

export default function FirstVisitNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className="notice-backdrop"
      onClick={dismiss}
      role="presentation"
    >
      <div
        className="notice-card"
        role="dialog"
        aria-labelledby="first-visit-notice-title"
        aria-describedby="first-visit-notice-body"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="notice-kicker">Before you begin</p>
        <h2 id="first-visit-notice-title" className="notice-title">
          Your first answer may take a while
        </h2>
        <p id="first-visit-notice-body" className="notice-body">
          The first question can take about 30 seconds while the server wakes up
          and Myron searches the historical sources. Later answers are usually
          much faster — thank you for your patience.
        </p>
        <button type="button" className="notice-btn" onClick={dismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
