import React from "react";
import { Calendar, Check, House, LayoutGrid, List, Mic, Pill, Users, X } from "lucide-react";
import styles from "./RealLifeSection.module.css";

const MOMENTS = [
  {
    step: "Step 1",
    kicker: "9:45 AM. Monday. San Jose, CA.",
    paragraphs: [
      "Your mom walks into Dr. Patel's office right on time. She opens RemiMinderAI and taps Record.",
      "For the next 40 minutes, the doctor talks about her bloodwork, adjusts her thyroid medication, and recommends a follow-up in six weeks.",
      "Your mom nods along. She doesn't take notes. She doesn't have to.",
    ],
    visual: "record",
    imageSide: "right",
  },
  {
    step: "Step 2",
    kicker: "10:32 AM. You're at work.",
    paragraphs: [
      "You open RemiMinderAI and the summary is right there — the medication change, the follow-up date, the doctor's exact recommendations.",
      "Clear and simple, in English.",
      "You didn't have to call. You didn't have to guess. You know.",
    ],
    visual: "summary",
    imageSide: "left",
  },
  {
    step: "Step 3",
    kicker: "Thursday, 8:00 PM. Back in San Jose.",
    paragraphs: [
      "Your mom forgets her evening dose. She's done it before.",
      {
        text: "But tonight, RemiMinderAI reminds her — because you set it up, once, by voice.",
        strong: true,
      },
    ],
    visual: "reminders",
    imageSide: "right",
  },
];

const REMINDERS = [
  { icon: "pill", title: "Atorvastatin", when: "in 26 minutes", status: "Snoozed" },
  { icon: "pill", title: "Metoprolol", when: "in 26 minutes", status: "Snoozed" },
  { icon: "cal", title: "Physical therapy", when: "in 1 day", status: "Upcoming" },
  { icon: "cal", title: "Imaging CT scan", when: "in 3 days", status: "Upcoming" },
  { icon: "cal", title: "Physical therapy", when: "in 4 days", status: "Upcoming" },
];

function RecordPhone() {
  return (
    <div
      className={styles.phone}
      role="img"
      aria-label="Record Visit screen with consent checkboxes and a microphone button"
    >
      <div className={styles.recordScreen}>
        <div className={styles.recordHeader}>
          <X size={16} strokeWidth={2.4} aria-hidden="true" />
          <span>Record visit</span>
        </div>
        <p className={styles.timerCard}>00:00</p>
        <p className={styles.readyPill}>Ready to record</p>
        <div className={styles.consentCard}>
          <p className={styles.consentTitle}>Consent required</p>
          <div className={styles.consentRow}>
            <span className={styles.checkbox} aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>I consent to this conversation being recorded</span>
          </div>
          <div className={styles.consentRow}>
            <span className={styles.checkbox} aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>I understand AI will process this recording</span>
          </div>
        </div>
        <span className={styles.micButton} aria-hidden="true">
          <Mic size={22} strokeWidth={2.2} />
        </span>
        <p className={styles.micHint}>Tap to start recording</p>
      </div>
    </div>
  );
}

function SummaryPhone() {
  return (
    <div
      className={styles.phone}
      role="img"
      aria-label="Visit details with conditions discussed, medication, and next to do"
    >
      <div className={styles.visitScreen}>
        <p className={styles.visitTitle}>Visit details</p>
        <div className={styles.visitCard}>
          <p className={styles.cardLabel}>Conditions discussed</p>
          <ul>
            <li>Bilateral knee replacements</li>
            <li>Post-operative recovery</li>
            <li>Resolved arthritis</li>
          </ul>
        </div>
        <div className={styles.visitCard}>
          <div className={styles.cardHead}>
            <span className={styles.iconBadge} aria-hidden="true">
              <Pill size={14} />
            </span>
            <p className={styles.cardLabel}>Medication</p>
          </div>
          <ul>
            <li>Antibiotics (before dental procedures)</li>
          </ul>
        </div>
        <div className={styles.visitCard}>
          <div className={styles.cardHead}>
            <span className={styles.iconBadge} aria-hidden="true">
              <List size={14} />
            </span>
            <p className={styles.cardLabel}>Next to do</p>
          </div>
          <ul>
            <li>Contact office for antibiotics</li>
            <li>Avoid falling</li>
            <li>Return if new issues arise</li>
          </ul>
        </div>
        <p className={styles.visitFoot}>AI-generated summary</p>
      </div>
    </div>
  );
}

function RemindersPhone() {
  return (
    <div
      className={styles.phone}
      role="img"
      aria-label="Reminders for Atorvastatin, Metoprolol, physical therapy, and an imaging CT scan"
    >
      <div className={styles.remindersScreen}>
        <div className={styles.tabs}>
          <span>Visits</span>
          <span className={styles.tabActive}>Reminders</span>
        </div>
        <div className={styles.reminderList}>
          {REMINDERS.map((item) => (
            <div key={`${item.title}-${item.when}`} className={styles.reminderRow}>
              <span className={styles.reminderIcon} aria-hidden="true">
                {item.icon === "pill" ? <Pill size={14} /> : <Calendar size={14} />}
              </span>
              <span className={styles.reminderCopy}>
                <strong>{item.title}</strong>
                <span>{item.when}</span>
              </span>
              <span
                className={
                  item.status === "Snoozed" ? styles.statusSnoozed : styles.statusUpcoming
                }
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.tabBar} aria-hidden="true">
          <span className={styles.tabOn}>
            <House size={14} />
            Home
          </span>
          <span>
            <Users size={14} />
            Patients
          </span>
          <span>
            <LayoutGrid size={14} />
            Overview
          </span>
          <span>
            <Users size={14} />
            Care team
          </span>
        </div>
      </div>
    </div>
  );
}

const VISUALS = {
  record: <RecordPhone />,
  summary: <SummaryPhone />,
  reminders: <RemindersPhone />,
};

export default function RealLifeSection() {
  return (
    <section className={styles.section} id="real-life" aria-labelledby="real-life-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.badge}>How it works in practice</p>
          <h2 id="real-life-heading" className={styles.title}>
            From the waiting room to your phone. In minutes.
          </h2>
          <p className={styles.subline}>
            A real appointment. A real summary. A real reminder.
          </p>
        </header>
        <div className={styles.moments}>
          {MOMENTS.map((moment) => (
            <article
              key={moment.step}
              className={`${styles.moment} ${
                moment.imageSide === "left" ? styles.imageLeft : ""
              }`}
            >
              <div className={styles.copy}>
                <p className={styles.step}>{moment.step}</p>
                <p className={styles.kicker}>{moment.kicker}</p>
                <div className={styles.body}>
                  {moment.paragraphs.map((paragraph) => {
                    const text = typeof paragraph === "string" ? paragraph : paragraph.text;
                    const strong = typeof paragraph === "object" && paragraph.strong;
                    return strong ? (
                      <p key={text}>
                        <strong>{text}</strong>
                      </p>
                    ) : (
                      <p key={text}>{text}</p>
                    );
                  })}
                </div>
              </div>
              {VISUALS[moment.visual]}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
