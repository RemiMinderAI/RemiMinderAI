import React from 'react';
import styles from './LandingPage.module.css';
import heroImage from '../assets/hero-ai-orb.jpg'; 
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToPatientRegister = () => {
    navigate("/register/patient");
  };

  const goToCaregiverRegister = () => {
    navigate("/register/caregiver");
  };

  const goToSignIn = () => {
    navigate("/signin");
  }

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <header className={styles.header}>
        <div className={styles.logo}>RemeMinderAI</div>
        <nav className={styles.nav}>
          <a href="#how-it-works">How It Works</a>
          <a href="#who-its-for">Who It's For</a>
          <a href="#benefits">Benefits</a>
        </nav>
        <button onClick={goToSignIn} className={styles.signInButton}>Sign In</button>
      </header>

      {/* Main Hero Section */}
      <main className={styles.heroSection}>
        <div className={styles.leftPanel}>
          <div className={styles.aiTag}>✨ AI-Powered Healthcare Companion</div>
          <h1 className={styles.title}>
            Your healthcare,
            <br />
            <span className={styles.highlightRemembered}>remembered</span> and{' '}
            <span className={styles.highlightReimagined}>reimagined</span>
          </h1>
          <p className={styles.description}>
            Never miss a detail from your doctor visits. RemeMinder records
            conversations, creates clear summaries, and keeps your health
            journey organized—so you can focus on what matters most.
          </p>
          <div className={styles.buttonGroup}>
            <button onClick={goToPatientRegister} className={styles.primaryButton}>
              Register as Patient <span>&rarr;</span>
            </button>
            <button onClick={goToCaregiverRegister} className={styles.secondaryButton}>
              Register as Caregiver
            </button>
          </div>

          {/* Stats Section */}
          <div className={styles.statsSection}>
              <div className={styles.statItem}>
                  <div className={styles.statValue}>50K+</div>
                  <div className={styles.statLabel}>Families Supported</div>
              </div>
              <div className={styles.statItem}>
                  <div className={styles.statValue}>98%</div>
                  <div className={styles.statLabel}>User Satisfaction</div>
              </div>
              <div className={styles.statItem}>
                  <div className={styles.statValue}>24/7</div>
                  <div className={styles.statLabel}>AI Support</div>
              </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <img src={heroImage} alt="Healthcare professional holding a glowing icon" className={styles.heroImage} />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
