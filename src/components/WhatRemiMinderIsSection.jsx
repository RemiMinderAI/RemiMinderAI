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

        <div className={styles.audienceCard} role="region" aria-label="Who RemiMinderAI is for">
          <div className={styles.audienceCol} data-audience="families">
            <div className={styles.audienceIconTeal} aria-hidden="true">
              <Users size={26} strokeWidth={1.8} />
            </div>
            <p className={styles.audienceLabel}>For family caregivers</p>
            <h3 className={styles.audienceHeading}>
              Being there for someone doesn&apos;t always mean being in the room.
            </h3>
            <p className={styles.audienceBody}>
              Whether you&apos;re helping an aging parent, supporting a spouse, or
              coordinating care from another city, RemiMinderAI keeps everyone
              informed with one shared understanding of the care plan.
            </p>
          </div>
          <div className={styles.audienceDivider} aria-hidden="true" />
          <div className={styles.audienceCol} data-audience="conversations">
            <div className={styles.audienceIconGold} aria-hidden="true">
              <MessagesSquare size={26} strokeWidth={1.8} />
            </div>
            <p className={styles.audienceLabel}>For healthcare conversations</p>
            <h3 className={styles.audienceHeading}>
              Every appointment contains important decisions.
            </h3>
            <p className={styles.audienceBody}>
              RemiMinderAI helps preserve those conversations so patients and
              families can revisit instructions, medications, and follow-up plans
              whenever they need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatRemiMinderIsSection;
