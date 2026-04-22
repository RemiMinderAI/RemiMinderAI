import React from "react";
import styles from "./HeroPhoneStage.module.css";
import heroComposite from "../assets/hero-phones-composite.png";

/**
 * Single composite artwork (layered phone mockups + pills); replaces separate device frames.
 */
const HeroPhoneStage = () => {
  return (
    <div className={styles.stage}>
      <div className={styles.ambientBlob} aria-hidden="true" />
      <div className={styles.compositeWrap}>
        <img
          className={styles.compositeImg}
          src={heroComposite}
          alt="RemiMinderAI on three phone screens: visit recording, health overview, and care plan with prescriptions and appointments"
          width={1200}
          height={900}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default HeroPhoneStage;
