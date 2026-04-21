import React from "react";
import styles from "./TestimonialsSection.module.css";

const TESTIMONIALS = [
  {
    quote:
      "I can use this to record my conversations with patients and generate summaries, saving me 1-2 hours of documentation time every day.",
    role: "Pediatrician",
    location: "California",
  },
  {
    quote:
      "I live far from my dad, who has early-stage dementia and Parkinson's. I never know what his doctor tells him, and he forgets his medications, which is making his health worse. With RemiMinderAI, I can finally see what his doctor said and remind him to take his meds on time.",
    role: "Daughter caring for her father, long-distance",
    location: "California",
  },
  {
    quote:
      "I need reminders for my medications so I don't forget to take them. Even just seeing them on the Overview screen in RemiMinderAI helps me stay on track.",
    role: "Patient and caregiver for her parents",
    location: "California",
  },
  {
    quote:
      "I need to see my upcoming appointments and new medications right on my screen. It's too overwhelming to hunt through different sections to find what my doctor said. And sometimes I'm left wondering if he even heard something I told him.",
    role: "Patient using RemiMinderAI",
    location: "California",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="testimonials-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrowText}>
              Beta program feedback
            </span>
          </div>
          <h2 id="testimonials-heading" className={styles.title}>
            People already building habits with RemiMinderAI
          </h2>
          <p className={styles.subtitle}>
            Private beta in progress. Here are perspectives shaping what we
            build next.
          </p>
        </header>

        <div className={styles.grid}>
          {TESTIMONIALS.map((item, index) => (
            <article key={index} className={styles.card}>
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className={styles.blockquote}>
                <p className={styles.quoteText}>{item.quote}</p>
                <cite className={styles.attribution}>
                  <div className={styles.attributionLine}>
                    <span className={styles.role}>{item.role}</span>
                    <span className={styles.locationDot} aria-hidden="true">
                      ·
                    </span>
                    <span className={styles.location}>{item.location}</span>
                  </div>
                  <span className={styles.betaLine}>Beta user perspective</span>
                </cite>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
