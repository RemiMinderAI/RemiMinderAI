import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import API_BASE_URL from '../config';

const CaregiverInvite = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [patientName, setPatientName] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get("token");
    if (!inviteToken) {
      setStatus("error");
      return;
    }
    setToken(inviteToken);

    const verifyInvitation = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/invitations/verify?token=${inviteToken}`
        );
        if (!res.ok) throw new Error("Invalid or expired");
        const data = await res.json();
        setPatientName(data.patient_name);
        setCaregiverEmail(data.caregiver_email);
        setStatus("valid");
      } catch {
        setStatus("error");
      }
    };
    verifyInvitation();
  }, []);

  const handleAcceptInvitation = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/invitations/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      localStorage.setItem("invitationToken", token);
      localStorage.setItem("caregiverEmail", data.caregiver_email);
  
      if (res.ok) {
        if (data.status === "accepted") {
          // Existing caregiver → go to signin
          navigate("/sign-in");
        } else if (data.status === "new_user") {
          // New caregiver → go to signup, pass token & email
          navigate(`/create-account?token=${token}&email=${data.caregiver_email}`);
        }
      } else {
        alert(data.detail || "Error accepting invitation.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to accept invitation.");
    }
  };  

  const handleCancel = () => navigate("/");

  if (status === "loading")
    return <p style={{ textAlign: "center", marginTop: 50 }}>Verifying your invitation...</p>;

  if (status === "error")
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Invalid or expired invitation link.</h2>
        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #F8FBF8, #FFFFFF)",
        paddingTop: 80,
        fontFamily: "inherit",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#00B881",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "white",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-6.716-4.675-9.163-7.122C.93 11.97.5 9.38 2.05 7.83c1.55-1.55 4.07-1.424 5.62.126L12 10.29l4.33-4.33c1.55-1.55 4.07-1.676 5.62-.126 1.55 1.55 1.12 4.14-.787 6.048C18.716 16.325 12 21 12 21z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: "500", color: "#111", margin: "0 0 8px 0" }}>
            You've Been Invited!
          </h1>
          <p style={{ fontSize: 16, color: "#555", margin: 0 }}>Someone wants to share their health information with you</p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 32,
            marginBottom: 24,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '48px',  // larger for icon
              color: '#555'
            }}>
              <FaUser />
            </div>
            <div style={{ fontSize: 20, fontWeight: "500", color: "#111", marginBottom: 4 }}>
              {patientName || "Jane Doe"}
            </div>
            <div style={{ fontSize: 16, color: "#555", marginBottom: 16 }}>
              has invited you to be their caregiver
            </div>
            <div
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FAFAFA",
                borderRadius: 12,
                padding: 16,
                fontSize: 14,
                color: "#555",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              "I'd like to share my health information with you so you can help me stay on top of my appointments and medical care. Thank you for being there for me!"
            </div>
          </div>

          {/* Permissions Section */}
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <h2 style={{ fontSize: 18, fontWeight: "500", color: "#111", marginBottom: 16 }}>
              As a Caregiver, You'll Have Access To:
            </h2>

            {/* Access Items */}
            <div style={{ textAlign: "left", maxWidth: 500, margin: "0 auto" }}>
              {[
                {
                  title: "Visit Summaries",
                  desc: "View all recorded healthcare visits and AI-generated summaries",
                  bg: "#E3F2FD",
                  color: "#4F8EF7",
                  icon: (
                    <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5" />
                  ),
                },
                {
                  title: "Health Information",
                  desc: "Access health notes, medications, and medical history",
                  bg: "#F3E8FF",
                  color: "#7E5BEF",
                  icon: (
                    <path d="M12 5c7 0 10 7 10 7s-3 7-10 7S2 12 2 12s3-7 10-7zm0 3.5A3.5 3.5 0 1 0 12 15a3.5 3.5 0 0 0 0-7z" />
                  ),
                },
                {
                  title: "Appointments",
                  desc: "Stay informed about upcoming appointments and reminders",
                  bg: "#E6F7F0",
                  color: "#30C48D",
                  icon: (
                    <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2h3zm15 7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9h20zm-5 5H7v2h10v-2z" />
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: item.bg,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 14, color: "#555", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role & Responsibilities */}
          <div
            style={{
              backgroundColor: "#E9F7EC",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              justifyContent: "center", // keeps overall card centered
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#D1F2EB",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1EA365",
                flexShrink: 0,
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l8 4v6c0 5-3 9-8 10C7 21 4 17 4 12V6l8-4zm0 5a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 7z" />
              </svg>
            </div>
            <div style={{ textAlign: "left", maxWidth: 500 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 4 }}>
                Your Role & Responsibilities
              </div>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.4, margin: 0 }}>
                As a caregiver, you'll have read-only access to the patient's health information. You must respect their privacy and use this information only for caregiving purposes. The patient can revoke your access at any time.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={handleAcceptInvitation}
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "#00B881",
              borderRadius: 8,
              border: "none",
              color: "white",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              marginBottom: 16,
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#009A6B")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00B881")}
          >
            Accept Invitation & Continue
          </button>
          <button
            onClick={handleCancel}
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #A3A3A3",
              color: "#333",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#F5F5F5")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
          >
            Decline
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#777", margin: "1rem", lineHeight: 1.4 }}>
          By accepting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default CaregiverInvite;
