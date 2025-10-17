import React, { useState } from 'react';
import styles from './PatientRegistration.module.css';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineMail } from 'react-icons/ai';
import { FaApple } from 'react-icons/fa';

const RegisterPatientPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add API call or form submission logic here
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>MediMinder</div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create Patient Account</h1>
          <p className={styles.subtitle}>Choose your preferred sign-up method</p>

          {!showEmailForm ? (
            <>
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
            </>
          ) : (
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
          <div className={styles.footerNote}>
          Already have an account?{' '}
          <a href="#" className={styles.contactLink}>Sign in</a>
        </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPatientPage;
