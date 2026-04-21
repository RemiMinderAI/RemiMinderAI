import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Linkedin } from "lucide-react";
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./AboutPage.module.css";
import SiteFooter from "./SiteFooter";
import MarketingHeader from "./MarketingHeader";
import CtaSection from "./CtaSection";
import profileParamita from "../assets/profilephotos/tina.jfif";
import { CONTACT_EMAIL, MAILING_LIST_URL } from "../constants/site";

/** About page copy per marketing spec (About Page — RemiMinderAI). */
const AboutPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const techStack = [
    {
      id: "mobile",
      name: "Mobile Interface",
      bio: "Built with Flutter for a high-performance, cross-platform experience (iOS/Android) with rapid feature parity across devices.",
    },
    {
      id: "docintel",
      name: "Document Intelligence",
      bio: "Google ML Kit for on-device OCR and Google Document AI for high-accuracy extraction of prescriptions, lab results, and complex medical documents.",
    },
    {
      id: "genai",
      name: "Generative AI",
      bio: "Powered by Google Gemini via Vertex AI for real-time visit transcription, medical summarization, and personalized health action plans.",
    },
  ];

  const cloudInfrastructure = [
    {
      id: "be",
      name: "Backend",
      bio: "High-speed FastAPI (Python) services hosted on Google Cloud Run for serverless, auto-scaling performance.",
    },
    {
      id: "db",
      name: "Database",
      bio: "Google Cloud SQL (PostgreSQL) for robust, relational storage of patient records with automated backups.",
    },
    {
      id: "sec",
      name: "Security & Compliance",
      bio: "Firebase Auth for secure identity management and Google Cloud Storage for encrypted PHI. We operate under a signed BAA with Google Cloud, with AI workloads running on HIPAA-eligible Vertex AI.",
    },
  ];

  const dataControlItems = [
    "HIPAA Compliant. We operate under a signed Business Associate Agreement (BAA) with Google Cloud, and our AI processing runs on Vertex AI — a HIPAA-eligible Google Cloud service. Protected Health Information (PHI) is encrypted at rest and in transit using industry-standard TLS.",
    "Identity & access. Authentication is handled by Firebase Auth with role-based access controls.",
    "Data residency. All patient data is stored in Google Cloud infrastructure in the United States.",
    "No selling, no ads. We don't sell user data. We don't serve ads. Our business model is the product, not the people using it.",
    "You control who sees what. Patients can grant full or partial access to caregivers and revoke it at any time. You decide what's shared, with whom, and for how long.",
  ];

  const roadmapItems = [
    "Q2 2026 — External beta opens to waitlist (Android first)",
    "Q3 2026 — iOS release and caregiver web dashboard",
    "Q4 2026 — Care team collaboration features, provider integrations",
    "2027 — Expanded clinical partnerships and multi-language support",
  ];

  const companyLines = [
    "Company Name: RemiMinderAI",
    "Industry: Digital Health / HealthTech",
    "Company Size: 2–10 employees",
    "Headquarters: Hollister, California",
    "Founded: 2025",
    "Status: Private Beta (Invite Only)",
    "Email: team@remiminderai.com",
  ];

  return (
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={pricingStyles.pricingHeader}
        showMailingList={false}
      />

      <section className={styles.statusBanner} aria-label="Private beta notice">
        <div className={styles.statusInner}>
          <p className={styles.statusText}>
            Private Beta — Invite Only. We&apos;re onboarding a small group of caregivers and patients.
          </p>
          <a
            href={MAILING_LIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={landingStyles.primaryButton}
          >
            Request an invite
          </a>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altWhite}`}>
        <div className={styles.sectionNarrow}>
          <h1 className={styles.heroTitle}>About RemiMinderAI</h1>
          <p className={styles.heroSub}>
            Healthcare coordination, finally built for the people doing the coordinating.
          </p>
          <div className={styles.prose}>
            <p>
              RemiMinderAI is an AI-native health management platform that helps families capture,
              organize, and act on medical information so critical care moments never slip through the
              cracks.
            </p>
            <p>
              We turn fragmented doctor visits, medication schedules, and scattered records into a single,
              shared source of truth for patients and the caregivers who support them.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altCream}`}>
        <div className={styles.sectionNarrow}>
          <h2 className={styles.sectionHeading}>Why We Built This</h2>
          <div className={styles.prose}>
            <p>
              Anyone who has helped a parent, partner, or child navigate the healthcare system knows the
              feeling: you leave the doctor&apos;s office already forgetting half of what was said,
              juggling prescription names you can&apos;t pronounce, and wondering who else in the family
              needs to know what just happened.
            </p>
            <p>
              RemiMinderAI started with that exact problem. Care doesn&apos;t happen in a single
              appointment — it happens in the days and weeks after, across phone calls, pharmacies, and
              kitchen tables. We&apos;re building the platform that holds it all together.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altWhite}`}>
        <div className={styles.sectionWide}>
          <div className={styles.twoCol}>
            <div className={`${landingStyles.stepCard} ${styles.colCard}`}>
              <h2 className={styles.sectionHeading} style={{ fontSize: "1.65rem", marginBottom: "12px" }}>
                What We Do
              </h2>
              <div className={styles.prose}>
                <p>
                  RemiMinderAI is an AI-powered health management platform that helps patients record,
                  organize, and share their health information with caregivers and healthcare providers.
                </p>
                <p>
                  Our mobile and web application uses advanced speech recognition and natural language
                  processing to transcribe doctor visits, extract key medical information, and generate
                  actionable health insights.
                </p>
                <p>
                  The platform connects patients with their care team in real time, turning every
                  appointment into structured, shareable knowledge instead of forgotten conversations.
                </p>
              </div>
            </div>
            <div className={`${landingStyles.stepCard} ${styles.colCard}`}>
              <h2 className={styles.sectionHeading} style={{ fontSize: "1.65rem", marginBottom: "12px" }}>
                Problems We Solve
              </h2>
              <ul className={styles.problemList}>
                <li>
                  Patients forget 40–80% of medical information immediately after a visit, and nearly half
                  of what&apos;s remembered is recalled incorrectly
                  <sup>1</sup>
                </li>
                <li>
                  Caregivers lack real-time visibility into their loved ones&apos; health status and
                  appointments
                </li>
                <li>
                  Fragmented health records across multiple providers create dangerous gaps in care
                </li>
                <li>Seniors struggle with complex medication schedules and adherence</li>
                <li>
                  Families waste hours coordinating care through scattered phone calls, texts, and sticky
                  notes
                </li>
              </ul>
              <p className={styles.footnote}>
                <sup>1</sup> Kessels, R.P.C. Patients&apos; memory for medical information. Journal of the
                Royal Society of Medicine, 2003.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altCream}`}>
        <div className={styles.sectionNarrow}>
          <h2 className={styles.sectionHeading}>Your Data, Your Control</h2>
          <p className={styles.prose} style={{ marginBottom: "16px" }}>
            Healthcare data is the most sensitive information a person shares. We treat it that way.
          </p>
          <ul className={styles.dataList}>
            {dataControlItems.map((text) => (
              <li key={text.slice(0, 40)}>
                <span className={styles.dataBullet} aria-hidden="true">
                  •
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <Link to="/privacy" className={styles.privacyLink}>
            Read our full Privacy Policy →
          </Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altWhite}`}>
        <div className={styles.sectionWide}>
          <div className={styles.centerTitle}>
            <h2 className={styles.sectionHeading}>Our Core Tech Stack</h2>
          </div>
          <div className={styles.cardGrid}>
            {techStack.map((item) => (
              <div key={item.id} className={landingStyles.stepCard}>
                <h3>{item.name}</h3>
                <p>{item.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altCream}`}>
        <div className={styles.sectionWide}>
          <div className={styles.centerTitle}>
            <h2 className={styles.sectionHeading}>Cloud Infrastructure</h2>
          </div>
          <div className={styles.cardGrid}>
            {cloudInfrastructure.map((item) => (
              <div key={item.id} className={landingStyles.stepCard}>
                <h3>{item.name}</h3>
                <p>{item.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altWhite}`}>
        <div className={styles.sectionWide}>
          <div className={styles.centerTitle}>
            <h2 className={styles.sectionHeading}>Our Team</h2>
          </div>
          <div className={styles.teamSingle}>
            <div className={`${landingStyles.personaCard} ${styles.teamCardInner}`}>
              <div className={styles.avatar}>
                <img src={profileParamita} alt="Paramita Malakar" className={styles.avatarImg} />
              </div>
              <h3 className={styles.teamName}>Paramita Malakar</h3>
              <p className={styles.teamRole}>Product &amp; AI/ML Leader</p>
              <p className={styles.teamBio}>
                Product &amp; Quality Assurance Leader, with 18 years of experience, focused on transforming
                ideas into impactful AI and enterprise solutions.
              </p>
              <a
                href="https://www.linkedin.com/in/paramitam/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedinLink}
              >
                <Linkedin size={16} strokeWidth={1.75} />
                <span>LinkedIn →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altCream}`}>
        <div className={styles.sectionWide}>
          <div className={styles.centerTitle}>
            <h2 className={styles.sectionHeading}>What&apos;s Next</h2>
          </div>
          <ul className={styles.roadmapList}>
            {roadmapItems.map((line) => (
              <li key={line} className={styles.roadItem}>
                <span className={styles.dataBullet} aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altWhite}`}>
        <div className={styles.sectionNarrow}>
          <div className={landingStyles.stepCard}>
            <h2 className={styles.sectionHeading}>Company Information</h2>
            <ul className={styles.companyList}>
              {companyLines.map((line) => (
                <li key={line}>
                  <span className={styles.companyBullet} aria-hidden="true">
                    •
                  </span>
                  <span>{line}</span>
                </li>
              ))}
              <li>
                <span className={styles.companyBullet} aria-hidden="true">
                  •
                </span>
                <span>
                  LinkedIn:{" "}
                  <a
                    href="https://www.linkedin.com/company/remiminderai/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/company/remiminderai
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altCream}`}>
        <div className={styles.sectionNarrow} style={{ textAlign: "center" }}>
          <p className={styles.prose} style={{ marginBottom: "22px" }}>
            Want early access? We&apos;re onboarding a limited group of families and caregivers during private
            beta. If RemiMinderAI sounds like something you or someone you love needs, request an invite.
          </p>
          <div className={styles.ctaRow}>
            <a
              href={MAILING_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={landingStyles.primaryButton}
            >
              Request Beta Access →
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className={landingStyles.androidButton}>
              Contact the Team →
            </a>
          </div>
        </div>
      </section>

      <div className={styles.backHomeWrap}>
        <button type="button" className={styles.backHome} onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <CtaSection />
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
