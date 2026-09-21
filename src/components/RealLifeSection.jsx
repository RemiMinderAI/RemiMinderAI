import React from "react";
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
    src: "/images/record-visit.jpg",
    alt: "Record Visit screen with consent checkboxes and a microphone button",
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
    src: "/images/visit-care-plan.jpg",
    alt: "Visit details with conditions discussed, medication, and next to do",
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
    src: "/images/reminders-list.png",
    alt: "Reminders for Atorvastatin, Metoprolol, physical therapy, and an imaging CT scan",
    imageSide: "right",
  },
];

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
              <div className={styles.phone}>
                <img src={moment.src} alt={moment.alt} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
