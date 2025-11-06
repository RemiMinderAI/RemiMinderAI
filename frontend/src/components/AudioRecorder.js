import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Menu, ArrowLeft, Mic, CheckCircle2, Square, Upload } from 'lucide-react';
import styles from './AudioRecorder.module.css'; // Import the CSS module

const RecordVisitPage = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localOnboardingComplete = localStorage.getItem("onboarding_complete") === "true";
      const supabaseOnboardingComplete = session?.user?.user_metadata?.onboarding_complete;

      // Allow access if either onboarding flag is set
      const onboardingComplete = localOnboardingComplete || supabaseOnboardingComplete;

      if (!session && !onboardingComplete) {
        navigate('/patient-dashboard');
      }
    };
    checkAccess();
  }, [navigate]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setAudioURL('');
      setAudioBlob(null);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(recordedBlob);
        setAudioURL(url);
        setAudioBlob(recordedBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setElapsedTime(0);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("No audio recorded to upload!");
      return;
    }

    console.log("Uploading audioBlob:", audioBlob);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Create a FormData object to send the file
    const formData = new FormData();
    // 'file' is the name the FastAPI endpoint is expecting
    formData.append('file', audioBlob, 'visit_recording.wav'); 
    formData.append('user_id', userId);

    try {
      // Send the POST request to your FastAPI backend
      const response = await fetch('http://localhost:8001/upload-audio/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Transcription successful:', result);
        alert(`Transcription: ${result.transcription}`);
         
        setAudioURL('');
        setAudioBlob(null);
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert(`Upload failed: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      alert('An error occurred during upload. Is the backend server running?');
    }
  };
  

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <Menu className={styles.icon} />
          <div>
            <h1 className={styles.logoTitle}>MediMinderAI</h1>
            <p className={styles.logoSubtitle}>MyMinder</p>
          </div>
        </div>

      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.backButtonArea}>
          <button className={styles.backButton} onClick={() => navigate('/patient-dashboard')}>
            <ArrowLeft className={styles.iconSmall} />
            <span className={styles.backButtonText}>Record Visit</span>
          </button>
          <p className={styles.backButtonSubtitle}>Tap to start recording your visit</p>
        </div>

        {/* Recording Card */}
        <div className={`${styles.card} ${styles.recordingCard}`}>
          <div className={`${styles.micButton} ${isRecording ? styles.micButtonRecording : ''}`}>
            <Mic className={styles.micIcon} />
          </div>
          <h2 className={styles.title}>
            {isRecording ? `Recording... ${formatTime(elapsedTime)}` : 'Ready to Record'}
          </h2>
          <p className={styles.subtitle}>
            {isRecording ? 'Press the button below to stop recording' : 'Press the button below to start recording your visit'}
          </p>
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`${styles.recordButton} ${isRecording ? styles.stopButton : ''}`}
          >
            {isRecording ? <Square size={20} /> : <Mic size={20} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          {/* Audio Playback and Upload Controls */}
          {audioURL && !isRecording && (
            <div className={styles.playbackContainer}>
              <audio controls src={audioURL} className={styles.audioPlayer} />
              <button onClick={uploadAudio} className={styles.uploadButton}>
                <Upload size={20} />
                Upload Recording
              </button>
            </div>
          )}
        </div>
        
        {/* Recording Tips Card */}
        <div className={`${styles.card} ${styles.tipsCard}`}>
          <h3 className={styles.tipsTitle}>Recording Tips</h3>
          <ul className={styles.tipsList}>
            <li className={styles.tipItem}>
              <CheckCircle2 className={styles.tipIcon} />
              <span>Find a quiet location with minimal background noise</span>
            </li>
            <li className={styles.tipItem}>
              <CheckCircle2 className={styles.tipIcon} />
              <span>Speak clearly and at a normal pace</span>
            </li>
            <li className={styles.tipItem}>
              <CheckCircle2 className={styles.tipIcon} />
              <span>Keep your device close during the conversation</span>
            </li>
            <li className={styles.tipItem}>
              <CheckCircle2 className={styles.tipIcon} />
              <span>Recording will stop automatically or tap stop when done</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default RecordVisitPage;
