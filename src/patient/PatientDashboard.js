import React, { useEffect, useRef, useState } from "react";
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
import API_BASE_URL from '../config';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [reminders, setReminders] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const audioRef = useRef(null);

  // function to add delay in session check
  async function getSessionWithRetry(maxRetries = 5, delayMs = 200) {
  let retries = 0;
  while (retries < maxRetries) {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase getSession error:", error);
      return null;
    }
    if (session) return session; // session is available
    await new Promise(res => setTimeout(res, delayMs)); // wait a bit
    retries++;
  }
  return null; // session still null after retries
}

  // helper to get auth header
  async function getAuthHeaders() {
    try {
      const session = await getSessionWithRetry();
      const token = session?.access_token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (err) {
      console.warn("Could not get supabase session:", err);
      return {};
    }
  }

  useEffect(() => {
    async function fetchNowReminders() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
  
        const headers = await getAuthHeaders();
  
        const url = new URL(`${API_BASE_URL}/api/reminders`);
        url.searchParams.set("user_id", session.user.id);
  
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json", ...headers },
        });
  
        if (!res.ok) {
          console.error("Failed to fetch reminders");
          return;
        }
  
        const data = await res.json();
        console.log("Dashboard fetch - full server response:", data);
  
        // Combine everything like Reminders page does
        const all = [
          ...(data.today || []),
          ...(data.upcoming || []),
          ...(data.past || []),
        ];
  
        const now = new Date();
        const seen = new Set();
        const nowList = [];
  
        all.forEach(rem => {
          if (seen.has(rem.id)) return;
          seen.add(rem.id);
  
          let status = (rem.status || "").toLowerCase();
          const sched = rem.scheduled_time ? new Date(rem.scheduled_time) : null;
  
          // pending but time has come → active
          if (status === "pending" && sched && sched <= now) {
            status = "active";
          }
  
          // Now = active OR snoozed, and scheduled_time <= now
          if ((status === "active" || status === "snoozed") && sched && sched <= now) {
            nowList.push(rem);
          }
        });
  
        console.log("Dashboard NOW reminders:", nowList);
  
        setTodayReminders(nowList);
        setReminders(all); // optional if you need full list
  
      } catch (err) {
        console.error("Dashboard reminder fetch error:", err);
      }
    }
  
    fetchNowReminders();
  }, []);  

  // Create the audio once
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.5; // optional
  }, []);

  // 🔔 Play sound when new active/snoozed reminders appear
  useEffect(() => {
    if (todayReminders.length > 0 && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay prevented:", err);
      });
    }
  }, [todayReminders]);

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
            .from("users")
            .select("full_name")
            .eq("auth_uid", user.id)
            .single();
  
          if (!error && profile?.full_name) {
            // If DB has a value and it's different, update state + cache
            if (profile.full_name !== localStorage.getItem("display_name")) {
              setDisplayName(profile.full_name);
              localStorage.setItem("display_name", profile.full_name);
              console.debug("Updated display_name from DB:", profile.full_name);
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
      try {
        const session = await getSessionWithRetry(); 
        const currentUser = session?.user;

        // coming from "Forgot Password?" (deprecated feature, we can ignore this for now) -----------------------
        if (isRecovery) {
          setLoading(false);
          return;
        }

        // coming from "Sign In" -> entered correct password or used Google OAuth --------------------------------
        
        const localOnboardingComplete = localStorage.getItem("onboarding_complete") === "true";
        const supabaseOnboardingComplete = currentUser?.user_metadata?.onboarding_complete;

        // Allow access if either onboarding flag is set (localStorage is primary, Supabase metadata is backup)
        const onboardingComplete = localOnboardingComplete || supabaseOnboardingComplete;

        if (!session && !onboardingComplete) {
          console.log("There is no session and onboarding was not completed");
          navigate("/");
          return;
        }

        if (session && !onboardingComplete) {
          console.log("There is an active session, but onboarding was not completed");
          navigate("/patient-consent");
          return;
        }

        setUser(currentUser);
        setLoading(false);
      } catch (err) {
        console.error("Could not get supabase session:", err);
        setLoading(false);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isRecovery) return;

        const localOnboardingComplete = localStorage.getItem("onboarding_complete") === "true";

        if (!session && !localOnboardingComplete) {
          console.log("There is no session and onboarding was not completed");
          navigate("/");
        } else if (session && !localOnboardingComplete) {
          console.log("There is an active session, but onboarding was not completed");
          navigate("/patient-consent");
        } else if (session || localOnboardingComplete) {
          console.log("There is an active session and onboarding was completed");
          setUser(session?.user || null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const [linkedCaregiver, setLinkedCaregiver] = useState(null);
  const [loadingCaregiver, setLoadingCaregiver] = useState(true);

  const fetchLinkedCaregiver = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      const token = data?.session?.access_token;
      if (!token) {
        console.error("⚠️ No valid token found. User might not be logged in.");
        return;
      }

      const mainBackendUrl = `${API_BASE_URL}/api/linked/caregiver`;
      const response = await fetch(mainBackendUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed:", errText);
        return;
      }

      const result = await response.json();
      console.log("✅ Linked caregiver:", result);

      // Update state for rendering
      setLinkedCaregiver(result.caregiver || null);
      

    } catch (err) {
      console.error("Error fetching caregiver:", err);
    } finally {
      setLoadingCaregiver(false);
    }
  };

  useEffect(() => {
    fetchLinkedCaregiver();
  }, []);
  
  const [visits, setVisits] = useState([]);
  const [recentVisit, setRecentVisit] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const [monthlyVisits, setMonthlyVisits] = useState(0);
  
  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/visit-summaries`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVisits(data);
          console.log(data);
          // Get the most recent visit (assuming sorted)
          setRecentVisit(data.length > 0 ? data[0] : null);

          // Total visits
          setTotalVisits(data.length);

          // Visits this month
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const visitsThisMonth = data.filter((visit) => {
            const visitDate = new Date(visit.date); // must match your schema (string → Date)
            return (
              visitDate.getMonth() === currentMonth &&
              visitDate.getFullYear() === currentYear
            );
          });

          setMonthlyVisits(visitsThisMonth.length);
        } else {
          console.error('Failed to fetch visit history');
        }
      } catch (error) {
        console.error('Error fetching visit history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitHistory();
  }, []);

  // ➕ New function for navigating to settings
  const goToSettings = () => {
    navigate("/patient-settings");
  };

  const goToReminders = () => {
    navigate("/patient-reminders");
  };  

  const goToInvitation = () => {
    navigate("/patient-invitation");
  };  

  const goToVisitHistory = () => {
    navigate("/visit-history");
  };  

  const visitHistory = [
    // {
    //   id: 1,
    //   date: "Oct 10, 2025",
    //   title: "Annual Checkup",
    //   doctor: "Dr. Sarah Johnson",
    //   duration: "45 min",
    //   status: "completed",
    // },
    // {
    //   id: 2,
    //   date: "Oct 5, 2025",
    //   title: "Follow-up Visit",
    //   doctor: "Dr. Michael Chen",
    //   duration: "30 min",
    //   status: "completed",
    // },
    // {
    //   id: 3,
    //   date: "Sep 28, 2025",
    //   title: "Lab Results Review",
    //   doctor: "Dr. Sarah Johnson",
    //   duration: "20 min",
    //   status: "completed",
    // },
  ];

  const caregivers = [
    // {
    //   id: 1,
    //   name: "Sarah Anderson",
    //   relationship: "Spouse",
    //   avatar:
    //     "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    // },
    // {
    //   id: 2,
    //   name: "Michael Anderson",
    //   relationship: "Son",
    //   avatar:
    //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    // },
  ];

  // if (loading) return <p>Loading...</p>;

  // Derived profile image from metadata or fallback
  const profileImage = user?.user_metadata?.picture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150";

  return (
    <div className={`${styles.dashboardContainer} ${styles.fadeIn}`}>
      {/* HEADER */}
      <div className={styles.headerGradient}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.profileSection}>
            <img
              src={profileImage}
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
                      : "Jane Doe")
                  }
                </h1>
                <p className={styles.subText}>How are you feeling today?</p>
              </div>
            </div>

            <div className={styles.headerButtons}>
            <button
              className={`${styles.iconButton} ${todayReminders.length > 0 ? styles.activeReminder : ''}`}
              onClick={goToReminders}
            >
              <Bell size={20} />
              {todayReminders.length > 0 && <span className={styles.notificationDot}></span>}
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
            <button className={styles.purpleButton} onClick={() => navigate("/record")}>Start Recording</button>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIconLight}>
              <UserPlus size={22} className={styles.actionIconLightInner} />
            </div>
            <h3>Invite Caregiver</h3>
            <p>Share your health information</p>
            <button className={styles.purpleButton} onClick={goToInvitation}>Send Invitation</button>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIconLight}>
              <History size={22} className={styles.actionIconLightInner} />
            </div>
            <h3>Visit History</h3>
            <p>View all past visit summaries</p>
            <button className={styles.purpleButton} onClick={goToVisitHistory}>View All</button>
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div>
              <p>Total Visits</p>
              <h3>{totalVisits}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.blueBg}`}>
              <Calendar size={20} className={styles.blueText} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <p>This Month</p>
              <h3>{monthlyVisits}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.greenBg}`}>
              <TrendingUp size={20} className={styles.greenText} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <p>Caregivers</p>
              <h3>{linkedCaregiver ? 1 : 0}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.purpleBg}`}>
              <Heart size={20} className={styles.purpleText} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <p>Reminders</p>
              <h3>{todayReminders.length}</h3>
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
            <button className={styles.textButton} onClick={goToVisitHistory}>View All</button>
          </div>
          <div className={styles.visitList}>
            {recentVisit ? (
              <div key={recentVisit.id} className={styles.visitItem}>
                <div className={styles.visitInfo}>
                  <div className={styles.visitIcon}>
                    <FileText size={20} className={styles.purpleText} />
                  </div>
                  <div>
                    <h4>{recentVisit.title}</h4>
                    <p>{recentVisit.doctor}</p>
                    <span className={styles.visitMeta}>
                      {recentVisit.date} • {recentVisit.specialty}
                    </span>
                  </div>
                </div>
                <span className={styles.badgeGreen}>Completed</span>
              </div>
            ) : (
              <p className={styles.emptyState}>No visits yet.</p>
            )}
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
            {loadingCaregiver ? (
              <p>Loading...</p>
            ) : linkedCaregiver ? (
              <div key={linkedCaregiver.id} className={styles.caregiverItem}>
                <div className={styles.visitInfo}>
                  {linkedCaregiver.avatar ? (
                    <img
                      src={linkedCaregiver.avatar}
                      alt={linkedCaregiver.full_name}
                      className={styles.caregiverAvatar}
                    />
                  ) : (
                    <div
                      className={styles.avatar}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#E5E7EB",
                        borderRadius: "50%",
                        width: 64,
                        height: 64,
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#555",
                      }}
                    >
                      {linkedCaregiver.full_name
                        ? linkedCaregiver.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "?"}
                    </div>
                  )}
                  <div>
                    <h4>{linkedCaregiver.full_name}</h4>
                    <p>
                      {linkedCaregiver?.relationship
                        ? linkedCaregiver.relationship.charAt(0).toUpperCase() +
                          linkedCaregiver.relationship.slice(1)
                        : "Primary Caregiver"}
                    </p>
                  </div>
                </div>
                <span className={styles.badgePurple}>Active</span>
              </div>
            ) : (
              <p>No caregiver linked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
