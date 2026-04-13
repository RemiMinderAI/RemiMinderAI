import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const EmailVerification = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("caregiverEmail") || "john.doe@example.com";

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    return `${localPart.substring(0, 2)}***@${domain}`;
  };

  const handleResend = () => {
    alert("Verification email resent!");
  };

  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
  
      if (data?.user?.email_confirmed_at) {
        setIsVerified(true);
        clearInterval(interval);
      }
    }, 4000);
  
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #F8FBF9, #FFFFFF)",
        paddingTop: "120px",
        fontFamily:
          "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#111827",
              margin: "0",
              lineHeight: "1.2",
            }}
          >
            Create Caregiver Account
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#6B7280",
              margin: "8px 0 0 0",
              lineHeight: "1.4",
            }}
          >
            Choose your preferred sign-up method
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)",
            width: "420px",
            padding: "40px",
            marginBottom: "32px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#E9F7EC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#00B881">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 8l8 5 8-5v10H4V8zm8 3L4 6h16l-8 5z" />
            </svg>
          </div>

          {/* Titles */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#111827",
                margin: "0",
                lineHeight: "1.2",
              }}
            >
              Check Your Email
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#6B7280",
                margin: "4px 0 0 0",
                lineHeight: "1.4",
              }}
            >
              We sent a verification link to {maskEmail(userEmail)}.
            </p>
            <p
              style={{
                fontSize: "16px",
                color: "#6B7280",
                marginTop: "16px",
              }}
            >
              Click the link in the email to verify your account, then come back
              here to continue.
            </p>
          </div>

          {/* Review Consent Button */}
          <button
            onClick={() => navigate("/consent")}
            disabled={!isVerified}
            style={{
              width: "100%",
              height: "48px",
              backgroundColor: isVerified ? "#00B881" : "#9BDDC8",
              cursor: isVerified ? "pointer" : "not-allowed",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
              marginTop: "24px",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#00a06f")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#00B881")}
          >
            {isVerified ? "Review Consent Agreement" : "Verify Email First"}
          </button>

          {/* Resend Email */}
          {/* <button
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#00B881",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "20px",
              textAlign: "center",
              width: "100%",
              transition: "text-decoration 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Resend email
          </button> */}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: "1.4",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "#00B881",
              fontWeight: "500",
              cursor: "pointer",
              textDecoration: "none",
              transition: "text-decoration 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            onClick={() => navigate("/signin")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
