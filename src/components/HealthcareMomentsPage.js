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
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./HealthcareMomentsPage.module.css";

const useCases = [
  {
    id: "seniors",
    icon: HeartHandshake,
    title: "For Seniors Managing Their Own Care",
    description:
      "Stay organized and confident while keeping track of appointments, medication notes, and important healthcare information from your visits.",
    benefits: [
      "Capture important conversations",
      "Review instructions in simple language",
      "Keep medication and follow-up notes organized",
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
      "Review care instructions together",
      "Share important updates",
      "Coordinate support together",
    ],
  },
  {
    id: "memory",
    icon: Brain,
    title: "For Families Navigating Memory Challenges",
    description:
      "Help loved ones stay organized when remembering appointment details and care instructions is harder.",
    benefits: [
      "Preserve important healthcare conversations",
      "Keep care information in one shared place",
      "Help caregivers stay aligned on what was discussed",
      "Revisit notes and instructions whenever needed",
    ],
    note: "RemiMinderAI is an organization and reminder tool. It does not diagnose, treat, cure, or prevent dementia, Alzheimer's disease, or any other medical condition.",
  },
  {
    id: "language",
    icon: Languages,
    title: "Healthcare in Your Language",
    description: "Everyone deserves to understand the information shared during their healthcare visits.",
    benefits: [
      "Create summaries in preferred languages",
      "Make visit information easier to review",
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
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={`${pricingStyles.pricingHeader} ${styles.pageHeader}`}
      />

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
          </div>
        </section>

        <section className={styles.useCases} aria-labelledby="use-cases-heading">
          <div className={styles.sectionInner}>
            <Reveal>
              <h2 id="use-cases-heading" className={styles.sectionTitle}>
                Real moments. Real families. Real support.
              </h2>
              <p className={styles.sectionLead}>
                RemiMinderAI helps families organize healthcare information after the appointment
                ends — so everyone can stay informed and connected.
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
                Stay informed. Stay organized. Stay connected.
              </h2>
              <p className={styles.bottomCtaText}>
                Support yourself and the people you love with a simpler way to organize healthcare
                information from your visits.
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

        <p className={styles.disclaimer}>
          RemiMinderAI is not a medical device and does not provide medical advice, diagnosis, or
          treatment. Summaries and reminders are meant to help you organize what was discussed —
          always follow your healthcare provider&apos;s instructions.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
};

export default HealthcareMomentsPage;
