import React, { useState, useLayoutEffect, useCallback } from "react";
import styles from "./AnnouncementBar.module.css";

const STORAGE_KEY = "remiminderai_announcement_v1_dismissed";

function getBarHeightPx() {
  if (typeof window === "undefined") return 40;
  return window.innerWidth <= 640 ? 36 : 40;
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof localStorage === "undefined") return true;
    return localStorage.getItem(STORAGE_KEY) === "1";
  });

  const applyVar = useCallback((active) => {
    if (typeof document === "undefined") return;
    const h = active ? getBarHeightPx() : 0;
    document.documentElement.style.setProperty("--announcement-bar-height", `${h}px`);
  }, []);

  useLayoutEffect(() => {
    if (dismissed) {
      applyVar(false);
      return undefined;
    }
    applyVar(true);
    const onResize = () => {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      applyVar(true);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [dismissed, applyVar]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <aside
      className={styles.root}
      role="region"
      aria-label="Site announcement"
    >
      <p className={styles.text}>
        🌿 We&apos;re now open for beta testing — Download the app and help
        shape the future of healthcare coordination.
      </p>
      <button
        type="button"
        className={styles.dismiss}
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </aside>
  );
}
