import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styles from "./CaregiverSettings.module.css";
import {
  ArrowLeft,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";

export default function CaregiverSettings({ onBack, onLogout, role = "caregiver" }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 987-6543",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  });

  const navigate = useNavigate();

  // ✅ Fetch caregiver info from Supabase or localStorage
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (user) {
        setUser(user);

        // 🟢 Load caregiver profile from localStorage first
        const localProfile = JSON.parse(localStorage.getItem("caregiverProfile"));

        setUserData((prev) => ({
          ...prev,
          name:
            localProfile?.fullName ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email.split("@")[0],
          phone: localProfile?.phoneNumber || prev.phone,
          email: user.email,
          avatar: user.user_metadata?.picture || prev.avatar,
        }));
      }
    };

    fetchUser();
  }, []);

  const handleBack = () => {
    navigate(-1); // navigates back to previous page
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("role");
      localStorage.removeItem("caregiverProfile"); // 🧹 clear local profile
      localStorage.removeItem("display_name");
      localStorage.removeItem("caregiverEmail");
      localStorage.removeItem("invitationToken");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };  

  return (
    <div className={styles.container}>
      {/* Header */}
      <div
        className={`${styles.header} ${
          role === "patient" ? styles.purpleGradient : styles.greenGradient
        }`}
      >
        <div className={styles.headerContent}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.headerTitle}>Settings</h1>
            <p className={styles.headerSubtitle}>
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.subheader}>Profile Information</h3>
            <button className={styles.editButton}>Edit</button>
          </div>

          <div className={styles.profileInfo}>
            <img src={userData.avatar} alt="avatar" className={styles.avatar} />
            <div>
              <h4>{userData.name}</h4>
              <p className={styles.roleText}>
                {role === "patient" ? "Patient Account" : "Caregiver Account"}
              </p>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <Mail size={16} className={styles.icon} />
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{userData.email}</span>
            </div>
            <div className={styles.infoItem}>
              <Phone size={16} className={styles.icon} />
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{userData.phone}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconCircleBlue}>
              <Bell size={18} />
            </div>
            <div>
              <h3 className={styles.subheader}>Notifications</h3>
              <p className={styles.subtext}>
                Manage your notification preferences
              </p>
            </div>
          </div>
          <div className={styles.toggleList}>
            {[
              { title: "Visit Reminders", desc: "Upcoming appointments" },
              { title: "Message Notifications", desc: "New message alerts" },
              { title: "Summary Updates", desc: "New visit summaries" },
              { title: "Email Digest", desc: "Weekly health summary" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${styles.toggleItem} ${
                  idx > 0 ? styles.withBorder : ""
                }`}
              >
                <div>
                  <h4>{item.title}</h4>
                  <p className={styles.subtext}>{item.desc}</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked={idx < 3} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconCirclePurple}>
              <Shield size={18} />
            </div>
            <div>
              <h3 className={styles.subheader}>Privacy & Security</h3>
              <p className={styles.subtext}>Control your data and security</p>
            </div>
          </div>
          <div className={styles.linkList}>
            {[
              "Change Password",
              "Two-Factor Authentication",
              "Privacy Settings",
              "Download My Data",
            ].map((label, i) => (
              <button key={i} className={styles.linkItem}>
                <span>{label}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Billing (only for patients) */}
        {role === "patient" && (
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircleGreen}>
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className={styles.subheader}>Billing & Subscription</h3>
                <p className={styles.subtext}>Manage your payment methods</p>
              </div>
            </div>
            <div className={styles.linkList}>
              {["Payment Methods", "Billing History", "Subscription Plan"].map(
                (label, i) => (
                  <button key={i} className={styles.linkItem}>
                    <span>{label}</span>
                    <ChevronRight size={16} />
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* About */}
        <div className={styles.card}>
          <div className={styles.linkList}>
            {[
              "Help Center",
              "Terms of Service",
              "Privacy Policy",
              "About RemiMinder",
            ].map((label, i) => (
              <button key={i} className={styles.linkItem}>
                <span>{label}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className={`${styles.card} ${styles.logoutCard}`}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} className={styles.logoutIcon} />
            Log Out
          </button>
        </div>

        <div className={styles.versionText}>Version 1.0.0 • HIPAA Compliant</div>
      </div>
    </div>
  );
}
