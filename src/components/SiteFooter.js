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

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"
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
            </div>
            <div className={styles.brandName}>
              Remi<span className={styles.brandMinder}>Minder</span>AI
            </div>
            <p className={styles.brandTagline}>Remember what matters</p>
          </div>

          <nav className={styles.navCol} aria-label="Product">
            <div className={styles.colHeading}>Product</div>
            <a href="/#how-it-works">How It Works</a>
            <Link to="/your-start-guide">Your Start Guide</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/future-vision">Future Vision</Link>
            <Link to="/support">Support</Link>
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
            <Link to="/delete-account">Delete Account</Link>
            <Link to="/terms">Terms of Service</Link>
          </nav>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>© 2026 REMIMINDERAI LLC</p>
          <div className={styles.badges}>
            <span className={styles.badgeItem}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span>Encrypted in transit and at rest</span>
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
            <a
              href="https://www.instagram.com/team_remiminderai/"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RemiMinderAI on Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61596725067940"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RemiMinderAI on Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.tiktok.com/@remiminderai"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RemiMinderAI on TikTok"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://x.com/ai_minder56313"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
            >
              <XIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
