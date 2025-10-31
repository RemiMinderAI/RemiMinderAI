import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Users,
  FileText,
  Settings as SettingsIcon,
  Heart,
  Calendar,
  MessageSquare,
  Bell,
  Eye,
} from "lucide-react";
import styles from "./CaregiverDashboard.module.css";

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const cachedDisplay = localStorage.getItem("display_name");
      if (cachedDisplay) setDisplayName(cachedDisplay);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();

          if (profile?.display_name) {
            setDisplayName(profile.display_name);
            localStorage.setItem("display_name", profile.display_name);
          }
        } else {
          localStorage.removeItem("display_name");
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
  
        // If Supabase is optional, don't hard-fail on missing session
        const isOnboarded = localStorage.getItem("onboarding_complete");
  
        if (!isOnboarded) {
          navigate("/consent/caregiver");
          return;
        }
  
        // Only redirect home if you're actually requiring auth
        if (session === null && !isOnboarded) {
          navigate("/");
          return;
        }
  
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
  
    checkSession();
  }, [navigate]);  

  const goToSettings = () => {
    navigate("/caregiver-settings");
  };
  const goToReminders = () => {}; // disabled
  const goToMessages = () => {}; // disabled
  const goToManagePatients = () => {}; // disabled
  const goToAppointments = () => {}; // disabled
  const goToVisitSummaries = () => {}; // disabled

  const patients = [
    {
      id: 1,
      name: "Jane Doe",
      lastVisit: "Oct 10, 2025",
      nextAppointment: "Oct 20, 2025",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
      id: 2,
      name: "Robert Anderson",
      lastVisit: "Oct 8, 2025",
      nextAppointment: "Nov 2, 2025",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  ];

  const visits = [
    {
      id: 1,
      patient: "Jane Doe",
      title: "Annual Checkup",
      doctor: "Dr. Sarah Johnson",
      date: "Oct 10, 2025",
      summary:
        "Routine annual physical exam. All vitals within normal range. No concerns reported.",
    },
    {
      id: 2,
      patient: "Robert Anderson",
      title: "Follow-up Visit",
      doctor: "Dr. Michael Chen",
      date: "Oct 5, 2025",
      summary:
        "Blood pressure under control. Medication regimen continues as prescribed.",
    },
  ];

  const profileImage =
    user?.user_metadata?.picture ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150";

  if (loading) return <p>Loading...</p>;

  return (
    <div className={`${styles.dashboardContainer} ${styles.fadeIn}`}>
      {/* HEADER */}
      <div className={styles.headerGradientGreen}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.profileSection}>
              <img src={profileImage} alt="Profile" className={styles.avatar} />
              <div>
                <div className={styles.logoRow}>
                  <Heart size={18} className={styles.logoIconWhite} />
                  <span className={styles.logoTextWhite}>CareMinder</span>
                </div>
                <h1 className={styles.welcomeTextWhite}>
                  Welcome back,{" "}
                  {displayName ||
                    user?.user_metadata?.name ||
                    user?.user_metadata?.full_name ||
                    (user?.email
                      ? user.email.split("@")[0].charAt(0).toUpperCase() +
                        user.email.split("@")[0].slice(1)
                      : "John Smith")}
                </h1>
                <p className={styles.subTextWhite}>Caregiver Dashboard</p>
              </div>
            </div>

            <div className={styles.headerButtons}>
              <button className={styles.iconButtonWhite} onClick={goToReminders}>
                <Bell size={20} />
              </button>
              <button className={styles.iconButtonWhite} onClick={goToMessages}>
                <MessageSquare size={20} />
              </button>
              <button className={styles.iconButtonWhite} onClick={goToSettings}>
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>

          {/* INFO CARD */}
          <div className={styles.tipCardGreen}>
            <div className={styles.tipIconGreen}>
              <Heart size={20} />
            </div>
            <div>
              <h4 className={styles.tipTitleWhite}>Your Role</h4>
              <p className={styles.tipTextWhite}>
                You have read-only access to your patients’ health information.
                You can view summaries, appointments, and care notes to support
                them effectively.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* QUICK ACTIONS */}
        <div className={styles.primaryActions}>
          <div className={styles.actionCard}>
            <div className={styles.actionIconGreenLight}>
              <UserPlus size={22} />
            </div>
            <h3>Invite Patient</h3>
            <p>Connect with a patient on CareMinder</p>
            <button className={styles.greenButton}>Send Invitation</button>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIconGreenLight}>
              <Users size={22} />
            </div>
            <h3>Manage Patients</h3>
            <p>View and manage patients under your care</p>
            <button
              className={styles.greenButton}
              onClick={goToManagePatients}
            >
              View All
            </button>
          </div>

          {/* <div className={styles.actionCard}>
            <div className={styles.actionIconGreenLight}>
              <FileText size={22} />
            </div>
            <h3>Visit Summaries</h3>
            <p>Review patient visit summaries</p>
            <button
              className={styles.greenButtonOutline}
              onClick={goToVisitSummaries}
            >
              View History
            </button>
          </div> */}
        </div>

        {/* VISIT SUMMARIES */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Visit Summaries</h3>
              <p>Recent checkups and follow-up notes</p>
            </div>
            <button className={styles.textButton}>View All</button>
          </div>

          <div className={styles.listContainer}>
            {visits.map((visit) => (
              <div key={visit.id} className={styles.listItem}>
                <div className={styles.visitInfo}>
                  <div className={styles.listIconGreen}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4>{visit.title}</h4>
                    <p>
                      {visit.patient} — {visit.doctor}
                    </p>
                    <span className={styles.visitMeta}>{visit.date}</span>
                  </div>
                </div>
                <span className={styles.badgeGreen}>Reviewed</span>
              </div>
            ))}
          </div>
        </div>

        {/* PATIENT LIST */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Your Patients</h3>
              <p>People currently under your care</p>
            </div>
            <button className={styles.textButton}>Manage</button>
          </div>

          <div className={styles.listContainer}>
            {patients.map((p) => (
              <div key={p.id} className={styles.listItem}>
                <div className={styles.visitInfo}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className={styles.listAvatar}
                  />
                  <div>
                    <h4>{p.name}</h4>
                    <p>Last Visit: {p.lastVisit}</p>
                    <p>Next Appointment: {p.nextAppointment}</p>
                  </div>
                </div>
                <span className={styles.badgePurple}>Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACCESS NOTICE */}
        <div className={styles.noticeCardBlue}>
        <div className={styles.noticeIconBlue}>
            <Eye size={18} />
        </div>
        <div>
            <h4>Read-Only Access</h4>
            <p>
            You can only view patient records and appointments. Editing or
            deleting information requires patient permission.
            </p>
        </div>
        </div>
      </div>
    </div>
  );
}
