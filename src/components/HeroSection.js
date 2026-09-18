import React from "react";
import {
  Bell,
  FileText,
  Globe,
  Lock,
  Mic,
  ScanLine,
  Share2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import styles from "./LandingPage.module.css";
import HeroPhoneStage from "./HeroPhoneStage";
import { ANDROID_URL, IOS_URL, trackDownloadClick } from "../constants/site";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "HIPAA-conscious design" },
  { icon: Lock, label: "Encrypted" },
  { icon: Smartphone, label: "iOS + Android" },
  { icon: Globe, label: "10 languages" },
];

const HERO_ACTIONS = [
  { icon: Mic, label: "Record" },
  { icon: FileText, label: "Summarize" },
  { icon: ScanLine, label: "Scan" },
  { icon: Bell, label: "Voice reminders" },
  { icon: Share2, label: "Share live" },
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
                Record the visit, get an AI summary, scan lab results, set
                reminders by voice, and share with family in real time — in 10
                languages.
              </p>

              <ul className={`${styles.heroActionList} ${styles.heroAnimSub}`}>
                {HERO_ACTIONS.map(({ icon: Icon, label }, index) => (
                  <li key={label} className={styles.heroActionItem}>
                    <span className={styles.heroActionIcon} aria-hidden="true">
                      <Icon size={14} strokeWidth={2.3} />
                    </span>
                    {label}
                    {index < HERO_ACTIONS.length - 1 ? (
                      <span className={styles.heroActionArrow} aria-hidden="true">
                        →
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div
                id="get-started"
                className={`${styles.hero2CtaBlock} ${styles.heroAnimCtas}`}
              >
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
