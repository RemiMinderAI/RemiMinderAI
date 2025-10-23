import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import styles from "./PatientDashboard.module.css";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // detect password recovery flow in the URL
    const url = window.location.hash;
    const isRecovery = url.includes("type=recovery");

    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }

      // if this is a password recovery link, skip redirects entirely
      if (isRecovery) {
        console.log("Password recovery detected — skipping redirects");
        setLoading(false);
        return;
      }

      // Not logged in → redirect home
      if (!session) {
        navigate("/");
        return;
      }

      const currentUser = session.user;
      const isOnboarded = currentUser.user_metadata?.onboarding_complete;

      // If onboarding incomplete → redirect
      if (!isOnboarded) {
        navigate("/consent/patient");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // don’t interfere with password recovery sessions
      if (isRecovery) return;

      if (!session) {
        navigate("/");
      } else {
        const currentUser = session.user;
        if (!currentUser.user_metadata?.onboarding_complete) {
          navigate("/consent/patient");
        } else {
          setUser(currentUser);
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("role");
      setUser(null); // prevent rendering crash
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

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
            Welcome, {user?.email || "Patient"}!
          </h1>
          <p className={styles.subtitle}>This is your dashboard.</p>

          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}
