import { useState, useEffect } from "react";
import { Mic, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styles from "./PatientAudioSetup.module.css";

export function PatientAudioSetup() {
  const navigate = useNavigate();
  const [permissionStatus, setPermissionStatus] = useState("idle"); // 'idle' | 'requesting' | 'granted' | 'denied'

  useEffect(() => {
    // Enforce flow: must have completed profile setup
    const patientProfile = localStorage.getItem("patientProfile");
    console.log("PatientAudioSetup: checking patientProfile", patientProfile ? "present" : "not present");
    if (!patientProfile) {
      console.log("Redirecting back to profile setup");
      navigate("/patient-profile-setup");
    } else {
      console.log("Profile present, staying in audio setup");
    }
  }, [navigate]);

  const goHome = () => navigate("/");

  // Helper to mark onboarding complete
  const completeOnboarding = async () => {
    // Set localStorage backup (immediate and reliable)
    localStorage.setItem("onboarding_complete", "true");

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Could not get user:", userError?.message);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { onboarding_complete: true },
    });

    if (error) console.error("Failed to update onboarding status:", error.message);
  };

  const requestPermission = async () => {
    setPermissionStatus("requesting");
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop microphone immediately after permission check
      stream.getTracks().forEach((track) => track.stop());

      setPermissionStatus("granted");

      // Mark onboarding complete
      await completeOnboarding();

      // Navigate to dashboard after short delay
      setTimeout(() => navigate("/dashboard/patient"), 1000);
    } catch (err) {
      console.error("Microphone permission denied", err);
      setPermissionStatus("denied");
    }
  };

  const handleSkip = async () => {
    setPermissionStatus("idle");
    await completeOnboarding(); // mark onboarding complete even if skipped
    navigate("/dashboard/patient");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={goHome}>
          RemiMinderAI
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

          {/* Card */}
          <div className={styles.card}>
            {/* Microphone Illustration */}
            <div className={styles.illustration}>
              <div className={styles.micWrapper}>
                <div className={styles.micCircle}>
                  <Mic className={styles.micIcon} />
                </div>

                {permissionStatus === "granted" && (
                  <div className={styles.checkBadge}>
                    <CheckCircle className={styles.checkIcon} />
                  </div>
                )}
                {permissionStatus === "requesting" && <div className={styles.spinner} />}
              </div>
            </div>

            {/* Benefits */}
            <div className={styles.benefits}>
              <h4 className={styles.benefitsTitle}>What you can do with voice visits:</h4>
              <div className={styles.benefitList}>
                {[
                  "Record doctor appointments and health visits",
                  "Get AI-generated summaries of your visits",
                  "Share visit summaries with your caregivers",
                  "Build a comprehensive health history",
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

            {/* Permission Buttons / Messages */}
            {permissionStatus === "idle" && (
              <button className={styles.grantBtn} onClick={requestPermission}>
                <Mic className={styles.grantBtnIcon} />
                Grant Microphone Access
              </button>
            )}

            {permissionStatus === "requesting" && (
              <button className={styles.grantBtn} disabled>
                Requesting Permission...
              </button>
            )}

            {permissionStatus === "granted" && (
              <div className={styles.grantedSection}>
                <div className={styles.grantedMessage}>
                  <CheckCircle className={styles.checkIconSmall} />
                  <span>Microphone access granted</span>
                </div>
              </div>
            )}

            {permissionStatus === "denied" && (
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

          {/* Skip Button */}
          <button className={styles.skipBtn} onClick={handleSkip}>
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
}

export default PatientAudioSetup;
