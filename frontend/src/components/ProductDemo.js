import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductDemo.module.css";
import { useNavigate } from "react-router-dom";
import { FiMic, FiStopCircle, FiDownload, FiShare2, FiCheck, FiClock, FiFileText } from "react-icons/fi";

export default function ProductDemo() {
  const [stage, setStage] = useState("cover");
  const [timer, setTimer] = useState(0);
  const [micError, setMicError] = useState("");
  const handleTryNow = () => setStage("ready");
  const navigate = useNavigate();
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let interval;
    if (stage === "recording") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStart = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setStage("recording");
      setTimer(0);
    } catch (err) {
      setMicError("Microphone access denied. Please allow microphone access and try again.");
      console.warn("Mic error:", err);
    }
  };

  const handleStop = () => {
    // Stop the media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    // Stop ALL audio tracks immediately
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    setStage("processing");
    setTimeout(() => setStage("summary"), 2500);
  };

  const handleSignup = () => {
    navigate("/patient-registration");
  };

  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const xrayDate = new Date(today);
  xrayDate.setDate(today.getDate() + 7);
  const formattedXrayDate = xrayDate.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className={styles.container}>

      {stage === "cover" && (
        <div className={styles.coverScreen}>
          <h2>Experience AI-Powered Care</h2>
          <p>Record a doctor conversation and watch AI turn it into a structured care plan instantly.</p>
          <div className={styles.actions}>
            <button className={styles.buttonPrimary} onClick={handleTryNow}>
              Try Now
            </button>
          </div>
        </div>
      )}

      {stage !== "cover" && (
        <div className={styles.header}>
          <h2>Experience AI-Powered Care</h2>
          <p className={styles.demoNote}>
            This demo uses your microphone to simulate a real visit recording.
            Your voice is not stored — this is for demonstration purposes only.
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
          <p>Press start and speak as if describing a doctor visit. The AI will summarize it.</p>
          {micError && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '8px 0' }}>{micError}</p>
          )}
          <button className={styles.buttonPrimary} onClick={handleStart}>
            <FiMic /> Start Recording
          </button>
          <div className={styles.tips}>
            <h4>Try saying something like...</h4>
            <div>
              <p><FiCheck /> "I've had knee pain for two weeks, worse on stairs"</p>
              <p><FiCheck /> "Doctor prescribed ibuprofen and a knee brace"</p>
              <p><FiCheck /> "Follow up in one week if no improvement"</p>
              <p><FiCheck /> "Apply ice twice daily for 15 minutes"</p>
            </div>
          </div>
        </div>
      )}

      {/* RECORDING */}
      {stage === "recording" && (
        <div className={styles.section}>
          <div className={styles.recordingPulse}>
            <FiMic size={32} />
          </div>
          <h3>Recording Your Visit</h3>
          <p className={styles.timer}>{formatTime(timer)}</p>
          <p>Speak clearly — describe the visit, symptoms, and doctor's recommendations.</p>
          <button className={styles.buttonDanger} onClick={handleStop}>
            <FiStopCircle /> Stop & Summarize
          </button>
        </div>
      )}

      {/* PROCESSING */}
      {stage === "processing" && (
        <div className={styles.section}>
          <h3>AI is Analyzing Your Visit</h3>
          <p>Generating your structured care plan...</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <p>Processing complete</p>
        </div>
      )}

      {/* SUMMARY */}
      {stage === "summary" && (
        <div className={styles.section}>
          <h3>Your Visit Summary</h3>
          <p className={styles.date}>{formattedToday}</p>

          <div className={styles.summaryBlock}>
            <div className={styles.summarySection}>
              <p className={styles.summarySectionTitle}>Visit Summary</p>
              <p>The patient presented with knee pain that started two weeks ago, experiencing discomfort when climbing stairs and getting up from a chair, with morning stiffness and occasional swelling. The doctor identified mild inflammation, possibly early arthritis or overuse, and outlined a one-week treatment plan.</p>
            </div>

            <div className={styles.summarySection}>
              <p className={styles.summarySectionTitle}>Medications</p>
              <ul>
                <li>Ibuprofen (anti-inflammatory) — as directed</li>
                <li>Knee brace — wear when walking</li>
                <li>Ice pack — apply twice daily, 15 minutes each</li>
              </ul>
            </div>

            <div className={styles.summarySection}>
              <p className={styles.summarySectionTitle}>Next Steps</p>
              <ul>
                <li>Avoid stairs when possible</li>
                <li>Rest the knee and reduce physical strain</li>
                <li>Schedule an X-ray on or after {formattedXrayDate} if no improvement</li>
              </ul>
            </div>

            <div className={styles.summarySection}>
              <p className={styles.summarySectionTitle}>❓ Questions for Your Next Visit</p>
              <ul>
                <li>Has the swelling reduced after icing?</li>
                <li>Are there any tips for managing stairs safely?</li>
                <li>Should physical therapy be considered?</li>
              </ul>
            </div>

            <h4><FiClock /> Auto-Generated Reminder</h4>
            <div className={styles.remindersList}>
              <p>Schedule an X-ray on or after {formattedXrayDate}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.buttonSecondaryNOT}><FiDownload /> Download</button>
            <button className={styles.buttonSecondaryNOT}><FiShare2 /> Share</button>
            <button className={styles.buttonPrimaryNOT}><FiCheck /> Confirm Summary</button>
          </div>

          <div className={styles.demoFooter}>
            <button onClick={() => { setStage("cover"); setTimer(0); }} className={styles.restartButton}>
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
