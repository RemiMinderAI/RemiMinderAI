import React from "react";
import styles from "./HeroPhoneStage.module.css";

const PHONES = [
  {
    className: "phoneLeft",
    src: "/images/hero-patient-overview.jpg",
    alt: "RemiMinderAI patient overview with medication reminders and upcoming checkup",
    caption: "Patient Overview",
    width: 390,
    height: 844,
  },
  {
    className: "phoneRight",
    src: "/images/hero-visit-details.png",
    alt: "RemiMinderAI visit details with AI visit summary, medications, and next steps",
    caption: "Visit Summary",
    width: 390,
    height: 844,
  },
  {
    className: "phoneFront",
    src: "/images/hero-home-dashboard.jpg",
    alt: "RemiMinderAI home dashboard with today's schedule, tasks, and care progress",
    caption: "Home dashboard",
    width: 390,
    height: 844,
  },
];

const HeroPhoneStage = () => {
  return (
    <div className={styles.stage} aria-hidden="false">
      <div className={styles.ambient} aria-hidden="true" />
      {PHONES.map((phone) => (
        <figure
          key={phone.caption}
          className={`${styles.phone} ${styles[phone.className]}`}
        >
          <div className={styles.bezel}>
            <img
              className={styles.shot}
              src={phone.src}
              alt={phone.alt}
              width={phone.width}
              height={phone.height}
              loading="eager"
              decoding="async"
            />
            <span className={styles.caption}>{phone.caption}</span>
          </div>
        </figure>
      ))}
    </div>
  );
};

export default HeroPhoneStage;
