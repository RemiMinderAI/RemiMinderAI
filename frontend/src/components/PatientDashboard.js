import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  UserPlus,
  History,
  Settings as SettingsIcon,
  Heart,
  FileText,
  Calendar,
  TrendingUp,
  MessageSquare,
  Bell,
} from "lucide-react";
import styles from "./PatientDashboard.module.css";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function loadUser() {
      // 1) immediate local fallback: display_name or patientProfile.fullName
      const cachedDisplay = localStorage.getItem("display_name");
      if (cachedDisplay) {
        setDisplayName(cachedDisplay);
        console.debug("Using cached display_name:", cachedDisplay);
      } else {
        const patientProfileRaw = localStorage.getItem("patientProfile");
        if (patientProfileRaw) {
          try {
            const parsed = JSON.parse(patientProfileRaw);
            if (parsed?.fullName) {
              setDisplayName(parsed.fullName);
              console.debug("Using cached patientProfile.fullName:", parsed.fullName);
            }
          } catch (err) {
            console.warn("Error parsing patientProfile from localStorage", err);
          }
        }
      }
  
      // 2) fetch supabase user + optionally profile, but DO NOT let DB override local immediately unless present
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
  
        if (user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();
  
          if (!error && profile?.display_name) {
            // If DB has a value and it's different, update state + cache
            if (profile.display_name !== localStorage.getItem("display_name")) {
              setDisplayName(profile.display_name);
              localStorage.setItem("display_name", profile.display_name);
              console.debug("Updated display_name from DB:", profile.display_name);
            }
          }
        } else {
          // user not present, clear local cache
          localStorage.removeItem("display_name");
        }
      } catch (err) {
        console.error("Error loading user/profile:", err);
      }
    }
  
    loadUser();
  }, []);  

  useEffect(() => {
    const url = window.location.hash;
    const isRecovery = url.includes("type=recovery");

    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }

      if (isRecovery) {
        setLoading(false);
        return;
      }

      if (!session) {
        navigate("/");
        return;
      }

      const currentUser = session.user;
      const isOnboarded = currentUser.user_metadata?.onboarding_complete;

      if (!isOnboarded) {
        navigate("/consent/patient");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // ➕ New function for navigating to settings
  const goToSettings = () => {
    navigate("/patient/settings");
  };

  const goToReminders = () => {
    navigate("/patient/reminders");
  };  

  const visitHistory = [
    {
      id: 1,
      date: "Oct 10, 2025",
      title: "Annual Checkup",
      doctor: "Dr. Sarah Johnson",
      duration: "45 min",
      status: "completed",
    },
    {
      id: 2,
      date: "Oct 5, 2025",
      title: "Follow-up Visit",
      doctor: "Dr. Michael Chen",
      duration: "30 min",
      status: "completed",
    },
    {
      id: 3,
      date: "Sep 28, 2025",
      title: "Lab Results Review",
      doctor: "Dr. Sarah Johnson",
      duration: "20 min",
      status: "completed",
    },
  ];

  const caregivers = [
    {
      id: 1,
      name: "Sarah Anderson",
      relationship: "Spouse",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    {
      id: 2,
      name: "Michael Anderson",
      relationship: "Son",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
  ];

  // if (loading) return <p>Loading...</p>;

  return (
    <div className={`${styles.dashboardContainer} ${styles.fadeIn}`}>
      {/* HEADER */}
      <div className={styles.headerGradient}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.profileSection}>
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Profile"
                className={styles.avatar}
              />
              <div>
                <div className={styles.logoRow}>
                  <Heart size={18} className={styles.logoIcon} />
                  <span className={styles.logoText}>MyMinder</span>
                </div>
                <h1 className={styles.welcomeText}>
                  Welcome, {
                    displayName ||
                    user?.user_metadata?.name ||
                    user?.user_metadata?.full_name ||
                    (user?.email
                      ? user.email.split("@")[0].charAt(0).toUpperCase() +
                        user.email.split("@")[0].slice(1)
                      : "User")
                  }
                </h1>
                <p className={styles.subText}>How are you feeling today?</p>
              </div>
            </div>

            <div className={styles.headerButtons}>
              <button className={styles.iconButton} onClick={goToReminders}>
                <Bell size={20} />
              </button>
              
              <button className={styles.iconButton}>
                <MessageSquare size={20} />
              </button>

              <button className={styles.iconButton} onClick={goToSettings}>
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>

          {/* QUICK TIP */}
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}>
              <Heart size={20} />
            </div>
            <div>
              <h4 className={styles.tipTitle}>Quick Tip</h4>
              <p className={styles.tipText}>
                Record your visits to keep track of your health journey. You can
                share summaries with your caregivers anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* PRIMARY ACTIONS */}
        <div className={styles.primaryActions}>
          <div className={styles.actionCard}>
            <div className={styles.actionIconPurple}>
              <Mic size={22} className={styles.actionIcon} />
            </div>
            <h3>Record Visit</h3>
            <p>Start recording your healthcare visit</p>
            <button className={styles.purpleButton}>Start Recording</button>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIconLight}>
              <UserPlus size={22} className={styles.actionIconLightInner} />
            </div>
            <h3>Invite Caregiver</h3>
            <p>Share your health information</p>
            <button className={styles.purpleButton}>Send Invitation</button>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIconLight}>
              <History size={22} className={styles.actionIconLightInner} />
            </div>
            <h3>Visit History</h3>
            <p>View all past visit summaries</p>
            <button className={styles.purpleButton}>View All</button>
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div>
              <p>Total Visits</p>
              <h3>24</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.blueBg}`}>
              <Calendar size={20} className={styles.blueText} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <p>This Month</p>
              <h3>3</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.greenBg}`}>
              <TrendingUp size={20} className={styles.greenText} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <p>Caregivers</p>
              <h3>{caregivers.length}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.purpleBg}`}>
              <Heart size={20} className={styles.purpleText} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <p>Documents</p>
              <h3>18</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.orangeBg}`}>
              <FileText size={20} className={styles.orangeText} />
            </div>
          </div>
        </div>

        {/* RECENT VISITS */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Recent Visits</h3>
              <p>Your latest healthcare visits</p>
            </div>
            <button className={styles.textButton}>View All</button>
          </div>
          <div className={styles.visitList}>
            {visitHistory.map((visit) => (
              <div key={visit.id} className={styles.visitItem}>
                <div className={styles.visitInfo}>
                  <div className={styles.visitIcon}>
                    <FileText size={20} className={styles.purpleText} />
                  </div>
                  <div>
                    <h4>{visit.title}</h4>
                    <p>{visit.doctor}</p>
                    <span className={styles.visitMeta}>
                      {visit.date} • {visit.duration}
                    </span>
                  </div>
                </div>
                <span className={styles.badgeGreen}>Completed</span>
              </div>
            ))}
          </div>
        </div>

        {/* CAREGIVERS */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Your Caregivers</h3>
              <p>People who have access to your health information</p>
            </div>
            <button className={styles.textButton}>Manage</button>
          </div>
          <div className={styles.caregiverList}>
            {caregivers.map((cg) => (
              <div key={cg.id} className={styles.caregiverItem}>
                <div className={styles.visitInfo}>
                  <img
                    src={cg.avatar}
                    alt={cg.name}
                    className={styles.caregiverAvatar}
                  />
                  <div>
                    <h4>{cg.name}</h4>
                    <p>{cg.relationship}</p>
                  </div>
                </div>
                <span className={styles.badgePurple}>Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
