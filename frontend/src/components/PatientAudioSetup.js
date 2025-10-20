import { useState } from 'react';
import { Mic, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './PatientAudioSetup.module.css';
import { useNavigate } from "react-router-dom";

export function PatientAudioSetup() {
  const navigate = useNavigate();

  const goHome = () => {
    // optional: show confirm dialog or save progress
    navigate("/");
  };

  const [permissionStatus, setPermissionStatus] = useState('idle');

  const requestPermission = () => {
    setPermissionStatus('requesting');
    // Simulate permission request
    setTimeout(() => {
      setPermissionStatus('granted');
      setTimeout(() => {
        navigate("/dashboard/patient");
      }, 1000);
    }, 1000);
  };

  const handleSkip = () => {
    // Reset the component or just notify user
    // alert('Skipped microphone setup');
    setPermissionStatus('idle');
    navigate("/dashboard/patient");
  };

  return (
    <div className={styles.container}>
        {/* Header (same as registration) */}
        <header className={styles.header}>
            <div className={styles.logo} onClick={goHome}>
                RemeMinderAI
            </div>
        </header>
        <main className={styles.main}>
            <div className={styles.page}>
                {/* Heading */}
                <div className={styles.heading}>
                    <div className={styles.iconWrapper}>
                        <Mic className={styles.headingIcon} />
                    </div>
                    <h1 className={styles.title}>Enable Voice Visits</h1>
                    <p className={styles.subtitle}>
                        To record your healthcare visits, we need access to your microphone
                    </p>
                </div>

                <div className={styles.card}>
                    {/* Illustration */}
                    <div className={styles.illustration}>
                        <div className={styles.micWrapper}>
                        <div className={styles.micCircle}>
                            <Mic className={styles.micIcon} />
                        </div>

                        {permissionStatus === 'granted' && (
                            <div className={styles.checkBadge}>
                            <CheckCircle className={styles.checkIcon} />
                            </div>
                        )}
                        {permissionStatus === 'requesting' && (
                            <div className={styles.spinner} />
                        )}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className={styles.benefits}>
                        <h4 className={styles.benefitsTitle}>What you can do with voice visits:</h4>
                        <div className={styles.benefitList}>
                        {[
                            'Record doctor appointments and health visits',
                            'Get AI-generated summaries of your visits',
                            'Share visit summaries with your caregivers',
                            'Build a comprehensive health history'
                        ].map((text, i) => (
                            <div key={i} className={styles.benefitItem}>
                            <CheckCircle className={styles.benefitIcon} />
                            <span>{text}</span>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className={styles.privacy}>
                        <AlertCircle className={styles.privacyIcon} />
                        <div>
                        <p className={styles.privacyTitle}>Your privacy is protected</p>
                        <p className={styles.privacyText}>
                            Recordings are encrypted and stored securely. You can delete them at any time.
                        </p>
                        </div>
                    </div>

                    {/* Permission Buttons */}
                    {permissionStatus === 'idle' && (
                        <button className={styles.grantBtn} onClick={requestPermission}>
                        <Mic className={styles.grantBtnIcon} />
                        Grant Microphone Access
                        </button>
                    )}

                    {permissionStatus === 'requesting' && (
                        <button className={styles.grantBtn} disabled>
                        Requesting Permission...
                        </button>
                    )}

                    {permissionStatus === 'granted' && (
                        <div className={styles.grantedSection}>
                        <div className={styles.grantedMessage}>
                            <CheckCircle className={styles.checkIconSmall} />
                            <span>Microphone access granted</span>
                        </div>
                        </div>
                    )}

                    {permissionStatus === 'denied' && (
                        <div className={styles.grantedSection}>
                        <div className={styles.deniedMessage}>
                            <AlertCircle className={styles.checkIconSmall} />
                            <span>Microphone access denied</span>
                        </div>
                        <button className={styles.grantBtn} onClick={requestPermission}>
                            Try Again
                        </button>
                        </div>
                    )}
                </div>

                {/* No need to add "Continue to Dashboard" button; Tina said to just get rid of it
                and automatically navigate to Patient Dashboard after microphone access is granted */}

                <button className={styles.skipBtn} onClick={handleSkip}>
                    Skip for now
                </button>
            </div>
        </main>
    </div>
  );
}

export default PatientAudioSetup;