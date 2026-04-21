import React from "react";
import { Smartphone, Apple } from "lucide-react";
import styles from "./CtaSection.module.css";
import { ANDROID_URL } from "../constants/site";
import { useMailingList } from "../context/MailingListContext";

/**
 * Shared bottom CTA for Landing, Pricing, and About.
 */
export default function CtaSection() {
  const { open: openMailingList } = useMailingList();
  return (
    <section className={styles.ctaWrap} aria-labelledby="cta-heading">
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span className={styles.eyebrowText}>Ready to start?</span>
        </div>
        <h2 id="cta-heading" className={styles.title}>
          Take control of your healthcare today
        </h2>
        <p className={styles.subtext}>
          Download the Android app to get started. iOS support is on the way.
        </p>
        <div className={styles.buttonRow}>
          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            <Smartphone size={18} aria-hidden="true" />
            <span>Download Android</span>
          </a>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => openMailingList({ source: "cta" })}
          >
            Join mailing list
          </button>
          <button type="button" className={styles.btnTertiary} disabled>
            <Apple size={18} aria-hidden="true" />
            <span>iOS Coming Soon</span>
          </button>
        </div>
      </div>
    </section>
  );
}
