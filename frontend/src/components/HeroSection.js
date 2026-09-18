import React from "react";
import { Globe, Lock, ShieldCheck, Smartphone } from "lucide-react";
import styles from "./LandingPage.module.css";
import HeroPhoneStage from "./HeroPhoneStage";
import { ANDROID_URL, IOS_URL, trackDownloadClick } from "../constants/site";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "HIPAA-conscious design" },
  { icon: Lock, label: "Encrypted" },
  { icon: Smartphone, label: "iOS + Android" },
  { icon: Globe, label: "10 languages" },
];

export default function HeroSection() {
  return (
    <>
      <section className={styles.heroSection} aria-labelledby="hero-heading">
        <div className={styles.hero2Bg} aria-hidden="true">
          <div className={styles.hero2Ambient1} />
          <div className={styles.hero2Ambient2} />
          <div className={styles.hero2GridPattern} />
        </div>

        <div className={styles.hero2Inner}>
          <div className={styles.hero2Grid}>
            <div className={styles.hero2CopyCol}>
              <p className={`${styles.heroCategoryBadge} ${styles.heroAnimBadge}`}>
                <span className={styles.heroCategoryDot} aria-hidden="true" />
                AI healthcare companion app
              </p>

              <h1
                id="hero-heading"
                className={`${styles.hero2Title} ${styles.heroAnimHeadline}`}
              >
                Your mom&apos;s doctor said something important. Do you remember
                what?
              </h1>

              <p className={`${styles.hero2Sub} ${styles.heroAnimSub}`}>
                RemiMinderAI records medical appointments, generates AI summaries,
                scans lab results, and keeps your whole family aligned on care —
                in 10 languages.
              </p>

              <div className={`${styles.hero2CtaBlock} ${styles.heroAnimCtas}`}>
                <div className={styles.heroDownloadRow}>
                  <a
                    href={IOS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackDownloadClick}
                  >
                    <img
                      src="/images/app-store-badge.svg"
                      alt="Download on the App Store"
                      height={48}
                    />
                  </a>
                  <a
                    href={ANDROID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackDownloadClick}
                  >
                    <img
                      src="/images/google-play-badge.png"
                      alt="Get it on Google Play"
                      height={48}
                    />
                  </a>
                </div>
                <p className={styles.heroTrialLine}>
                  Free 14-day trial <span aria-hidden="true">|</span> No credit
                  card required
                </p>
              </div>
            </div>

            <div className={styles.hero2VisualCol}>
              <HeroPhoneStage />
            </div>
          </div>
        </div>
      </section>

      <div className={styles.trustBar} role="region" aria-label="Product trust signals">
        <ul className={styles.trustBarInner}>
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className={styles.trustBarItem}>
              <span className={styles.trustBarIcon} aria-hidden="true">
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
