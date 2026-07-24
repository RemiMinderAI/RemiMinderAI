import React from "react";
import { Users, MessagesSquare } from "lucide-react";
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
            <p className={styles.audienceLabel}>For Families</p>
            <h3 className={styles.audienceHeading}>
              Being there for someone doesn&apos;t always mean being in the room.
            </h3>
            <p className={styles.audienceBody}>
              Whether you&apos;re helping an aging parent, supporting a spouse, or coordinating care
              from another city, RemiMinderAI keeps everyone informed with one shared
              understanding of the care plan.
            </p>
          </div>
          <div className={styles.audienceDivider} aria-hidden="true" />
          <div className={styles.audienceCol} data-audience="conversations">
            <div className={styles.audienceIconGold} aria-hidden="true">
              <MessagesSquare size={26} strokeWidth={1.8} />
            </div>
            <p className={styles.audienceLabel}>For Healthcare Conversations</p>
            <h3 className={styles.audienceHeading}>
              Every appointment contains important decisions.
            </h3>
            <p className={styles.audienceBody}>
              RemiMinderAI helps preserve those conversations so patients and families can
              revisit instructions, medications, and follow-up plans whenever they need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatRemiMinderIsSection;
