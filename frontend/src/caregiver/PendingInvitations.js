import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  Clock,
  Heart,
} from "lucide-react";
import styles from "./PendingInvitations.module.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import API_BASE_URL from '../config';

const PendingInvitations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
  
        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email || localStorage.getItem("email");
        if (!email) throw new Error("No caregiver email found.");
  
        // 1️⃣ Fetch pending invitations
        const { data: invitationsData, error: invError } = await supabase
          .from("invitations")
          .select("*")
          .eq("caregiver_email", email)
          .eq("status", "pending");
        if (invError) throw invError;
  
        if (!invitationsData.length) {
          setInvitations([]);
          return;
        }
  
        // 2️⃣ Fetch patient info from users table
        const patientIds = invitationsData.map(inv => inv.patient_id);
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", patientIds);
        if (usersError) throw usersError;
  
        // 3️⃣ Merge invitations with patient info
        const normalized = invitationsData.map(inv => {
          const patient = usersData.find(u => u.id === inv.patient_id);
          return {
            id: inv.id,
            token: inv.token,
            patientName: patient?.full_name || "Unknown Patient",
            patientEmail: patient?.email || "No email provided",
            relationship: inv.relationship || "N/A",
            message: inv.message || "",
            invitedDate: new Date(inv.created_at).toLocaleDateString(),
            status: inv.status,
          };
        });        
  
        setInvitations(normalized);
  
      } catch (err) {
        console.error("Error fetching invitations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvitations();
  }, []);  

  const handleAccept = async (inv) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/invitations/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inv.token }),
      });
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.detail || "Failed to accept invitation");
  
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
  
      // optional: redirect if needed based on data.status
    } catch (err) {
      console.error(err);
      alert("Error accepting invitation. Please try again.");
    }
  };
  
  const handleReject = async (inv) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/invitations/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inv.token, status: "declined" }),
      });
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.detail || "Failed to decline invitation");
  
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    } catch (err) {
      console.error(err);
      alert("Error declining invitation. Please try again.");
    }
  };  

  const filtered = invitations.filter((inv) =>
    [inv.patientName, inv.patientEmail, inv.relationship]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const renderCard = (inv) => (
    <div key={inv.id} className={styles.invitationCard}>
      <div className={styles.cardTop}>
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
          {inv.patientName
            ? inv.patientName
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
            : "?"}
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.patientName}>{inv.patientName}</h3>
            <span className={`${styles.statusBadge} ${styles.statusPending}`}>
              <Clock size={12} /> Pending
            </span>
          </div>
          <p className={styles.patientEmail}>{inv.patientEmail}</p>
          <p className={styles.metaText}>
            Relationship: {inv.relationship || "N/A"} • Invited on {inv.invitedDate}
          </p>
        </div>
      </div>

      {inv.message && (
        <div className={styles.messageBox}>
          <p className={styles.messageText}>
            <em>"{inv.message}"</em>
          </p>
        </div>
      )}

      <div className={styles.actionButtons}>
      <button className={styles.acceptButton} onClick={() => handleAccept(inv)}>
        <UserCheck size={16} /> Accept
      </button>
      <button className={styles.declineButton} onClick={() => handleReject(inv)}>
        <UserX size={16} /> Decline
      </button>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <Clock size={32} className={styles.emptyIconInner} />
      </div>
      <h3>No pending invitations</h3>
      <p>You're all caught up! Patients can invite you from their MediMinder account.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={() => navigate("/dashboard/caregiver")}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.headerText}>
            <h2>Pending Invitations</h2>
            <p>Review and respond to patient invitations</p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search invitations by name, email, or relationship..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading invitations...</div>
        ) : error ? (
          <div className={styles.errorState}>Error: {error}</div>
        ) : (
          <div className={styles.invitationList}>
            {filtered.length > 0 ? filtered.map(renderCard) : renderEmpty()}
          </div>
        )}

        <div className={styles.infoBanner}>
          <Heart className={styles.infoIcon} />
          <div>
            <p className={styles.infoTitle}>About Patient Invitations</p>
            <p className={styles.infoText}>
              Patients invite caregivers to access their health information. By accepting, you'll have read-only access to their visit summaries, appointments, and health notes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PendingInvitations;
