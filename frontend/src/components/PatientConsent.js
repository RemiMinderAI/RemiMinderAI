import React, { useState } from 'react';
import styles from './PatientConsent.module.css';
import { FaLock, FaFileAlt, FaShieldAlt } from 'react-icons/fa';

const PatientConsent = () => {
  const [consented, setConsented] = useState(false);

  const handleConsent = () => {
    if (!consented) {
    //   alert('Please review and accept the consent agreement');
      return;
    }
    // alert('Consent recorded successfully');
  };

  return (
    <div className={styles.container}>
      {/* Header (same as registration) */}
      <header className={styles.header}>
        <div className={styles.logo}>MediMinder</div>
      </header>

      {/* Consent Section */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.iconWrapper}>
            <FaShieldAlt className={styles.iconMain} />
          </div>
          <h1 className={styles.title}>Patient Consent Agreement</h1>
          <p className={styles.subtitle}>Please review the following information carefully</p>
        </div>
        
        <div className={styles.card}>
          {/* Key Points */}
          <div className={styles.keyPoints}>
            <div className={styles.keyPoint}>
                <div className={`${styles.iconBox} ${styles.blueBox}`}>
                <FaLock className={styles.blueIcon} />
                </div>
                <div className={styles.textWrapper}>
                  <h4 className={styles.keyHeading}>HIPAA Compliance</h4>
                  <p className={styles.keyText}>Your health information is protected under HIPAA regulations and stored with end-to-end encryption.</p>
                </div>
            </div>

            <div className={styles.keyPoint}>
                <div className={`${styles.iconBox} ${styles.purpleBox}`}>
                <FaFileAlt className={styles.purpleIcon} />
                </div>
                <div className={styles.textWrapper}>
                  <h4 className={styles.keyHeading}>Data Usage</h4>
                  <p className={styles.keyText}>Your visit recordings and summaries are used solely for your healthcare management. You can delete your data at any time.</p>
                </div>
            </div>

            <div className={styles.keyPoint}>
                <div className={`${styles.iconBox} ${styles.greenBox}`}>
                <FaShieldAlt className={styles.greenIcon} />
                </div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.keyHeading}>Your Rights</h3>
                  <p className={styles.keyText}>You have the right to access, modify, or delete your health information. You control who can access your data.</p>
                </div>
            </div>
            </div>

          {/* Full Agreement */}
          <div className={styles.agreementBox}>
            <div className={styles.agreementHeader}>Full Agreement</div>
            <div className={styles.agreementScroll}>
              <h5>1. Introduction</h5>
              <p>
                This agreement outlines the terms and conditions for using MediMinder’s telehealth platform. By accepting
                these terms, you acknowledge that you have read, understood, and agree to be bound by this agreement.
              </p>

              <h5>2. HIPAA Authorization</h5>
              <p>
                HealthConnect is committed to protecting your health information in accordance with the Health Insurance Portability
                and Accountability Act (HIPAA). We implement appropriate safeguards to protect your protected health information (PHI)
                from unauthorized access, use, or disclosure.
              </p>

              <h5>3. Data Collection and Use</h5>
              <p>We collect and process health information you provide, including visit recordings, voice data, and health summaries. This information is used to:</p>
              <ul>
                <li>Generate AI-powered visit summaries</li>
                <li>Maintain your health records</li>
                <li>Facilitate communication with caregivers you authorize</li>
                <li>Improve our services while maintaining anonymization</li>
              </ul>

              <h5>4. Data Security</h5>
              <p>
                All data is encrypted in transit and at rest using industry-standard encryption protocols. We implement multi-factor authentication,
                regular security audits, and compliance monitoring to ensure data safety.
              </p>

              <h5>5. Patient Responsibilities</h5>
              <p>
                You are responsible for maintaining the confidentiality of your account, managing caregiver access,
                and ensuring the accuracy of information you provide.
              </p>

              <h5>6. Access and Control</h5>
              <p>
                You have the right to access your data, request corrections, download your records, revoke caregiver access,
                and request data deletion at any time.
              </p>

              <h5>7. Limitation of Liability</h5>
              <p>
                MediMinder is designed for health tracking and coordination. It is not intended to replace professional medical advice, diagnosis, or treatment.
                Always seek the advice of your physician or other qualified health provider.
              </p>

              <h5>8. Prohibited Use</h5>
              <p>
                This platform is not intended for collecting personally identifiable information (PII) beyond what is necessary for healthcare coordination,
                nor for securing highly sensitive data requiring additional safeguards.
              </p>

              <h5>9. Termination</h5>
              <p>
                You may terminate your account at any time. Upon termination, your data will be permanently deleted within 30 days, unless retention is required by law.
              </p>

              <h5>10. Changes to Terms</h5>
              <p>
                We may update these terms periodically. You will be notified of significant changes and asked to re-consent.
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="consent"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
            />
            <label htmlFor="consent">
                I have read and agree to the terms outlined above. I understand my rights and responsibilities,
                including how my health information will be used and protected under HIPAA regulations.
            </label>
          </div>

          {/* Button */}
          <button
            className={styles.submitButton}
            onClick={handleConsent}
            disabled={!consented}
          >
            Accept & Continue
          </button>
        </div>

        <div className={styles.footerNote}>
          Questions about this agreement?{' '}
          <a href="#" className={styles.contactLink}>Contact Support</a>
        </div>
      </main>
    </div>
  );
};

export default PatientConsent;
