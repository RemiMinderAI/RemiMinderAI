import React from "react";
import styles from "./HeroPhoneStage.module.css";
import heroFront from "../assets/hero-phone-front.png";
import heroBackLeft from "../assets/hero-phone-back-left.png";
import heroBackRight from "../assets/hero-phone-back-right.png";

function PhoneFrame({ src, className, alt, ariaHidden }) {
  return (
    <div
      className={`${styles.phone} ${className || ""}`}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      <div className={styles.phoneBezel}>
        <div className={styles.phoneNotch} aria-hidden="true" />
        <div className={styles.phoneScreen}>
          <img
            className={styles.phoneImg}
            src={src}
            alt={ariaHidden ? "" : alt}
            aria-hidden={ariaHidden ? "true" : undefined}
            width={280}
            height={580}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

const HeroPhoneStage = () => {
  return (
    <div className={styles.stage}>
      <div className={styles.ambientRadial} aria-hidden="true" />
      <div className={styles.ambientBlob} aria-hidden="true" />
      <div className={styles.phonesCluster}>
        <PhoneFrame
          className={styles.phoneBackLeft}
          src={heroBackLeft}
          alt=""
          ariaHidden
        />
        <PhoneFrame
          className={styles.phoneBackRight}
          src={heroBackRight}
          alt=""
          ariaHidden
        />
        <PhoneFrame
          className={styles.phoneFront}
          src={heroFront}
          alt="RemiMinderAI app summary screen showing a doctor visit summary"
        />
      </div>
      <div className={styles.floatingCallout} data-side="left" role="status">
        <span className={styles.calloutDotTeal} aria-hidden="true" />
        <span>Recording visit</span>
      </div>
      <div className={styles.floatingCallout} data-side="right" role="status">
        <span className={styles.calloutDotGold} aria-hidden="true" />
        <span>Care plan ready</span>
      </div>
    </div>
  );
};

export default HeroPhoneStage;
