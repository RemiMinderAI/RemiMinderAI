import React, { useState } from "react";
import { ArrowLeft, Mail, Send, Check, Phone, User } from "lucide-react";
import styles from "./PatientInvitation.module.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import API_BASE_URL from '../config';

export default function PatientInvitation({ onBack }) {
  const [caregiverName, setCaregiverName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [personalMessage, setPersonalMessage] = useState(""); // for textarea
  const [apiMessage, setApiMessage] = useState(""); // for success/error messages
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async () => {
    if (!email) {
      alert("Please provide the caregiver's email.");
      return;
    }

    setIsSending(true);  // NEW: lock the button
    setSent(false); // ensure confirmation screen is hidden while loading
    setApiMessage(""); // reset message
  
    try {
      // Get JWT token from Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
  
      if (!token) {
        alert("You must be logged in to send an invitation.");
        setIsSending(false); // unlock
        return;
      }
  
      // Build request body
      const body = {
        caregiver_email: email,
        caregiver_name: caregiverName || "Your Caregiver",
      };
  
      const res = await fetch(`${API_BASE_URL}/api/invitations/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        // Invitation sent successfully or re-sent
        setApiMessage(result.message);
        setSent(true);
        // alert(result.message)
      } else {
        // Handle errors (400, 403)
        setApiMessage(result.detail || "Something went wrong. Please try again.");
        alert(result.detail)
      }
    } catch (err) {
      console.error(err);
      setApiMessage("Network error. Please try again.");
      alert(apiMessage)
    }

    setIsSending(false); // NEW: unlock when done
  };  

  const handleBack = () => {
    navigate("/dashboard/patient");
  };

  if (sent) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
            <div className={styles.headerInner}>
                <button className={styles.backButton} onClick={handleBack}>
                <ArrowLeft size={20} />
                </button>
                <div className={styles.headerText}>
                    <h2>Invite Caregiver</h2>
                    <p className={styles.subtitle}>Share your health information with someone you trust</p>
                </div>
            </div>
        </div>

        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.sentContainer}>
              <div className={styles.iconCircle}>
                <Check size={48} className={styles.checkIcon} />
              </div>
              <h2>Invitation Sent!</h2>
              <p>{`We’ve sent a secure invitation to ${email}.`}</p>

              <div className={styles.infoBox}>
                <p>
                  Your caregiver will receive an email with instructions to
                  create their account and access your health information.
                  You can manage their access anytime from your settings.
                </p>
              </div>

              <div className={styles.buttonRow}>
                <button
                  className={`${styles.button} ${styles.outline}`}
                  onClick={() => setSent(false)}
                >
                  Send Another
                </button>
                <button className={styles.button} onClick={handleBack}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
        <div className={styles.header}>
            <div className={styles.headerInner}>
                <button className={styles.backButton} onClick={handleBack}>
                <ArrowLeft size={20} />
                </button>
                <div className={styles.headerText}>
                    <h2>Invite Caregiver</h2>
                    <p className={styles.subtitle}>Share your health information with someone you trust</p>
                </div>
            </div>
        </div>

      <main className={styles.main}>
        <div className={styles.card}>
          <label>Caregiver Name *</label>
            <div className={styles.inputGroup}>
              <User size={18} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Jane Doe"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                required
              />
            </div>
          <label>Email Address *</label>
          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              type="email"
              placeholder="caregiver@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <label>Phone Number (Optional)</label>
          <div className={styles.inputGroup}>
            <Phone size={18} className={styles.inputIcon} />
            <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <p className={styles.hint}>
            We'll send an SMS invitation as well
          </p>

          <label>Personal Message (Optional)</label>
          <textarea
            rows="4"
            placeholder="I'd like to share my health information with you..."
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
          />
        </div>

        <div className={styles.card}>
          <h3>What Your Caregiver Will See</h3>
          <ul className={styles.list}>
            <li>All visit summaries and recordings</li>
            <li>Your health notes and medications</li>
            <li>Upcoming appointments and reminders</li>
          </ul>

          <div className={styles.warningBox}>
            You can revoke access at any time from your caregiver
            management settings.
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button
            className={`${styles.button} ${styles.outline}`}
            onClick={handleBack}
          >
            Cancel
          </button>
          <button
            className={styles.button}
            onClick={handleSendInvite}
            disabled={isSending}
            style={{
              opacity: isSending ? 0.6 : 1,
              cursor: isSending ? "not-allowed" : "pointer",
              pointerEvents: isSending ? "none" : "auto",
            }}
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send size={16} style={{ marginRight: "6px" }} />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
