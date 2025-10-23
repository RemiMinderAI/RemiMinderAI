import React, { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import { FaApple, FaTimes, FaUser, FaUserFriends } from "react-icons/fa";
import styles from "./SignIn.module.css";

export default function SignIn() {
  const navigate = useNavigate();

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
        navigate(`/dashboard/${currentRole}`);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, role, recoveryMode]);

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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard/${currentRole}` },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  // --- Password reset handler ---
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const currentRole = localStorage.getItem("role") || "patient";
      navigate(`/dashboard/${currentRole}`);
    } catch (err) {
      setMessage(err.message);
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
            RemeMinderAI
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
              <form onSubmit={handlePasswordReset} className={styles.form}>
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
                  {loading ? "Resetting..." : "Sign in"}
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
            RemeMinderAI
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
          RemeMinderAI
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
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: {
                      borderRadius: "8px",
                      fontWeight: "600",
                      backgroundColor: role === "patient" ? "#7c3aed" : "#10b981", // purple vs green
                      color: "white",
                    },
                    buttonHover: {
                      backgroundColor: role === "patient" ? "#6d28d9" : "#059669", // darker on hover
                    },
                    input: { borderRadius: "8px" },
                  },
                }}
                theme="light"
                providers={[]}
                view="sign_in"
                showLinks={true}
                redirectTo={`${window.location.origin}/signin`}
              />
              <button
                onClick={() => setShowEmailForm(false)}
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
