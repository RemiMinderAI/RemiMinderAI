import React from 'react';
import styles from './PatientRegistration.module.css';
// import googleLogo from '../assets/google-icon.png';
// import appleLogo from '../assets/apple-icon.png';
// import emailIcon from '../assets/email-icon.png';

const RegisterPatientPage = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>MediMinder</div>
        {/* <a href="/signin" className={styles.signInButton}>Sign In</a> */}
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create Patient Account</h1>
          <p className={styles.subtitle}>Choose your preferred sign-up method</p>

          <div className={styles.buttonGroup}>
            <button className={`${styles.signUpButton} ${styles.emailButton}`}>
              {/* <img src={emailIcon} alt="" className={styles.icon} /> */}
              Sign up with Email
            </button>
            <button className={`${styles.signUpButton} ${styles.googleButton}`}>
              {/* <img src={googleLogo} alt="" className={styles.icon} /> */}
              Sign up with Google
            </button>
            <button className={`${styles.signUpButton} ${styles.appleButton}`}>
              {/* <img src={appleLogo} alt="" className={styles.icon} /> */}
              Sign up with Apple
            </button>
          </div>

          <p className={styles.footerText}>
            Already have an account?{' '}
            <a href="/signin" className={styles.signInLink}>
              Sign in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPatientPage;
