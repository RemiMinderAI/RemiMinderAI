// PatientReminders.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  Activity,
  Pill,
  Link as LinkIcon,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // make sure this path is correct
import styles from "./PatientReminders.module.css";
import CreateReminderModal from "./PatientReminderModal";
import API_BASE_URL from '../config';

export default function PatientReminders() {
  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Data (match backend ReminderListResponse)
  const [overview, setOverview] = useState({
    total: 0,
    active_today: 0,
    upcoming: 0,
    past: 0,
  });
  const [now, setNow] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  // helper to get auth header
  async function getAuthHeaders() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (err) {
      console.warn("Could not get supabase session:", err);
      return {};
    }
  }

  // fetch reminders from backend
  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const headers = await getAuthHeaders();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Cannot fetch reminders: user not authenticated");
  
      const url = new URL(`${API_BASE_URL}/api/reminders`);
      url.searchParams.set("user_id", userId);
  
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json", ...headers },
      });
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch reminders: ${res.status} ${text}`);
      }
  
      const data = await res.json();
      console.debug("fetchReminders - server response:", data);
  
      const allReminders = [
        ...(data.today || []),
        ...(data.upcoming || []),
        ...(data.past || []),
      ];
  
      const nowDt = new Date();
      const nowList = [];
      const upcomingList = [];
      const pastList = [];
  
      const seenIds = new Set();
  
      allReminders.forEach((rem) => {
        if (seenIds.has(rem.id)) return;
        seenIds.add(rem.id);
  
        let status = (rem.status || "").toLowerCase();
        const scheduled = rem.scheduled_time ? new Date(rem.scheduled_time) : null;

        // 🔥 Rewrite the reminder’s status BEFORE classification
        if (scheduled && scheduled <= nowDt && !["completed", "skipped", "failed"].includes(status)) {
          rem.status = "active";
          status = "active";
        }
  
        // Past = completed/skipped/failed OR scheduled before now and not active
        if (
          ["completed", "skipped", "failed"].includes(status) ||
          (scheduled && scheduled < nowDt && status !== "active" && status !== "snoozed")
        ) {
          pastList.push(rem);
          return;
        }
  
        // Now = active or snoozed
        if ((status === "active" || status === "snoozed") && scheduled && scheduled <= nowDt) {
          nowList.push(rem);
          return;
        }
  
        // Otherwise upcoming
        upcomingList.push(rem);
      });
  
      // Sort by scheduled time
      const sortByTime = (a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time);
      nowList.sort(sortByTime);
      upcomingList.sort(sortByTime);
      pastList.sort(sortByTime);
  
      setNow(nowList);
      setUpcoming(upcomingList);
      setPast(pastList);
  
      setOverview({
        total: nowList.length + upcomingList.length + pastList.length,
        active_today: nowList.length,
        upcoming: upcomingList.length,
        past: pastList.length,
      });
    } catch (err) {
      console.error("fetchReminders error:", err);
      setError(err.message || String(err));
      setNow([]);
      setUpcoming([]);
      setPast([]);
      setOverview({ total: 0, active_today: 0, upcoming: 0, past: 0 });
    } finally {
      setLoading(false);
    }
  };  
  
  useEffect(() => {
    fetchReminders();
    // optionally refresh every minute to reflect server-side changes
    const q = setInterval(fetchReminders, 60 * 1000);
    return () => clearInterval(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create -> POST /api/reminders
  const createReminder = async (formData) => {
    setLoading(true);
    setError(null);
  
    try {
      const headers = await getAuthHeaders();
  
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
  
      if (!userId) throw new Error("User not authenticated");
  
      // ------------------------------------------
      // 1. Build scheduled_time (priority order):
      //    A) formData.scheduledTime (ISO from modal)
      //    B) formData.scheduledDate + scheduledTime text
      // ------------------------------------------
  
      let scheduledDateTime = null;
  
      //
      // A) Modal already passed scheduledTime as an ISO string
      //
      if (formData.scheduledTime && formData.scheduledTime.includes("T")) {
        scheduledDateTime = formData.scheduledTime;
      }
  
      //
      // B) If modal didn’t send ISO — build it manually
      //
      else if (formData.scheduledDate && formData.scheduledTime) {
        let hour = 0;
        let minute = 0;
  
        // Handle “2:00 PM”
        if (/AM|PM/i.test(formData.scheduledTime)) {
          const match = formData.scheduledTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (!match) throw new Error("Invalid time format");
  
          const [h, m, ampm] = match.slice(1);
  
          hour = Number(h);
          minute = Number(m);
  
          if (ampm.toUpperCase() === "PM" && hour < 12) hour += 12;
          if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
        } 
        // Handle “14:00”
        else {
          [hour, minute] = formData.scheduledTime.split(":").map(Number);
        }
  
        const [year, month, day] = formData.scheduledDate.split("-").map(Number);
  
        const localDT = new Date(year, month - 1, day, hour, minute);
        scheduledDateTime = localDT.toISOString();
      }
  
      //
      // C) Absolute fallback (should never happen, but safe)
      //
      else {
        scheduledDateTime = new Date().toISOString();
      }
  
      // ------------------------------------------
      // Build payload
      // ------------------------------------------
  
      const payload = {
        user_id: userId,
        reminder_type: (formData.reminderType || "Other").toLowerCase(),
        title: formData.title,
        scheduled_time: scheduledDateTime,   // <-- final fixed value
        timezone:
          formData.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        recurrence: (formData.frequency || "once").toLowerCase(),
        context_data: { notes: formData.notes || "" },
      };
  
      // ------------------------------------------
      // Submit to backend
      // ------------------------------------------
  
      const res = await fetch(`${API_BASE_URL}/api/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Create failed: ${res.status} ${txt}`);
      }
  
      await fetchReminders();
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Helper: is this reminder considered active for UI actions?
  const isEditable = (reminder) => {
    const nowDt = new Date();
    let status = (reminder.status || "").toLowerCase();
    const scheduled = reminder.scheduled_time ? new Date(reminder.scheduled_time) : null;

    // Pending but scheduled time passed → treat as active for UI
    if (status === "pending" && scheduled && scheduled <= nowDt) {
      status = "active";
    }

    // Snoozed reminders that have reached snoozeAt → active
    if (status === "snoozed" && reminder.snoozeAt) {
      const snoozeTime = new Date(reminder.snoozeAt);
      if (snoozeTime <= nowDt) {
        status = "active";
      }
    }

    return status === "active";
  };

  // Snooze -> POST /api/reminders/{id}/snooze?snooze_minutes=30
const snoozeReminder = async (id, minutes = 30) => {
  setLoading(true);
  setError(null);

  try {
    const headers = await getAuthHeaders();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) throw new Error("User not authenticated");

    const url = new URL(`${API_BASE_URL}/api/reminders/${id}/snooze`);
    url.searchParams.set("user_id", userId);
    url.searchParams.set("snooze_minutes", String(minutes));

    // Fire and forget — don't parse JSON
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Snooze failed: ${res.status} ${txt}`);
    }

    // Refresh reminders after snooze
    await fetchReminders();
  } catch (err) {
    console.error(err);
    setError(err.message || String(err));
  } finally {
    setLoading(false);
  }
};

  // Complete -> POST /api/reminders/{id}/complete
  const completeReminder = async (id, notes = "") => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const url = new URL(`${API_BASE_URL}/api/reminders/${id}/complete`);
      if (userId) url.searchParams.set("user_id", userId);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ notes }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Complete failed: ${res.status} ${txt}`);
      }
      await fetchReminders();
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Delete -> DELETE /api/reminders/{id}
  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const url = new URL(`${API_BASE_URL}/api/reminders/${id}`);
      if (userId) url.searchParams.set("user_id", userId);

      const res = await fetch(url.toString(), {
        method: "DELETE",
        headers: { ...headers },
      });

      if (res.status !== 204 && !res.ok) {
        const txt = await res.text();
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }
      await fetchReminders();
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const getIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "appointment":
        return <Calendar size={18} className={styles.iconAppointment} />;
      case "exercise":
        return <Activity size={18} className={styles.iconExercise} />;
      case "medication":
        return <Pill size={18} className={styles.iconMedication} />;
      case "lab":
        return <FileText size={18} className={styles.iconLab} />;
      default:
        return <LinkIcon size={18} className={styles.iconDisabled} />;
    }
  };

  const getTagColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "appointment":
        return styles.tagPurple;
      case "exercise":
        return styles.tagGreen;
      case "medication":
        return styles.tagBlue;
      case "lab":
        return styles.tagOrange;
      default:
        return styles.tagGray;
    }
  };

  // Render helpers
  const renderSection = (label, items) => (
    <div key={label} className={styles.sectionGroup}>
      <h2 className={styles.sectionTitle}>{label}</h2>
      {items.length === 0 ? (
        <p className={styles.sectionEmpty}>No {label.toLowerCase()} reminders.</p>
      ) : (
        items.map((reminder) => (
          <div
            key={reminder.id}
            className={`${styles.reminderCard} ${
              (reminder.status || "").toLowerCase() === "completed" ? styles.disabledCard : ""
            }`}
          >
            <div className={styles.reminderIcon}>{getIcon(reminder.reminder_type || reminder.reminder_type || reminder.type)}</div>

            <div className={styles.reminderContent}>
              <div className={styles.reminderHeader}>
                <div className={styles.titleTag}>
                  <span className={styles.reminderTitle}>{reminder.title}</span>
                  <span className={`${styles.reminderTag} ${getTagColor(reminder.reminder_type || reminder.type)}`}>
                    {reminder.reminder_type ? reminder.reminder_type.charAt(0).toUpperCase() + reminder.reminder_type.slice(1) : reminder.type}
                  </span>
                </div>

                <div className={styles.reminderActions}>
                  {isEditable(reminder) && (
                    <>
                      <button
                        className={styles.snoozeButton}
                        onClick={() => snoozeReminder(reminder.id, 30)}
                      >
                        Snooze
                      </button>
                      <button
                        className={styles.completeButton}
                        onClick={() => completeReminder(reminder.id)}
                      >
                        Mark Completed
                      </button>
                    </>
                  )}
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Additional info below */}
              <p className={styles.reminderDetails}>
                {(() => {
                  try {
                    const dt = reminder.scheduled_time ? new Date(reminder.scheduled_time) : null;

                    if (!dt) return "";

                    const dateStr = dt.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    });

                    const timeStr = dt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return `${dateStr} • ${timeStr}${
                      reminder.recurrence ? ` • ${reminder.recurrence}` : ""
                    }`;
                  } catch {
                    return "";
                  }
                })()}
              </p>

              {reminder.message || reminder.details ? (
                <p className={styles.reminderDetails}>{reminder.message || reminder.details}</p>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={() => navigate("/dashboard/patient")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.headerTitle}>Reminders</h1>
            <p className={styles.headerSubtitle}>Manage your health reminders and notifications</p>
          </div>
        </div>

        <button className={styles.newReminderButton} onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> New Reminder
        </button>
      </header>

      {/* Overview */}
      <section className={styles.overviewSection}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <p className={styles.sectionSubtitle}>Quick snapshot of your reminders</p>
        <div className={styles.overviewBox}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{overview.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{overview.active_today}</span>
            <span className={styles.statLabel}>Now</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{overview.upcoming}</span>
            <span className={styles.statLabel}>Upcoming</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{overview.past}</span>
            <span className={styles.statLabel}>Past</span>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className={styles.remindersSection}>
        {loading && <p className={styles.sectionEmpty}>Loading reminders…</p>}
        {error && <p className={styles.sectionEmpty} style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            {renderSection("Now", now)}
            {renderSection("Upcoming", upcoming)}
            {renderSection("Past", past)}
          </>
        )}
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateReminderModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (formData) => {
            // createReminder expects scheduled_time field; modal currently returns time/frequency etc.
            // For now we try to build scheduled_time from time (today) — backend may adjust using timezone.
            // Set status to pending by default server-side.
            const scheduledTime = (() => {
              try {
                // if modal passed scheduledTime directly, use it
                if (formData.scheduledTime) return formData.scheduledTime;
                // else create ISO from chosen time today
                if (formData.time) {
                  const [hh, mm] = formData.time.split(":").map(Number);
                  const d = new Date();
                  d.setHours(hh, mm, 0, 0);
                  return d.toISOString();
                }
              } catch (e) {
                return new Date().toISOString();
              }
              return new Date().toISOString();
            })();

            await createReminder({
              ...formData,
              scheduledTime,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });

            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
