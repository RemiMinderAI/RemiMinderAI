import React from "react";
import { Users, Stethoscope } from "lucide-react";
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
        <h2 className={styles.eyebrow} id="what-rmia-heading">
          What RemiMinderAI Is
        </h2>
        <p className={styles.lead}>
          RemiMinderAI records doctor visits and turns them into shareable, searchable
          summaries, so families remember what was said a month ago, and doctors have a
          record of what they actually told the patient.
        </p>
        <div className={styles.punchlineBlock}>
          <div className={styles.goldBar} aria-hidden="true" />
          <p className={styles.punchline}>
            No appointments. No pharmacy. Just the conversation, captured and understood.
          </p>
        </div>
        <div className={styles.audienceCard} role="region" aria-label="Who RemiMinderAI is for">
          <div className={styles.audienceCol} data-audience="families">
            <div className={styles.audienceIconTeal} aria-hidden="true">
              <Users size={26} strokeWidth={1.8} />
            </div>
            <p className={styles.audienceLabel}>For families</p>
            <h3 className={styles.audienceHeading}>Never forget what the doctor said.</h3>
            <p className={styles.audienceBody}>
              Share clear summaries, medications, and next steps with everyone helping care
              for your loved one. One record, one source of truth, accessible weeks or
              months later.
            </p>
          </div>
          <div className={styles.audienceDivider} aria-hidden="true" />
          <div className={styles.audienceCol} data-audience="doctors">
            <div className={styles.audienceIconGold} aria-hidden="true">
              <Stethoscope size={26} strokeWidth={1.8} />
            </div>
            <p className={styles.audienceLabel}>For doctors</p>
            <h3 className={styles.audienceHeading}>
              Keep an accurate record of what you actually said.
            </h3>
            <p className={styles.audienceBody}>
              No manual notes. No workflow change. Just speak, and we handle the rest.
              Prescriptions scan cleanly, and you have verified documentation of every
              care instruction given.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatRemiMinderIsSection;
