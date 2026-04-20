import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import logo from "../assets/RemiMinder_logo_512.png";
import { ANDROID_URL, CONTACT_EMAIL } from "../constants/site";

export default function SiteFooter({
  omitMarketingFooterLinks = false,
  omitContactAndAppLinks = false,
}) {
  const showContact = !omitContactAndAppLinks;
  const showMarketing = !omitMarketingFooterLinks;
  const showFooterLinksRow = showMarketing || showContact;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <img src={logo} alt="RemiMinder" className={styles.footerLogo} />
            <span className={styles.footerBrandName}>
              RemiMinder<span className={styles.logoAi}>.ai</span>
            </span>
          </div>
          <p className={styles.footerTagline}>
            Smart AI for Health &amp; Care Coordination
          </p>
        </div>
        {showFooterLinksRow && (
          <div className={styles.footerLinks}>
            {showMarketing && (
              <>
                <Link to="/" className={styles.footerLink}>
                  Home
                </Link>
                <span className={styles.footerSep} aria-hidden="true">
                  •
                </span>
                <Link to="/about" className={styles.footerLink}>
                  About
                </Link>
                <span className={styles.footerSep} aria-hidden="true">
                  •
                </span>
                <a href="/#how-it-works" className={styles.footerLink}>
                  How It Works
                </a>
                <span className={styles.footerSep} aria-hidden="true">
                  •
                </span>
              </>
            )}
            {showContact && (
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.footerLink}>
                Contact
              </a>
            )}
          </div>
        )}
        {showContact && (
          <div className={styles.footerAppRow}>
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Download Android
            </a>
          </div>
        )}
        <p className={styles.footerCopy}>
          © 2025 RemiMinderAI. All rights reserved. &nbsp;•&nbsp; HIPAA Compliant
          &nbsp;•&nbsp; End-to-End Encrypted
        </p>
      </div>
    </footer>
  );
}
