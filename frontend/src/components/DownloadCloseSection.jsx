import React from "react";
import { Download } from "lucide-react";
import styles from "./DownloadCloseSection.module.css";
import { ANDROID_URL, IOS_URL, trackDownloadClick } from "../constants/site";

export default function DownloadCloseSection() {
  return (
    <section className={styles.section} aria-label="Download RemiMinderAI">
      <p className={styles.wordmark}>RemiMinderAI</p>
      <p className={styles.tagline}>Remembers So You Don&apos;t Have To</p>
      <a className={styles.downloadNow} href="#get-started">
        <Download size={18} strokeWidth={2.4} aria-hidden="true" />
        Download now
      </a>
      <div className={styles.stores}>
        <a
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackDownloadClick}
        >
          <img src="/images/google-play-badge.png" alt="Get it on Google Play" />
        </a>
        <a
          href={IOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackDownloadClick}
        >
          <img src="/images/app-store-badge.svg" alt="Download on the App Store" />
        </a>
      </div>
      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className={styles.copyright}>© 2025 REMIMINDERAI LLC</p>
    </section>
  );
}
