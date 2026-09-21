import React from "react";
import styles from "./RealLifeSection.module.css";

const SCENES = [
  {
    kicker: "9:45 AM, Monday. San Jose, CA.",
    paragraphs: [
      "Your mom walks into Dr. Patel's office right on time. She opens RemiMinderAI and taps Record.",
      "For the next 40 minutes, the doctor talks about her bloodwork, adjusts her thyroid medication, and recommends a follow-up in six weeks.",
      "Your mom nods along. She doesn't take notes. She doesn't have to.",
    ],
  },
  {
    kicker: "10:32 AM.",
    paragraphs: [
      "You're at work. You open RemiMinderAI and the summary is right there — the medication change, the follow-up date, the doctor's exact recommendations. Clear and simple, in English.",
      "You exhale. You didn't have to call. You didn't have to guess. You know.",
    ],
  },
  {
    kicker: "In Delhi, a son finally gets the full picture.",
    paragraphs: [
      "Anish lives in Chicago. His father sees his cardiologist alone in Delhi and always says the visit went “fine.”",
      "This time, his father used RemiMinderAI to record the conversation. Anish opens the app and reads the summary. The doctor increased his father's dosage and ordered a blood test in two weeks. His father hadn't mentioned any of it.",
      "Now Anish knows what “fine” really means.",
    ],
  },
  {
    kicker: "In Zurich, a grandson worries less.",
    paragraphs: [
      "Markus lives in Berlin. His grandmother sees her doctor in Zurich. After her appointment, Markus opens RemiMinderAI and reads the visit summary. The doctor recommended physical therapy and flagged a bone density concern.",
      "He calls that evening — not to hover, just to help.",
    ],
  },
  {
    kicker: "In Lisbon, a daughter stays informed.",
    paragraphs: [
      "Sofia moved to London three years ago. Her father manages his diabetes alone in Lisbon. After his appointment, Sofia checks RemiMinderAI. The doctor adjusted his insulin and flagged his A1C.",
      "She didn't have to wait for a crisis to find out.",
    ],
  },
  {
    kicker: "Thursday, 8:00 PM. Back in San Jose.",
    paragraphs: [
      "Your mom forgets her evening dose. She's done it before. But tonight, RemiMinderAI reminds her — because you set it up, once, by voice.",
    ],
  },
];

export default function RealLifeSection() {
  return (
    <section
      className={styles.section}
      id="real-life"
      aria-labelledby="real-life-heading"
    >
      <div className={styles.inner}>
        <h2 id="real-life-heading" className={styles.title}>
          What it looks like in real life.
        </h2>

        <div className={styles.scenes}>
          {SCENES.map((scene) => (
            <article key={scene.kicker} className={styles.scene}>
              <p className={styles.kicker}>{scene.kicker}</p>
              {scene.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.body}>
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>

        <div className={styles.close}>
          <p className={styles.closeLine}>
            Caregiving doesn&apos;t stop at borders. Neither does RemiMinderAI.
          </p>
          <p className={styles.languages}>
            Summaries default in English. Need them in Hindi, Bengali, Spanish,
            German, Portuguese, or any of 10 supported languages? Just change
            the setting.
          </p>
        </div>
      </div>
    </section>
  );
}
