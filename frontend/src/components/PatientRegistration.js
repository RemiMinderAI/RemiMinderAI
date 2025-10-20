import React, { useState } from 'react';
import styles from './PatientRegistration.module.css';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineMail } from 'react-icons/ai';
import { FaApple } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const RegisterPatientPage = () => {

  const navigate = useNavigate();

  const goHome = () => {
    // optional: show confirm dialog or save progress
    navigate("/");
  };

  const handleContinue = () => {
    // Optional validation or saving logic
    navigate("/consent/patient");
  };

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showVerification) {
      setShowVerification(true);
    } else {
      console.log('Verification code submitted:', formData.code);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={goHome}>
          MediMinder
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create Patient Account</h1>
          <p className={styles.subtitle}>Choose your preferred sign-up method</p>

          {/* Step 1 – Choose sign-up method */}
          {!showEmailForm && !showVerification && (
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.signUpButton} ${styles.emailButton}`}
                onClick={() => setShowEmailForm(true)}
              >
                <AiOutlineMail size={18} />
                Sign up with Email
              </button>
              <button className={`${styles.signUpButton} ${styles.googleButton}`}>
                <FcGoogle size={18} />
                Sign up with Google
              </button>
              <button className={`${styles.signUpButton} ${styles.appleButton}`}>
                <FaApple size={18} />
                Sign up with Apple
              </button>
            </div>
          )}

          {/* Step 2 – Email and Password Form */}
          {showEmailForm && !showVerification && (
            <div className={styles.formCard}>
              <form className={styles.emailForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.buttonColumn}>
                  <button type="submit" className={`${styles.signUpButton} ${styles.continueButton}`}>
                    Continue
                  </button>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => setShowEmailForm(false)}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3 – Email Verification */}
          {showVerification && (
            <div className={styles.formCard}>
              <div className={styles.iconCircle}>
                <MdMailOutline size={35} />
              </div>

              <h2 className={styles.verifyTitle}>Verify Your Email</h2>
              <p className={styles.verifySubtitle}>
                We sent a 6-digit code to {formData.email}
              </p>

              <form className={styles.emailForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="code">Verification code</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="000000"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className={styles.verificationInputField}
                  />
                </div>

                <div className={styles.buttonColumn}>
                  <button onClick={handleContinue} type="submit" className={`${styles.signUpButton} ${styles.continueButton}`}>
                    <FaCheck size={14} style={{ marginLeft: '8px', color: '#fff' }} />
                    Verify Email
                  </button>
                </div>

                <div className={styles.resendWrapper}>
                  <button type="button" className={styles.resendButton}>
                    Resend code
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className={styles.footerNote}>
            Already have an account?{' '}
            <a href="/signin" className={styles.contactLink}>Sign in</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPatientPage;
