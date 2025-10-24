import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pill,
  ClipboardCheck,
  CalendarDays,
  CheckCircle2,
  Clock4,
  XCircle,
  BellRing,
} from "lucide-react";
import styles from "./PatientReminders.module.css";

export default function PatientReminders() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const reminders = [
    {
      id: 1,
      type: "Medication",
      title: "Take Metoprolol (50mg)",
      time: "8:00 PM",
      status: "upcoming",
      persona: "Elderly Patient",
    },
    {
      id: 2,
      type: "Task",
      title: "Check blood pressure",
      time: "8:15 PM",
      status: "active",
      persona: "Elderly Patient",
    },
    {
      id: 3,
      type: "Appointment",
      title: "Doctor Visit: Dr. Kim (Cardiology)",
      time: "10:30 AM",
      status: "past",
      outcome: "completed",
      persona: "Caregiver",
    },
    {
      id: 4,
      type: "Medication",
      title: "Take Atorvastatin (20mg)",
      time: "7:30 AM",
      status: "past",
      outcome: "snoozed",
      persona: "Caregiver",
    },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case "Medication":
        return (
          <div className={styles.iconCirclePurple}>
            <Pill size={18} />
          </div>
        );
      case "Task":
        return (
          <div className={styles.iconCircleBlue}>
            <ClipboardCheck size={18} />
          </div>
        );
      case "Appointment":
        return (
          <div className={styles.iconCircleGreen}>
            <CalendarDays size={18} />
          </div>
        );
      default:
        return (
          <div className={styles.iconCirclePurple}>
            <BellRing size={18} />
          </div>
        );
    }
  };

  const renderStatus = (reminder) => {
    const outcome = reminder.outcome || reminder.status;
    switch (outcome) {
      case "completed":
        return (
          <span className={styles.statusCompleted}>
            <CheckCircle2 size={16} /> Completed
          </span>
        );
      case "snoozed":
        return (
          <span className={styles.statusSnoozed}>
            <Clock4 size={16} /> Snoozed
          </span>
        );
      case "missed":
      case "skipped":
        return (
          <span className={styles.statusMissed}>
            <XCircle size={16} /> Skipped
          </span>
        );
      case "active":
        return (
          <span className={styles.statusActive}>
            <BellRing size={16} /> Due Now
          </span>
        );
      case "upcoming":
        return (
          <span className={styles.statusUpcoming}>
            <Clock4 size={16} /> Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const sections = {
    Active: reminders.filter((r) => r.status === "active"),
    Upcoming: reminders.filter((r) => r.status === "upcoming"),
    Past: reminders.filter((r) => r.status === "past"),
  };

  return (
    <div className={`${styles.container} ${styles.purpleGradient}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={goBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.headerTitle}>Reminders</h1>
            <p className={styles.headerSubtitle}>
              View and track your upcoming medications, tasks, and appointments.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={styles.content}>
        {Object.entries(sections).map(([label, group]) => (
          <div key={label} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{label}</h2>
            </div>
            {group.length === 0 ? (
              <p className={styles.subtext}>No {label.toLowerCase()} reminders.</p>
            ) : (
              <div className={styles.reminderList}>
                {group.map((reminder) => (
                  <div key={reminder.id} className={styles.reminderItem}>
                    <div className={styles.reminderHeader}>
                      {renderIcon(reminder.type)}
                      <div>
                        <h3>{reminder.title}</h3>
                        <p className={styles.personaTag}>{reminder.type} Reminder</p>
                      </div>
                    </div>
                    <div className={styles.reminderMeta}>
                        <span className={styles.time}>{reminder.time}</span>
                        {renderStatus(reminder)}

                        {reminder.status === "active" && (
                            <div className={styles.reminderActions}>
                            <button className={styles.snoozeButton}>Snooze</button>
                            <button className={styles.stopButton}>Stop</button>
                            </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
