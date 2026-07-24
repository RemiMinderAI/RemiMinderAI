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
          Healthcare technology is often built for clinicians and healthcare systems.
        </p>
        <p className={styles.leadContrast}>
          RemiMinderAI is built for patients, caregivers, and families.
        </p>

        <div className={styles.punchlineBlock}>
          <div className={styles.goldBar} aria-hidden="true" />
          <p className={styles.supporting}>
            After every appointment, important details can be forgotten, instructions become
            confusing, and loved ones are left trying to piece everything together.
          </p>
          <p className={styles.punchline}>
            RemiMinderAI helps families understand what happened, organize what comes next, and
            stay connected throughout the care journey.
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
            <p className={styles.audienceLabel}>To share with your doctor</p>
            <h3 className={styles.audienceHeading}>
              A clear record of what your doctor said.
            </h3>
            <p className={styles.audienceBody}>
              No extra work during the visit. A clear record of what was discussed, ready to share with family or your doctor's office if needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatRemiMinderIsSection;
