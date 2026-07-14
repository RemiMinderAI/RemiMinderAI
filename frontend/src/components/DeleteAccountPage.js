import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import landingStyles from "./LandingPage.module.css";
import privacyStyles from "./PrivacyPolicyPage.module.css";
import styles from "./DeleteAccountPage.module.css";
import SiteFooter from "./SiteFooter";
import logo from "../assets/RemiMinder_logo_512.png";
import { CONTACT_EMAIL } from "../constants/site";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${landingStyles.container} ${privacyStyles.wrap}`}>
      <header
        className={`${privacyStyles.minHeader} ${
          scrolled ? styles.headerScrolled : ""
        }`}
      >
        <button
          type="button"
          className={privacyStyles.logoBtn}
          onClick={() => navigate("/")}
          aria-label="RemiMinderAI home"
        >
          <img src={logo} alt="" className={privacyStyles.logoImg} />
        </button>
        <h1 className={privacyStyles.headerTitle}>Delete Account — RemiMinderAI</h1>
      </header>

      <main className={`${privacyStyles.main} ${styles.main}`}>
        <article className={`${privacyStyles.article} ${styles.article}`}>
          <h1 id="delete-top">Delete Your RemiMinderAI Account</h1>
          <p>
            You can request deletion of your RemiMinderAI account and associated
            data.
          </p>

          <h2 id="how-to-request">How to request deletion</h2>
          <p>To delete your account:</p>
          <ol className={styles.steps}>
            <li>Open the RemiMinderAI app.</li>
            <li>
              Go to <strong>Profile → Delete Account</strong>.
            </li>
            <li>Confirm your deletion request.</li>
          </ol>

          <p>
            You may also request deletion by emailing{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> using the email
            address associated with your account.
          </p>

          <h2 id="data-deleted">Data deleted</h2>
          <p>When your account is deleted, we remove:</p>
          <ul>
            <li>Account information (name and email address)</li>
            <li>Doctor visit recordings</li>
            <li>Transcripts</li>
            <li>AI-generated summaries</li>
            <li>Scanned medical documents</li>
            <li>Medication reminders and related user data</li>
          </ul>

          <h2 id="data-retention">Data retention</h2>
          <p>
            Deletion removes your information from our active systems. Backup
            copies may remain temporarily as part of our normal backup retention
            process before permanent removal.
          </p>
          <p>
            For more details, see our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </article>

        <div className={privacyStyles.bottomActions}>
          <button
            type="button"
            className={privacyStyles.backHome}
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
