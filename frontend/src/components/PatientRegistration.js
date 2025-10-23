import React, { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabaseClient";
import styles from "./PatientRegistration.module.css";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import { FaApple, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PatientRegistration() {
  const navigate = useNavigate();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);

  // --- Handle session and redirect after email verification ---
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        // Check if the email is verified (depends on provider)
        if (user.email_confirmed_at || user.identities?.length > 0) {
          navigate("/consent/patient");
        }
      }
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) navigate("/consent/patient");
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let observer;
  
    const tryAttachSignInOverride = () => {
      // Find the "Sign in" link rendered by Supabase
      const signInLink = Array.from(document.querySelectorAll("a")).find((el) =>
        el.textContent?.trim().toLowerCase().includes("sign in")
      );
  
      if (signInLink) {
        // Replace it with a clone so Supabase handlers are removed
        const newLink = signInLink.cloneNode(true);
        signInLink.replaceWith(newLink);
  
        newLink.addEventListener("click", (e) => {
          e.preventDefault();
          navigate("/signin");
        });
  
        console.log("✅ Custom sign-in link override applied!");
  
        // Stop observing — job done
        if (observer) observer.disconnect();
      }
    };
  
    // Observe DOM mutations for when Supabase UI renders
    observer = new MutationObserver(() => tryAttachSignInOverride());
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Also try immediately in case it's already rendered
    tryAttachSignInOverride();
  
    return () => observer.disconnect();
  }, [navigate]);  

  // --- Google Sign Up ---
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/consent/patient`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          RemeMinderAI
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create Patient Account</h1>
          <p className={styles.subtitle}>Choose your preferred sign-up method</p>

          {!showEmailForm ? (
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.signUpButton} ${styles.emailButton}`}
                onClick={() => setShowEmailForm(true)}
              >
                <AiOutlineMail size={18} />
                Sign up with Email
              </button>
              <button
                className={`${styles.signUpButton} ${styles.googleButton}`}
                onClick={handleGoogleSignUp}
              >
                <FcGoogle size={18} />
                Sign up with Google
              </button>
              <button
                className={`${styles.signUpButton} ${styles.appleButton}`}
                onClick={() => setShowAppleModal(true)}
              >
                <FaApple size={18} />
                Sign up with Apple
              </button>
              <button className={styles.backButton} onClick={() => navigate("/")}>
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
                  button: { backgroundColor: "#7c3aed", borderRadius: "8px", fontWeight: 600 }, // Purple for patients
                  input: { borderRadius: "8px" },
                },
              }}
              theme="light"
              providers={[]}
              view="sign_up"
              // Pass redirectTo here
              redirectTo={`${window.location.origin}/signup-confirmation`}
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
              Apple sign-in isn’t available yet. Please try Google or Email for
              now.
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
