import React from "react";
import styles from "./WhatRemiMinderIsSection.module.css";

const WhatRemiMinderIsSection = () => {
  return (
    <section
      className={styles.section}
      id="what-remiminderai-is"
      aria-labelledby="what-rmia-heading"
    >
      <div className={styles.cornerBracket} data-pos="tl" aria-hidden="true" />
      <div className={styles.cornerBracket} data-pos="br" aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.categoryLabel}>AI healthcare companion app</p>
        <h2 className={styles.eyebrow} id="what-rmia-heading">
          What RemiMinderAI is
        </h2>

        <p className={styles.lead}>
          RemiMinderAI is an AI app that records healthcare conversations.
        </p>
        <p className={styles.leadContrast}>
          Then it summarizes the visit, files your documents, sets reminders,
          and shares the plan with family in real time.
        </p>

        <div className={styles.punchlineBlock}>
          <div className={styles.goldBar} aria-hidden="true" />
          <p className={styles.supporting}>
            After every appointment, family caregivers are left trying to remember
            medications, instructions, and follow-ups — often from another city.
          </p>
          <p className={styles.punchline}>
            Record. Summarize. Scan. Remind. Share. That is the whole workflow,
            in one place.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatRemiMinderIsSection;
