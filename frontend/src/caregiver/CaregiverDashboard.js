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
  const [caregiverProfile, setCaregiverProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const pendingCount = pendingInvitations.length;
  const hasPendingInvitations = pendingCount > 0;
  const [linkedPatients, setLinkedPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // 🟢 Step 1: Load cached caregiver profile
      const profileRaw = localStorage.getItem("caregiverProfile");
      if (profileRaw) {
        try {
          const parsed = JSON.parse(profileRaw);
          setCaregiverProfile(parsed);
          if (parsed.fullName) {
            setDisplayName(parsed.fullName);
            console.debug("Using cached caregiverProfile:", parsed);
          }
        } catch (err) {
          console.warn("Error parsing caregiverProfile:", err);
        }
      }

      // 🟢 Step 2: Load Supabase user (optional backup)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user && !displayName) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name")
            .eq("auth_uid", user.id)
            .single();

          if (profile?.full_name) {
            setDisplayName(profile.full_name);
            localStorage.setItem("display_name", profile.full_name);
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // 🟢 Step 3: Verify onboarding completion
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isOnboarded = localStorage.getItem("onboarding_complete");
        if (!isOnboarded) {
          navigate("/consent/caregiver");
          return;
        }
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

  useEffect(() => {
    async function fetchPendingInvitations() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) return;
  
        const { data, error } = await supabase
          .from("invitations")
          .select("id, status")
          .eq("caregiver_email", user.email)
          .eq("status", "pending");
  
        if (error) throw error;
        setPendingInvitations(data || []);
      } catch (err) {
        console.error("Error fetching pending invitations:", err);
      }
    }
  
    fetchPendingInvitations();
  }, []);

  // Fetch linked patients from your API
  useEffect(() => {
    async function fetchLinkedPatients() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.email) return;
  
        const response = await fetch(
          `${API_BASE_URL}/api/linked/patients?email=${encodeURIComponent(user.email)}`
        );        
        if (!response.ok) throw new Error("Failed to fetch linked patients");
  
        const data = await response.json();
        console.debug("Fetched linked patients:", data);
  
        // backend returns { caregiver_email, linked_patients: [...] }
        setLinkedPatients(data.linked_patients || []);
      } catch (err) {
        console.error("Error fetching linked patients:", err);
        setLinkedPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    }
  
    fetchLinkedPatients();
  }, []);  

  // 🟢 Navigation
  const goToSettings = () => navigate("/caregiver-settings");
  const goToReminders = () => {}; // disabled
  const goToMessages = () => {}; // disabled
  const goToInvitations = () => navigate("/caregiver/invitations"); // disabled
  const goToManagePatients = () => {}; // disabled

  const patients = [
    // {
    //   id: 1,
    //   name: "Jane Doe",
    //   lastVisit: "Oct 10, 2025",
    //   nextAppointment: "Oct 20, 2025",
    //   avatar:
    //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    // },
    // {
    //   id: 2,
    //   name: "Robert Anderson",
    //   lastVisit: "Oct 8, 2025",
    //   nextAppointment: "Nov 2, 2025",
    //   avatar:
    //     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    // },
  ];

  const visits = [
    // {
    //   id: 1,
    //   patient: "Jane Doe",
    //   title: "Annual Checkup",
    //   doctor: "Dr. Sarah Johnson",
    //   date: "Oct 10, 2025",
    //   summary:
    //     "Routine annual physical exam. All vitals within normal range. No concerns reported.",
    // },
    // {
    //   id: 2,
    //   patient: "Robert Anderson",
    //   title: "Follow-up Visit",
    //   doctor: "Dr. Michael Chen",
    //   date: "Oct 5, 2025",
    //   summary:
    //     "Blood pressure under control. Medication regimen continues as prescribed.",
    // },
  ];

  const profileImage =
    user?.user_metadata?.picture ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150";

  // if (loading) return <p>Loading...</p>;

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
          {/* Patient Invitations (identical structure to Manage Patients, color toggled) */}
          <div className={hasPendingInvitations ? styles.actionCardOrange : styles.actionCard}>
            <div className={hasPendingInvitations ? styles.actionIconOrangeLight : styles.actionIconGreenLight}>
              <UserPlus size={22} />
            </div>

            <h3>Patient Invitations</h3>
            <p>Review and respond to patient access requests</p>

            <button
              className={hasPendingInvitations ? styles.orangeButton : styles.greenButton}
              onClick={goToInvitations}
            >
              <div className={styles.inviteButtonWrapper}>
                View Invitations
                {hasPendingInvitations && <span className={styles.badgeBubble}>{pendingCount}</span>}
              </div>
            </button>
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
            {loadingPatients ? (
              <p>Loading patients...</p>
            ) : linkedPatients.length > 0 ? (
              linkedPatients.map((p) => (
                <div key={p.patient_id} className={styles.listItem}>
                  <div className={styles.visitInfo}>
                    {p.patient_picture ? (
                      <img
                        src={p.patient_picture}
                        alt={p.patient_name}
                        className={styles.listAvatar}
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
                        {p.patient_name
                          ? p.patient_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </div>
                    )}
                    <div>
                      <h4>{p.patient_name}</h4>
                      <p>Last Visit: N/A</p>
                      <p>Next Appointment: N/A</p>
                    </div>
                  </div>
                  <span className={styles.badgePurple}>Active</span>
                </div>
              ))
            ) : (
              <p>No patients linked yet.</p>
            )}
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
