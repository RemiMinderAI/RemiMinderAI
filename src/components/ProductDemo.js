import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductDemo.module.css";
import { useNavigate } from "react-router-dom";
import { FiMic, FiStopCircle, FiDownload, FiShare2, FiCheck, FiClock, FiFileText } from "react-icons/fi";
import demoAudio from "../assets/sample.mp3";
import API_BASE_URL from '../config';

export default function ProductDemo() {
  const [stage, setStage] = useState("cover");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const handleTryNow = () => setStage("ready");
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [aiSummary, setAiSummary] = useState("");
  const [fullTranscript, setFullTranscript] = useState([]);
  const [reminders, setReminders] = useState([]);

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

  const handleStop = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  
    // await fetchDemoSummary(); // fetches AI summary from backend
    setStage("processing");
    setTimeout(() => {
      setStage("summary");
    }, 2000); // 2000ms = 2 seconds
  };  

  const handleSignup = () => {
    navigate("/patient-registration");
  };

  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  const fullTranscription = `Hi, Ursula. I understand you've been having some knee pain. Can you tell me when it started and what makes it worse? Yes, it started about two weeks ago. It hurts most when I climb stairs or get up from a chair. That sounds like mild inflammation, possibly early arthritis or overuse. Does it swell or feel warm after activity? A little bit, yes, and it feels stiff in the mornings. All right, I recommend taking an anti-inflammatory like ibuprofen, using a knee brace when you're walking, and avoiding stairs when possible. Apply ice twice a day for 15 minutes. If it doesn't improve in a week, we'll schedule an x-ray. OK, thank you, doctor. I'll try that. You're welcome, Ursula. Take care and rest that knee.`;

  // Split into sentences (regex keeps punctuation at the end)
  const transcriptionSentences = fullTranscription.match(/[^.!?]+[.!?]+/g) || [];

  // Get today's date
  const today = new Date();

  // Format date nicely (e.g. "Thursday, November 6, 2025")
  const formattedToday = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Add 7 days
  const xrayDate = new Date(today);
  xrayDate.setDate(today.getDate() + 7);

  // Format that one too
  const formattedXrayDate = xrayDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchDemoSummary = async () => {
    try {
      setStage("processing");
  
      const response = await fetch(`${API_BASE_URL}/api/demo-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript_text: fullTranscription }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const data = await response.json();
      console.log("Demo summary:", data);
  
      setAiSummary(data.ai_summary || "");
      setFullTranscript(data.full_transcription ? [data.full_transcription] : []);
      setReminders(data.reminders || []);
      setStage("summary");
    } catch (error) {
      console.error("Demo summary fetch failed:", error);
      setStage("summary"); // fallback
    }
  };
    
  return (
    <div className={styles.container}>
      {isVideoOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setIsVideoOpen(false)}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/dVbArw-WjwA?autoplay=1"
              title="Demo Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {stage === "cover" && (
        <div className={styles.coverScreen}>
          <h2>RemiMinder Demo</h2>
          <p>See how easy it is to record and summarize your visits.</p>
          <div className={styles.actions}>
            <button
              className={styles.buttonSecondary}
              onClick={() => setIsVideoOpen(true)}
            >
              Demo Video
            </button>
            <button className={styles.buttonPrimary} onClick={handleTryNow}>
            Try Now
            </button>
          </div>
        </div>
      )}

      {stage !== "cover" && (
      <div className={styles.header}>
        <h2>RemiMinder Demo</h2>
        <p className={styles.demoNote}>
          Uses a sample recording — your real conversations stay private.
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
          <p className={styles.date}>{formattedToday}</p>

          <div className={styles.summaryBlock}>
            <h4><FiCheck /> AI Summary</h4>
            <p>
              The patient presented with knee pain that started about two weeks ago, experiencing discomfort when climbing stairs, getting up from a chair, and noting morning stiffness with occasional swelling. The doctor suggested these symptoms might be due to mild inflammation, possibly early arthritis or overuse. The doctor recommended taking an anti-inflammatory medication like ibuprofen, using a knee brace when walking, avoiding stairs when possible, and applying ice to the knee twice daily.
            </p>

            <h4><FiFileText /> Full Transcription</h4>
            <div className={styles.transcriptionBox}>
              {transcriptionSentences.map((sentence, index) => (
                <p key={index}>{sentence.trim()}</p>
              ))}
            </div>

            <h4><FiClock /> Auto-Generated Reminders</h4>
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
            <button
                onClick={() => setStage("cover")}
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
