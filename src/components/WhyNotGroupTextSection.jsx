import React from "react";
import styles from "./WhyNotGroupTextSection.module.css";

const QUESTIONS = [
  "What did the doctor actually say?",
  "Did she take her morning pills?",
  "When's the next appointment?",
  "What about the prescription label?",
  "Can Mom use it herself?",
  "What if your family speaks Hindi or Spanish?",
];

const COLUMNS = [
  {
    title: "Family chat",
    featured: false,
    answers: [
      "Recap from whoever was in the room, half-remembered",
      "Whoever texts back first guesses",
      "Buried 200 messages back",
      "Someone snaps a blurry photo",
      "Family chats can overwhelm her",
      "Everyone struggles in English",
    ],
  },
  {
    title: "Shared spreadsheet",
    featured: false,
    answers: [
      "Notes from whoever drove that day",
      "Spreadsheet — if anyone remembered to update it",
      "On a tab no one opens",
      "Manually typed, often wrong",
      "Spreadsheets need a laptop",
      "English-only columns",
    ],
  },
  {
    title: "RemiMinderAI",
    featured: true,
    answers: [
      "Recorded and AI-summarized, word for word",
      "Set a voice reminder once, she gets notified on time",
      "Set it as a reminder — she won't miss it",
      "OCR scans it, stores it clearly",
      "Big buttons, voice input, works on her phone",
      "Summaries in 10 languages",
    ],
  },
];

export default function WhyNotGroupTextSection() {
  return (
    <section
      className={styles.section}
      id="why-not-group-text"
      aria-labelledby="why-not-heading"
    >
      <div className={styles.panel}>
        <div className={styles.intro}>
          <h2 id="why-not-heading" className={styles.title}>
            The tools you&apos;re already using weren&apos;t built for this.
          </h2>
          <p className={styles.subtitle}>
            Family chats, shared notes, and spreadsheets get you halfway.
            Here&apos;s where they stop.
          </p>
        </div>

        <div className={styles.compare}>
          <div className={styles.columns}>
            {COLUMNS.map((column) => (
              <h3 key={column.title} className={column.featured ? styles.featuredLabel : ""}>
                {column.title}
              </h3>
            ))}
          </div>

          <div className={styles.rows}>
            {QUESTIONS.map((question, index) => (
              <article key={question} className={styles.row}>
                <h4>{question}</h4>
                {COLUMNS.map((column) => (
                  <p
                    key={column.title}
                    className={column.featured ? styles.remi : styles.plain}
                  >
                    <span className={styles.toolLabel}>{column.title}</span>
                    {column.answers[index]}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
