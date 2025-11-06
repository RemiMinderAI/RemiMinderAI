import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductDemo.module.css";
import { useNavigate } from "react-router-dom";
import { FiMic, FiStopCircle, FiDownload, FiShare2, FiCheck, FiClock, FiFileText } from "react-icons/fi";
import demoAudio from "../assets/sample.mp3";

export default function ProductDemo() {
  const [stage, setStage] = useState("cover");
  const [timer, setTimer] = useState(0);
  const handleTryNow = () => setStage("ready");
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (stage === "recording") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleStart = () => {
    setStage("recording");
    setTimer(0);

    // Stop any previous audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create a new instance and save it
    const audioInstance = new Audio(demoAudio);
    audioInstance.volume = 0.5;
    audioInstance.play().catch((err) => {
      console.warn("Playback blocked:", err);
    });

    // Store it for cleanup
    audioRef.current = audioInstance;
  };

  const handleStop = () => {
    // Stop playback immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setStage("processing");
    setTimeout(() => setStage("summary"), 3000);
  };

  const handleSignup = () => {
    navigate("/patient-registration");
  };

  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className={styles.container}>
      {stage === "cover" && (
        <div className={styles.coverScreen}>
          <h2>RemiMinder Demo</h2>
          <p>See how easy it is to record and summarize your visits.</p>
          <button className={styles.buttonPrimary} onClick={handleTryNow}>
          Try Now
          </button>
        </div>
      )}

      {stage !== "cover" && (
      <div className={styles.header}>
        <h2>RemiMinder Demo</h2>
        <p className={styles.demoNote}>
          This demo uses a sample audio recording to protect privacy and remain HIPAA-compliant. 
          Your voice is not recorded — this simulation is for demonstration purposes only.
        </p>
      </div>
      )}

      {/* READY */}
      {stage === "ready" && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2><FiMic /></h2>
          </div>
          <h3>Ready to Record</h3>
          <p>Press the button below to start recording your visit.</p>
          <button className={styles.buttonPrimary} onClick={handleStart}>
            <FiMic /> Start Recording
          </button>

          <div className={styles.tips}>
            <h4>Recording Tips</h4>
            <div>
              <p><FiCheck /> Find a quiet location with minimal background noise</p>
              <p><FiCheck /> Speak clearly and at a normal pace</p>
              <p><FiCheck /> Keep your device close during the conversation</p>
              <p><FiCheck /> Recording will stop automatically or tap stop when done</p>
            </div>
          </div>
        </div>
      )}

      {/* RECORDING */}
      {stage === "recording" && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2><FiMic /></h2>
          </div>
          <h3>Recording</h3>
          <p className={styles.timer}>{formatTime(timer)}</p>
          <p>Recording your visit...</p>
          <button className={styles.buttonDanger} onClick={handleStop}>
            <FiStopCircle /> Stop Recording
          </button>
        </div>
      )}

      {/* PROCESSING */}
      {stage === "processing" && (
        <div className={styles.section}>
          <h3>Processing Recording</h3>
          <p>Our AI is analyzing your visit and creating a summary</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <p>100% complete</p>
        </div>
      )}

      {/* SUMMARY */}
      {stage === "summary" && (
        <div className={styles.section}>
          <h3>Visit Summary</h3>
          <p className={styles.date}>Saturday, November 1, 2025</p>

          <div className={styles.summaryBlock}>
            <h4><FiCheck /> AI Summary</h4>
            <p>
              The patient met with Dr. Smith for a follow-up consultation after routine lab results. No major health issues were detected. The doctor advised maintaining a balanced diet and continuing the prescribed blood pressure medication. A follow-up check is recommended in six months.
            </p>

            <h4><FiFileText /> Full Transcription</h4>
            <div className={styles.transcriptionBox}>
              <p><strong>Doctor:</strong> Hi, good morning! How have you been feeling since your last visit?</p>
              <p><strong>Patient:</strong> Pretty good overall. I’ve been keeping up with my medication and walking most days.</p>
              <p><strong>Doctor:</strong> That’s great. Your lab results look normal, blood pressure is steady, and everything seems in good shape. Let’s continue with your current regimen.</p>
              <p><strong>Patient:</strong> Sounds good. Should I book another check-up soon?</p>
              <p><strong>Doctor:</strong> Yes, let’s plan for six months from now unless anything changes.</p>
            </div>

            <h4><FiClock /> Auto-Generated Reminders</h4>
            <ul className={styles.remindersList}>
                <li>Take blood pressure medication daily at 8:00 AM</li>
                <li>Schedule next check-up: May 2026</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button className={styles.buttonSecondary}><FiDownload /> Download</button>
            <button className={styles.buttonSecondary}><FiShare2 /> Share</button>
            <button className={styles.buttonPrimary}><FiCheck /> Confirm Summary</button>
          </div>

          <div className={styles.demoFooter}>
            <button
                onClick={() => setStage("ready")}
                className={styles.restartButton}
            >
                Restart Demo
            </button>
            <button onClick={handleSignup} className={styles.signupButton}>
                Try Your Own Voice Note →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
