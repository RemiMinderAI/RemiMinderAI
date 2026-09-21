import React from "react";
import styles from "./AnyLanguageSection.module.css";

const PHONES = [
  {
    src: "/images/summary-spanish.jpg",
    alt: "Spanish visit summary titled Visita Médica, with allergies and a lab follow-up",
    label: "Español",
  },
  {
    src: "/images/summary-hindi.png",
    alt: "Hindi visit details showing conditions discussed, medication, and next steps",
    label: "हिन्दी",
  },
];

export default function AnyLanguageSection() {
  return (
    <section className={styles.section} aria-labelledby="any-language-heading">
      <div className={styles.inner}>
        <p className={styles.badge}>Multilingual support</p>
        <h2 id="any-language-heading" className={styles.title}>
          One visit. Any language.
        </h2>
        <p className={styles.subtitle}>
          RemiMinderAI generates summaries in the language your family actually
          speaks.
        </p>

        <div className={styles.phones}>
          {PHONES.map((phone) => (
            <figure key={phone.label} className={styles.phone}>
              <div className={styles.bezel}>
                <img src={phone.src} alt={phone.alt} />
              </div>
              <figcaption>{phone.label}</figcaption>
            </figure>
          ))}
        </div>

        <p className={styles.more}>
          + English, Bengali, Portuguese, French, German and more
        </p>
      </div>
    </section>
  );
}
