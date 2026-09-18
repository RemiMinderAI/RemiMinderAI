import React from "react";
import styles from "./HeroPhoneStage.module.css";

const PHONES = [
  {
    className: "phoneHome",
    src: "/images/hero-home-dashboard.jpg",
    alt: "RemiMinderAI home dashboard with today's schedule, tasks, and voice assistant",
    caption: "Home",
    width: 390,
    height: 844,
  },
  {
    className: "phoneVisit",
    src: "/images/hero-visit-details.png",
    alt: "RemiMinderAI visit summary with medications and next steps",
    caption: "Visit Summary",
    width: 390,
    height: 844,
  },
];

const HeroPhoneStage = () => {
  return (
    <div className={styles.stage}>
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
          </div>
          <figcaption className={styles.caption}>{phone.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
};

export default HeroPhoneStage;
