import React from "react";
import { Link } from "react-router-dom";
import styles from "./SiteFooter.module.css";
import logo from "../assets/RemiMinder_logo_512.png";
import { CONTACT_EMAIL } from "../constants/site";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

/**
 * Enterprise 4-column footer for marketing pages.
 */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brandRow}>
              <img src={logo} alt="" className={styles.logoImg} />
              <span className={styles.brandName}>RemiMinderAI</span>
            </div>
            <p className={styles.brandTagline}>
              AI-powered health coordination for families. Record doctor visits, turn them into clear
              summaries, and keep your whole care team in sync.
            </p>
          </div>

          <nav className={styles.navCol} aria-label="Product">
            <div className={styles.colHeading}>Product</div>
            <a href="/#how-it-works">How It Works</a>
            <Link to="/pricing">Pricing</Link>
            <a href="/#demo">Demo</a>
          </nav>

          <nav className={styles.navCol} aria-label="Company">
            <div className={styles.colHeading}>Company</div>
            <Link to="/about">About</Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email RemiMinderAI team"
            >
              Contact
            </a>
          </nav>

          <nav className={styles.navCol} aria-label="Legal">
            <div className={styles.colHeading}>Legal</div>
            <Link to="/privacy">Privacy Policy</Link>
            <a href="#">Terms of Service</a>
          </nav>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2025 RemiMinderAI. All rights reserved.
          </p>
          <div className={styles.badges}>
            <span className={styles.badgeItem}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span>HIPAA Compliant</span>
            </span>
            <span className={styles.badgeItem}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span>End-to-End Encrypted</span>
            </span>
          </div>
          <div className={styles.socialRow}>
            <a
              href="https://www.linkedin.com/company/remiminderai/"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a href="#" className={styles.socialLink} aria-label="X / Twitter">
              <XIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
