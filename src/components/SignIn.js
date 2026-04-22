import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import { FaApple, FaTimes, FaUser, FaUserFriends } from "react-icons/fa";
import styles from "./SignIn.module.css";
import { FRONTEND_URL } from "../config";

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // --- Top-level state ---
  const [role, setRole] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  // Recovery form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authMethod, setAuthMethod] = useState("email"); // "email" | "google" | etc.
  const [resetSent, setResetSent] = useState(false);

  // --- Detect password recovery link ---
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") setRecoveryMode(true);
  }, []);

  // --- Load persisted role ---
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  // --- Handle auth state changes + redirects ---
  useEffect(() => {
    const currentRole = role || localStorage.getItem("role") || "patient";

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        return;
      }
      if (session?.user && !recoveryMode) {
        const dest = searchParams.get("redirect");
        if (dest && dest.startsWith("/") && !dest.startsWith("//")) {
          navigate(dest);
        } else {
          navigate(`/dashboard/${currentRole}`);
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, role, recoveryMode, searchParams]);

  useEffect(() => {
    const clearRecovery = () => setRecoveryMode(false);
    window.addEventListener("beforeunload", clearRecovery);
    return () => window.removeEventListener("beforeunload", clearRecovery);
  }, []);  

  // --- Override Supabase "Sign up" link ---
  useEffect(() => {
    let observer;

    const tryAttachLinkOverride = () => {
      const signUpLink = Array.from(document.querySelectorAll("a")).find((el) =>
        el.textContent?.trim().toLowerCase().includes("sign up")
      );

      if (signUpLink) {
        const newLink = signUpLink.cloneNode(true);
        signUpLink.replaceWith(newLink);
        newLink.addEventListener("click", (e) => {
          e.preventDefault();
          const currentRole = role || localStorage.getItem("role") || "patient";
          if (currentRole === "patient") navigate("/register/patient");
          else if (currentRole === "caregiver") navigate("/register/caregiver");
          else navigate("/register/patient");
        });
        if (observer) observer.disconnect();
      }
    };

    observer = new MutationObserver(() => tryAttachLinkOverride());
    observer.observe(document.body, { childList: true, subtree: true });
    tryAttachLinkOverride();

    return () => observer.disconnect();
  }, [navigate, role]);

  // --- Google OAuth sign-in ---
  const handleGoogleSignIn = async () => {
    try {
      const currentRole = role || localStorage.getItem("role") || "patient";
      const r = searchParams.get("redirect");
      let returnTo = `${FRONTEND_URL}/dashboard/${currentRole}`;
      if (r && r.startsWith("/") && !r.startsWith("//")) {
        returnTo = `${FRONTEND_URL}/sign-in?redirect=${encodeURIComponent(r)}`;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: returnTo },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  // --- Password reset handler ---
  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${FRONTEND_URL}/sign-in`, // 👈 redirect after email link
    });

    if (error) {
      console.error("Password reset error:", error.message);
      alert("Error sending password reset link. Please try again.");
    } else {
      setResetSent(true);
      alert("Password reset email sent! Check your inbox.");
    }
  };

  // --- Email sign-in handler ---
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error("Supabase login error:", error.message);
        setMessage("Incorrect email or password.");
        return;
      }
  
      // Success - auth listener will handle navigation
    } catch (err) {
      console.error("Sign-in error:", err);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  // --- Recovery mode UI ---
  if (recoveryMode) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo} onClick={() => navigate("/")}>
            RemiMinderAI
          </div>
        </header>

        <main className={styles.main}>
          {/* Outer transparent card, centers everything */}
          <div className={styles.card}>
            {/* Heading above the white card */}
            <div className={styles.heading}>
              <h1 className={styles.title}>Reset Your Password</h1>
              <p className={styles.subtitle}>Enter a new password to continue</p>
            </div>

            {/* White card containing the form */}
            <div className={styles.formCard}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setMessage("");
                  try {
                    const { data, error } = await supabase.auth.updateUser({ password });
                    if (error) throw error;
                    setMessage("Password successfully updated! You can now sign in.");
                    setTimeout(() => {
                      const currentRole = localStorage.getItem("role") || "patient";
                      setRecoveryMode(false);
                      navigate(`/dashboard/${currentRole}`);
                    }, 1500);                    
                  } catch (err) {
                    console.error("Password update error:", err.message);
                    setMessage("Error updating password. Try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className={styles.form}
              >
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  placeholder="Your email address"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className={styles.label}>New password</label>
                <input
                  type="password"
                  placeholder="Your new password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  style={{
                    backgroundColor: role === "patient" ? "#7c3aed" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                  }}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                {message && <p className={styles.errorMessage}>{message}</p>}
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Step 1: choose role ---
  if (!role) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo} onClick={() => navigate("/")}>
            RemiMinderAI
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.card}>
            <h1 className={styles.title}>Who’s Signing In?</h1>
            <p className={styles.subtitle}>Please select your role to continue</p>

            <div className={styles.roleButtons}>
              <button
                className={styles.roleButton}
                onClick={() => {
                  setRole("patient");
                  localStorage.setItem("role", "patient");
                }}
              >
                <div className={styles.iconBoxPatient}>
                  <FaUser className={styles.icon} />
                </div>
                <div>
                  <h1>Patient</h1>
                  <p>Record and track my own visits</p>
                </div>
              </button>

              <button
                className={styles.roleButton2}
                onClick={() => {
                  setRole("caregiver");
                  localStorage.setItem("role", "caregiver");
                }}
              >
                <div className={styles.iconBoxCaregiver}>
                  <FaUserFriends className={styles.icon} />
                </div>
                <div>
                  <h1>Caregiver</h1>
                  <p>Monitor and manage patient records</p>
                </div>
              </button>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/")}>
              Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --- Step 2: sign-in options ---
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate("/")}>
          RemiMinderAI
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            {role === "patient" ? "Patient Sign In" : "Caregiver Sign In"}
          </h1>
          <p className={styles.subtitle}>Choose your preferred sign-in method</p>

          {!showEmailForm ? (
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.signInButton} ${styles.emailButton}`}
                onClick={() => setShowEmailForm(true)}
              >
                <AiOutlineMail size={18} />
                Sign in with Email
              </button>

              <button
                className={`${styles.signInButton} ${styles.googleButton}`}
                onClick={handleGoogleSignIn}
              >
                <FcGoogle size={18} />
                Sign in with Google
              </button>

              <button
                className={`${styles.signInButton} ${styles.appleButton}`}
                onClick={() => setShowAppleModal(true)}
              >
                <FaApple size={18} />
                Sign in with Apple
              </button>

              <button
                onClick={() => {
                  setRole(null);
                  setShowEmailForm(false);
                  localStorage.removeItem("role");
                }}
                className={styles.backButton}
              >
                Back
              </button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <form className={styles.form} onSubmit={handleEmailSignIn}>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div style={{ textAlign: "right", marginBottom: "16px" }}>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6B7280",
                      fontSize: "14px",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {resetSent && (
                  <p style={{ color: "#00B881", fontSize: "14px" }}>
                    Password reset link sent! Check your email.
                  </p>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: role === "patient" ? "#7c3aed" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                {message && <p className={styles.errorMessage}>{message}</p>}
              </form>

              <button
                type="button"
                onClick={() => {
                  setShowEmailForm(false);
                  setEmail("");
                  setPassword("");
                  setMessage("");
                }}
                className={styles.backButton}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </main>

      {showAppleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button
              className={styles.modalClose}
              onClick={() => setShowAppleModal(false)}
            >
              <FaTimes size={14} />
            </button>
            <h2 className={styles.modalTitle}>Coming Soon 🍎</h2>
            <p className={styles.modalText}>
              Apple sign-in isn’t available yet. Please try Google or Email for now.
            </p>
            <button
              onClick={() => setShowAppleModal(false)}
              className={styles.modalButton}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
