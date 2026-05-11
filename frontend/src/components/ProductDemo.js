import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductDemo.module.css";
import { useNavigate } from "react-router-dom";
import { FiMic, FiStopCircle, FiDownload, FiShare2, FiCheck, FiClock, FiFileText } from "react-icons/fi";
import demoAudio from "../assets/sample.mp3";
import API_BASE_URL from '../config';

export default function ProductDemo() {
  const [stage, setStage] = useState("cover");
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

  const fullTranscription = `Hi, Margaret. How have you been feeling since your last visit? Hello, Dr. Patel. I've been doing okay, but I'm getting more tired in the afternoons than usual. Tell me about that. When does the tiredness start, and how long does it last? Around two or three in the afternoon. I usually need to sit down for an hour. It's been going on for about a month now. Have you been sleeping well at night? Most nights, yes. I go to bed around ten and wake up around six. And how about your appetite and water intake during the day? My appetite is fine. Water — I probably don't drink enough. Maybe three or four glasses a day. That could be part of it. For someone your age, eight glasses a day is a good target. Try keeping a water bottle nearby and sipping throughout the morning. I can try that. Should I be worried about something more serious? Based on what you're telling me, I don't see signs of anything serious. The afternoon tiredness with low water intake is a common pattern. Let's give the water habit two weeks and see if you feel better. What if it doesn't help? If you still feel tired after two weeks of more water, give us a call and we'll schedule some routine blood work just to rule things out. That sounds good. Anything else I should do? Keep up your morning walks. Try to get outside for at least twenty minutes a day. Sunlight in the morning helps with energy levels too. Okay, I'll do that. Thank you, Dr. Patel. You're welcome, Margaret. I'll see you at your six-month checkup in November. Take care.`;

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
      {stage === "cover" && (
        <div className={styles.coverScreen}>
          <h2>RemiMinder Demo</h2>
          <p>See how easy it is to record and summarize your visits.</p>
          <div className={styles.actions}>
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
              Dr. Patel asked Margaret about her afternoon tiredness, which has been happening for about a month. He noticed that Margaret only drinks three or four glasses of water a day and suggested she try eight glasses a day instead. He recommended keeping a water bottle nearby and sipping throughout the morning. He also encouraged Margaret to continue her morning walks and get at least twenty minutes of sunlight outside each day. If the tiredness doesn't improve after two weeks of drinking more water, Margaret should call the office to schedule routine blood work. Her next checkup is at the six-month mark in November.
            </p>

            <h4><FiFileText /> Full Transcription</h4>
            <div className={styles.transcriptionBox}>
              {transcriptionSentences.map((sentence, index) => (
                <p key={index}>{sentence.trim()}</p>
              ))}
            </div>

            <h4><FiClock /> Auto-Generated Reminders</h4>
            <div className={styles.remindersList}>
              <p>Try drinking 8 glasses of water daily — check back in 2 weeks if tiredness persists</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.buttonSecondaryNOT}><FiDownload /> Download</button>
            <button className={styles.buttonSecondaryNOT}><FiShare2 /> Share</button>
            <button className={styles.buttonPrimaryNOT}><FiCheck /> Confirm Summary</button>
          </div>

          <div className={styles.demoFooter}>
            <button onClick={handleSignup} className={styles.signupButton}>
                Try Your Own Voice Note →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
