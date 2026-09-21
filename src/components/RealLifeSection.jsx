import React from "react";
import styles from "./RealLifeSection.module.css";

const MOMENTS = [
  {
    kicker: "9:45 AM. Monday. San Jose, CA.",
    body: "Your mom walks into Dr. Patel's office right on time. She opens RemiMinderAI and taps Record. For the next 40 minutes, the doctor talks about her bloodwork, adjusts her thyroid medication, and recommends a follow-up in six weeks. Your mom nods along. She doesn't take notes. She doesn't have to.",
    visual: "record",
    imageSide: "right",
  },
  {
    kicker: "10:32 AM. You're at work.",
    body: "You open RemiMinderAI and the summary is right there — the medication change, the follow-up date, the doctor's exact recommendations. Clear and simple, in English. You didn't have to call. You didn't have to guess. You know.",
    visual: "summary",
    imageSide: "left",
  },
  {
    kicker: "Thursday, 8:00 PM. Back in San Jose.",
    body: "Your mom forgets her evening dose. She's done it before. But tonight, RemiMinderAI reminds her — because you set it up, once, by voice.",
    visual: "reminders",
    imageSide: "right",
  },
];

function Phone({ children, label }) {
  return (
    <div className={styles.phone} role="img" aria-label={label}>
      <div className={styles.bezel}>{children}</div>
    </div>
  );
}

function RecordPhone() {
  return (
    <Phone label="RemiMinderAI recording a doctor visit, with the timer running and a stop control">
      <div className={styles.recordScreen} aria-hidden="true">
        <div className={styles.recordCard}>
          <p className={styles.recordTime}>12:34</p>
          <p className={styles.recordStatus}>Recording</p>
        </div>
        <span className={styles.stopButton} aria-hidden="true" />
        <p className={styles.recordHint}>Tap to stop</p>
      </div>
    </Phone>
  );
}

function ScreenshotPhone({ src, alt }) {
  return (
    <Phone label={alt}>
      <img className={styles.shot} src={src} alt="" />
    </Phone>
  );
}

export default function RealLifeSection() {
  return (
    <section className={styles.section} id="real-life" aria-labelledby="real-life-heading">
      <div className={styles.inner}>
        <h2 id="real-life-heading" className={styles.title}>
          What it looks like in real life.
        </h2>
        <div className={styles.moments}>
          {MOMENTS.map((moment) => {
            const visual =
              moment.visual === "record" ? (
                <RecordPhone />
              ) : moment.visual === "summary" ? (
                <ScreenshotPhone
                  src="/images/visit-care-plan.jpg"
                  alt="Visit summary with conditions discussed, medication, and next to do"
                />
              ) : (
                <ScreenshotPhone
                  src="/images/reminders-list.png"
                  alt="Reminders for Atorvastatin, Metoprolol, physical therapy, and an imaging CT scan"
                />
              );

            return (
              <article
                key={moment.kicker}
                className={`${styles.moment} ${
                  moment.imageSide === "left" ? styles.imageLeft : ""
                }`}
              >
                <div className={styles.copy}>
                  <p className={styles.kicker}>{moment.kicker}</p>
                  <p className={styles.body}>{moment.body}</p>
                </div>
                {visual}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
