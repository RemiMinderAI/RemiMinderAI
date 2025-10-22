import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import styles from "./PatientDashboard.module.css";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }

      if (!session) {
        navigate("/"); // redirect if not logged in
      } else {
        setUser(session.user);
      }
    };

    getUser();

    // Optional: listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/"); // auto redirect on sign out
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
  
      // Clear persisted role
      localStorage.removeItem("role");
  
      // Optional: clear any other app-specific state if needed
      // e.g., sessionStorage.clear();
  
      navigate("/"); // back to landing page
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };
  

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
