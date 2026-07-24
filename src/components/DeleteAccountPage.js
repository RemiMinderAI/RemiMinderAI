import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./DeleteAccountPage.module.css";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import { CONTACT_EMAIL } from "../constants/site";

const DELETION_STEPS = [
  "Open the RemiMinderAI app",
  "Go to Profile → Delete Account",
  "Confirm your deletion request",
];

const DATA_DELETED = [
  "Account information (name and email address)",
  "Doctor visit recordings",
  "Transcripts",
  "AI-generated summaries",
  "Scanned medical documents",
  "Medication reminders and related user data",
];

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={`${pricingStyles.pricingHeader} ${styles.deleteHeader}`}
      />

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="delete-account-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Account &amp; data deletion</p>
            <h1 id="delete-account-heading">Delete Your RemiMinderAI Account</h1>
            <p className={styles.heroText}>
              You can request deletion of your RemiMinderAI account and associated
              data at any time. The recommended path is in the app: open Profile →
              Delete Account. Email support is available if you cannot access your
              account.
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.primaryAction}
                href={`mailto:${CONTACT_EMAIL}?subject=RemiMinderAI%20account%20deletion%20request`}
              >
                Email deletion request
              </a>
              <Link className={styles.secondaryAction} to="/privacy">
                View Privacy Policy
              </Link>
            </div>
          </div>

          <aside className={styles.summaryCard} aria-label="Deletion summary">
            <div className={styles.summaryLabel}>What to expect</div>
            <ul>
              <li>
                <strong>In-app request</strong>
                <span>Profile → Delete Account</span>
              </li>
              <li>
                <strong>Email option</strong>
                <span>{CONTACT_EMAIL}</span>
              </li>
              <li>
                <strong>Backup retention</strong>
                <span>Typically removed within 30 days</span>
              </li>
            </ul>
          </aside>
        </section>

        <section className={styles.contentGrid} aria-label="Account deletion details">
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                1
              </span>
              <div>
                <p className={styles.cardKicker}>Recommended</p>
                <h2 id="how-to-request">How to request deletion</h2>
              </div>
            </div>
            <p>To delete your account:</p>
            <ol className={styles.steps}>
              {DELETION_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className={`${styles.card} ${styles.emailCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                @
              </span>
              <div>
                <p className={styles.cardKicker}>Alternative</p>
                <h2>Email us directly</h2>
              </div>
            </div>
            <p>
              You may also request deletion by emailing{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> using the
              email address associated with your account.
            </p>
          </article>

          <article className={`${styles.card} ${styles.wideCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ✓
              </span>
              <div>
                <p className={styles.cardKicker}>Removed from active systems</p>
                <h2 id="data-deleted">Data deleted</h2>
              </div>
            </div>
            <p>When your account is deleted, we remove:</p>
            <ul className={styles.dataList}>
              {DATA_DELETED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`${styles.card} ${styles.retentionCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                30
              </span>
              <div>
                <p className={styles.cardKicker}>Backup retention</p>
                <h2 id="data-retention">Data retention</h2>
              </div>
            </div>
            <p>
              Deletion removes your information from our active systems. Backup
              copies may remain temporarily as part of our normal backup retention
              process before permanent removal (typically within 30 days).
            </p>
            <p>
              For more details, see our <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </article>
        </section>

        <div className={styles.bottomActions}>
          <button
            type="button"
            className={styles.backHome}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
