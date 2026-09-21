import React from "react";
import styles from "./WhyNotGroupTextSection.module.css";

const COLUMNS = ["Group texts", "Shared spreadsheet", "RemiMinderAI"];

const ROWS = [
  {
    question: "What did the doctor actually say?",
    answers: [
      "Recap from one sibling, half-remembered",
      "Notes from whoever drove that day",
      "Recorded and AI-summarized, word for word",
    ],
  },
  {
    question: "Did she take her morning pills?",
    answers: [
      "Whoever texts back first guesses",
      "Spreadsheet — if anyone remembered to update it",
      "Set a voice reminder once, she gets notified on time",
    ],
  },
  {
    question: "When's the next appointment?",
    answers: [
      "Buried 200 messages back",
      "On a tab no one opens",
      "Set it as a reminder — she won't miss it",
    ],
  },
  {
    question: "What about the prescription label?",
    answers: [
      "Someone snaps a blurry photo",
      "Manually typed, often wrong",
      "OCR scans it, stores it clearly",
    ],
  },
  {
    question: "Can Mom use it herself?",
    answers: [
      "Group texts can overwhelm her",
      "Spreadsheets need a laptop",
      "Big buttons, voice input, works on her phone",
    ],
  },
  {
    question: "What if your family speaks Hindi or Spanish?",
    answers: [
      "Everyone struggles in English",
      "English-only columns",
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
      <div className={styles.inner}>
        <h2 id="why-not-heading" className={styles.title}>
          Why not just a group text?
        </h2>
        <p className={styles.subtitle}>
          We tried the group-text route too. Here&apos;s what it kept missing.
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.caption}>
              How RemiMinderAI compares to group texts and shared spreadsheets
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.corner}>
                  <span className={styles.srOnly}>Question</span>
                </th>
                {COLUMNS.map((column, index) => (
                  <th
                    key={column}
                    scope="col"
                    className={
                      index === COLUMNS.length - 1
                        ? styles.oursHead
                        : styles.colHead
                    }
                  >
                    {index === COLUMNS.length - 1 ? (
                      column
                    ) : (
                      <span className={styles.colTag}>{column}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.question}>
                  <th scope="row" className={styles.question}>
                    {row.question}
                  </th>
                  {row.answers.map((answer, index) => (
                    <td
                      key={`${row.question}-${COLUMNS[index]}`}
                      data-label={COLUMNS[index]}
                      className={
                        index === COLUMNS.length - 1
                          ? styles.oursCell
                          : styles.cell
                      }
                    >
                      {answer}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a className={styles.cta} href="#get-started">
          Try it free — no credit card needed
        </a>
      </div>
    </section>
  );
}
