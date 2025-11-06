import React, { useEffect, useState } from 'react';
import { FaCamera, FaUser} from 'react-icons/fa';
import styles from './PatientProfileSetup.module.css';
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PatientProfileSetup = () => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // ✅ Fetch logged-in user's email on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email);
      }
      if (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    getUser();
  }, []);

  const navigate = useNavigate();

  const goHome = () => {
    // optional: show confirm dialog or save progress
    navigate("/");
  };

  const handleContinue = async () => {
    if (!fullName || !dob || !phone) {
      alert("Please fill in all required fields: Full Name, Date of Birth, and Phone Number.");
      return;
    }
  
    console.log("Validation passed, sending register request...");
  
    try {
      // Get Supabase session (JWT) for auth header
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error("No active session found:", sessionError);
        alert("Session expired. Please log in again.");
        return;
      }
  
      const token = session.access_token;
  
      // Prepare payload
      const payload = {
        full_name: fullName,
        date_of_birth: dob,
        gender,
        phone_number: phone,
        notes,
        email: userEmail,
        role: "patient"
      };
  
      // Call register API
      const response = await fetch("http://localhost:8000/api/patient/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Register API failed: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("✅ Register success:", data);
  
      // Save locally for convenience (optional)
      localStorage.setItem("patientProfile", JSON.stringify(payload));
      localStorage.setItem("display_name", fullName);
  
      navigate("/patient-audio-setup");
    } catch (err) {
      console.error("Register error:", err);
      alert("Error saving profile. Please try again.");
    }
  };
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={goHome}>
          RemiMinderAI
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <h1 className={styles.title}>Complete your profile</h1>
        <p className={styles.subtitle}>Help us personalize your healthcare experience</p>

        <div className={styles.card}>
          {/* Profile Photo Upload */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarCircle}>
                <FaUser className={styles.avatarIcon} />
              </div>
              <button className={styles.cameraButton}>
                <FaCamera className={styles.cameraIcon} />
              </button>
            </div>
            <p className={styles.uploadText}>Upload profile photo</p>
          </div>

          {/* Form Fields */}
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="dob">Date of Birth *</label>
                <div className={styles.dateInputWrapper}>
                    <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)}
                    className={styles.dateInput}
                    />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* ✅ Dynamic Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={userEmail || ''}
                disabled
              />
              <p className={styles.helperText}>Verified during registration</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Health Notes (Optional)</label>
              <textarea
                id="notes"
                placeholder="Any allergies, conditions, or important health information..."
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className={styles.helperText}>
                This information helps personalize your care experience
              </p>
            </div>
          </form>

          {/* Divider line */}
          <hr className={styles.divider} />

          {/* Review Section */}
          <div className={styles.reviewSection}>
            <h3>Review Your Information</h3>
            <div className={styles.reviewBox}>
              <div className={styles.reviewRow}>
                <span>Name:</span>
                <span>{fullName || '--'}</span>
              </div>
              <div className={styles.reviewRow}>
                <span>Date of Birth:</span>
                <span>{dob || '--'}</span>
              </div>
              <div className={styles.reviewRow}>
                <span>Gender:</span>
                <span>{gender || '--'}</span>
              </div>
              <div className={styles.reviewRow}>
                <span>Phone:</span>
                <span>{phone || '--'}</span>
              </div>
              <div className={styles.reviewRow}>
                <span>Email:</span>
                <span>{userEmail || "john.doe@example.com"}</span>
              </div>
            </div>
          </div>

          <button className={styles.confirmButton} onClick={handleContinue}>Confirm & Continue</button>
        </div>
      </main>
    </div>
  );
};

export default PatientProfileSetup;
