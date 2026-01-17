import React from "react";
import styles from "./AboutPage.module.css";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();
  
    const goToSignIn = () => navigate("/sign-in");

  return (
    <main className={styles.container}>
      {/* --- HEADER --- */}
      <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
          <div className={styles.headerLogoIcon}>RM</div> {/* logo box */}
          RemiMinderAI
        </div>
        <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>Home</a>
            <a href="/?fullscreen=true" className={styles.navLink}>Product Demo</a>
            <a href="/#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="/about" className={styles.navLink}>About</a>
        </nav>
        <button onClick={goToSignIn} className={styles.signInButton}>Sign In</button>
      </header>

      {/* --- SECTIONS --- */}

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.brandLogo}>
                <div className={styles.brandIcon}>RM</div>
                <span className={styles.brandName}>RemiMinderAI</span>
              </div>
              <p className={styles.footerText}>
                Your healthcare, remembered and reimagined
              </p>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Product</h4>
              <ul className={styles.footerList}>
                <li><a href="#">Features</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Company</h4>
              <ul className={styles.footerList}>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Legal</h4>
              <ul className={styles.footerList}>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2025 RemiMinderAI. All rights reserved.</p>
            <div className={styles.socialLinks}>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default AboutPage;
