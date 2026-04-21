import React from "react";
import { ArrowRight, Smartphone, Apple } from "lucide-react";
import styles from "./CtaSection.module.css";
import { ANDROID_URL, CONTACT_EMAIL } from "../constants/site";

const SIGNUP_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Sign up - RemiMinderAI"
)}`;

/**
 * Shared bottom CTA for Landing, Pricing, and About.
 */
export default function CtaSection() {
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
          Join our early access program. Download the Android app or sign up with your email to stay
          updated.
        </p>
        <div className={styles.buttonRow}>
          <a href={SIGNUP_MAILTO} className={styles.btnPrimary}>
            <span>Sign Up Free</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondary}
          >
            <Smartphone size={18} aria-hidden="true" />
            <span>Download Android</span>
          </a>
          <button type="button" className={styles.btnTertiary} disabled>
            <Apple size={18} aria-hidden="true" />
            <span>iOS Coming Soon</span>
          </button>
        </div>
      </div>
    </section>
  );
}
