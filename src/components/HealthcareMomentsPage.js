import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Users,
  Brain,
  Languages,
  CheckCircle2,
  Smartphone,
  Apple,
  ArrowLeft,
} from "lucide-react";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import { ANDROID_URL } from "../constants/site";
import styles from "./HealthcareMomentsPage.module.css";

const useCases = [
  {
    id: "seniors",
    icon: HeartHandshake,
    title: "For Seniors Managing Their Own Care",
    description:
      "Stay organized and confident while managing appointments, medications, and important healthcare information.",
    benefits: [
      "Capture important conversations",
      "Understand instructions in simple language",
      "Keep medications and follow-up tasks organized",
      "Revisit important details anytime",
    ],
  },
  {
    id: "families",
    icon: Users,
    title: "For Families Supporting Aging Parents",
    description: "Be connected even when you cannot always be in the room.",
    benefits: [
      "Stay informed after appointments",
      "Understand care instructions",
      "Share important updates",
      "Coordinate support together",
    ],
  },
  {
    id: "memory",
    icon: Brain,
    title: "For Memory Challenges and Cognitive Changes",
    description:
      "Supporting families navigating dementia, Alzheimer's, and other memory-related challenges.",
    benefits: [
      "Preserve important healthcare conversations",
      "Organize care information",
      "Create shared understanding among caregivers",
      "Reduce repeated questions and confusion",
    ],
    note: "RemiMinderAI does not treat, diagnose, or improve dementia. It helps families stay organized and informed.",
  },
  {
    id: "language",
    icon: Languages,
    title: "Healthcare in Your Language",
    description: "Everyone deserves to understand their healthcare information.",
    benefits: [
      "Create summaries in preferred languages",
      "Make medical information easier to understand",
      "Share clear updates with loved ones",
    ],
  },
];

const lingeringQuestions = [
  "What medication changed?",
  "What did the doctor recommend?",
  "When is the next appointment?",
  "Did everyone understand the plan?",
];

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ""} ${className}`}
    >
      {children}
    </div>
  );
}

const HealthcareMomentsPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      <MarketingHeader scrolled={scrolled} headerExtraClass={styles.pageHeader} />

      <main>
        <section className={styles.hero} aria-labelledby="moments-hero-title">
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Use Cases</p>
            <h1 id="moments-hero-title" className={styles.heroTitle}>
              Built for Real Healthcare Moments
            </h1>
            <p className={styles.heroSub}>
              Helping seniors, caregivers, and families stay organized, informed, and connected
              throughout the healthcare journey.
            </p>
            <p className={styles.heroSupport}>
              Healthcare information can become overwhelming. RemiMinderAI helps families capture
              important conversations, understand information in simple language, and share what
              matters with loved ones in seconds.
            </p>
            <p className={styles.highlight}>
              No waiting. No guessing. No trying to remember everything alone.
            </p>
            <div className={styles.heroActions}>
              <a
                href={ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Try RemiMinderAI
              </a>
              <Link to="/" className={styles.btnSecondary}>
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.useCases} aria-labelledby="use-cases-heading">
          <div className={styles.sectionInner}>
            <Reveal>
              <h2 id="use-cases-heading" className={styles.sectionTitle}>
                Real moments. Real families. Real support.
              </h2>
              <p className={styles.sectionLead}>
                RemiMinderAI is a family-centered care companion for the moments that matter after
                the appointment ends.
              </p>
            </Reveal>

            <div className={styles.cardGrid}>
              {useCases.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.id} className={styles.cardReveal}>
                    <article
                      className={styles.card}
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      <div className={styles.cardIcon} aria-hidden="true">
                        <Icon size={28} strokeWidth={1.8} />
                      </div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.description}</p>
                      <ul className={styles.benefitList}>
                        {item.benefits.map((benefit) => (
                          <li key={benefit}>
                            <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      {item.note ? <p className={styles.cardNote}>{item.note}</p> : null}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.emotional} aria-labelledby="emotional-heading">
          <Reveal>
            <div className={styles.emotionalInner}>
              <h2 id="emotional-heading" className={styles.emotionalTitle}>
                The appointment may last minutes. The questions last for weeks.
              </h2>
              <ul className={styles.questionList}>
                {lingeringQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
              <p className={styles.emotionalClose}>
                RemiMinderAI helps families turn healthcare conversations into clarity, organization,
                and confidence.
              </p>
            </div>
          </Reveal>
        </section>

        <section className={styles.bottomCta} aria-labelledby="cta-heading">
          <Reveal>
            <div className={styles.bottomCtaInner}>
              <h2 id="cta-heading" className={styles.bottomCtaTitle}>
                Understand more. Remember better. Stay connected.
              </h2>
              <p className={styles.bottomCtaText}>
                Support yourself and the people you love with a simpler way to manage healthcare
                information.
              </p>
              <div className={styles.heroActions}>
                <a
                  href={ANDROID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPrimary}
                >
                  <Smartphone size={18} aria-hidden="true" />
                  Download Android
                </a>
                <button type="button" className={styles.btnDisabled} disabled>
                  <Apple size={18} aria-hidden="true" />
                  iOS Coming Soon
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        <div className={styles.homeNav}>
          <Link to="/" className={styles.homeButton}>
            <ArrowLeft size={18} aria-hidden="true" />
            Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default HealthcareMomentsPage;
