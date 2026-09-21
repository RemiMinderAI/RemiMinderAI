import React from "react";
import styles from "./DownloadCloseSection.module.css";
import { ANDROID_URL, IOS_URL, trackDownloadClick } from "../constants/site";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.37 12.57c.03 2.4 2.1 3.2 2.13 3.21-.02.06-.33 1.14-1.09 2.25-.66.96-1.34 1.92-2.42 1.94-1.06.02-1.4-.63-2.61-.63-1.21 0-1.59.61-2.59.65-1.04.04-1.83-1.04-2.5-2-.99-1.43-1.75-3.61-1.75-5.7 0-3.36 2.18-5.14 4.33-5.14 1.14 0 2.22.77 2.92.77.7 0 1.8-.82 3.04-.7.52.02 1.97.21 2.9 1.58-.07.05-1.73 1.01-1.71 3.01zM14.7 6.3c.55-.67.92-1.6.82-2.53-.79.03-1.75.53-2.32 1.19-.51.59-.95 1.53-.83 2.43.88.07 1.78-.45 2.33-1.09z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M4.5 3.8v16.4c0 .7.8 1.1 1.4.7l13.2-8.2c.6-.4.6-1.2 0-1.6L5.9 3.1c-.6-.4-1.4 0-1.4.7z"
      />
    </svg>
  );
}

export default function DownloadCloseSection() {
  return (
    <section className={styles.section} aria-label="Download RemiMinderAI">
      <p className={styles.wordmark}>RemiMinderAI</p>
      <p className={styles.tagline}>Remembers so you don&apos;t have to</p>
      <div className={styles.stores}>
        <a
          className={styles.storeButton}
          href={IOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackDownloadClick}
        >
          <AppleIcon />
          App Store
        </a>
        <a
          className={styles.storeButton}
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackDownloadClick}
        >
          <PlayIcon />
          Google Play
        </a>
      </div>
      <p className={styles.trial}>
        Free 14-day trial <span aria-hidden="true">|</span> No credit card required
      </p>
    </section>
  );
}
