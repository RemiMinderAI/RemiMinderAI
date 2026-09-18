import React from "react";
import { Bell, FileText, Mic, ScanLine, Share2 } from "lucide-react";
import styles from "./ProductWorkflow.module.css";

const STEPS = [
  {
    number: "01",
    icon: Mic,
    title: "Record the conversation",
    body: "Capture the doctor visit so medications, instructions, and follow-ups are never left to memory.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Get an AI summary",
    body: "Turn the recording into a clear visit summary, conditions discussed, and next steps.",
  },
  {
    number: "03",
    icon: ScanLine,
    title: "Scan documents",
    body: "Snap lab results and paperwork into the same care record — no more lost printouts.",
  },
  {
    number: "04",
    icon: Bell,
    title: "Set reminders by voice",
    body: "Say it once with RemiVox: “Remind me to take my medication at 8 PM.”",
  },
  {
    number: "05",
    icon: Share2,
    title: "Share with family in real time",
    body: "Keep caregivers aligned on the plan, even if they weren’t in the exam room.",
  },
];

export default function ProductWorkflow() {
  return (
    <section
      id="how-it-works"
      className={styles.section}
      aria-labelledby="workflow-heading"
    >
      <div className={styles.inner}>
        <p className={styles.label}>What you can do in the app</p>
        <h2 id="workflow-heading" className={styles.title}>
          One visit. A shared plan the whole family can follow.
        </h2>
        <p className={styles.subtitle}>
          RemiMinderAI walks you from the appointment to action — record,
          summarize, scan, remind, and share.
        </p>

        <ol className={styles.flow}>
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className={styles.step}>
                <div className={styles.iconWrap} aria-hidden="true">
                  <Icon size={22} strokeWidth={2.1} />
                </div>
                <p className={styles.number}>{step.number}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
                {index < STEPS.length - 1 ? (
                  <span className={styles.connector} aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
