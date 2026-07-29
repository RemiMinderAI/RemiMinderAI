import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import { CONTACT_EMAIL } from "../constants/site";
import styles from "./FutureVisionPage.module.css";

const INTEGRATIONS = [
  { title: "Electronic Health Records", sub: "Epic, Oracle Health/Cerner, athenahealth" },
  {
    title: "Ambient AI & Clinical Documentation Tools",
    sub: "Complementary patient-facing layer alongside existing workflows",
  },
  { title: "Patient Portals", sub: "Summaries patients can understand" },
  { title: "Care Management Platforms", sub: "Structured handoffs and action items" },
  {
    title: "Wearable Devices & Voice Assistants",
    sub: "Contextual reminders and health tracking",
  },
  { title: "Remote Patient Monitoring", sub: "Connecting conversations to ongoing care" },
];

const TRUST_ITEMS = [
  {
    title: "Data Sovereignty",
    desc: "Organizations control where data lives, how it's processed, and who can access it",
  },
  {
    title: "HIPAA-Aligned Deployments",
    desc: "Where applicable, with appropriate safeguards and legal agreements",
  },
  {
    title: "Business Associate Agreements",
    desc: "As part of any provider or health system partnership",
  },
  {
    title: "Role-Based Access Controls",
    desc: "Different permissions for patients, caregivers, clinicians, and administrators",
  },
  {
    title: "Audit Logging",
    desc: "Transparent records of who accessed what and when",
  },
  {
    title: "Consent Management",
    desc: "Configurable consent workflows for different regulatory environments",
  },
];

const PLATFORM_APIS = [
  "Summary API",
  "Reminder API",
  "Medication API",
  "Translation API",
  "Care Plan API",
  "Family Sharing API",
];

const CONSUMERS = [
  "EHR Systems",
  "Ambient AI & Documentation Tools",
  "Health Systems",
  "Patient Portals",
  "Caregiver Apps",
];

export default function FutureVisionPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Future Vision — RemiMinderAI";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      <MarketingHeader scrolled={scrolled} />

      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>RemiMinder Future Vision</p>
        <h1>Transforming Healthcare Conversations Into Action</h1>
        <p>
          Every conversation between a patient and a healthcare professional contains valuable
          information for many people. Today, most of it is lost. We're building the intelligence
          layer that changes that — designed to work within your existing systems, not replace them.
        </p>
        <span className={styles.heroPrinciple}>
          The data stays where you trust it. We provide the intelligence.
        </span>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>The Thesis</p>
          <h2>One Conversation. Multiple Outputs.</h2>
          <p className={styles.sectionIntro}>
            Every patient encounter generates information that matters to clinicians, patients,
            caregivers, and families — each with different needs. We're building toward a future
            where a single healthcare conversation can produce tailored, intelligent outputs for
            every stakeholder.
          </p>

          <div className={styles.diagram}>
            <div className={styles.diagramSource}>
              <span className={styles.diagramSourceLabel}>Healthcare Conversation</span>
            </div>
            <span className={styles.diagramArrow} />
            <div className={styles.diagramSource}>
              <span className={styles.chipMuted}>Hospital-Controlled Environment</span>
            </div>
            <span className={styles.diagramArrow} />
            <div className={styles.diagramEngine}>
              <span className={styles.diagramEngineLabel}>RemiMinderAI Intelligence Layer</span>
            </div>
            <span className={styles.diagramArrow} />
            <div className={styles.diagramOutputs}>
              <div className={styles.diagramOutput}>
                <div className={styles.diagramOutputIcon}>🩺</div>
                <div className={styles.diagramOutputTitle}>Clinician</div>
                <div className={styles.diagramOutputDesc}>
                  Structured draft documentation to reduce note-taking burden
                </div>
              </div>
              <div className={styles.diagramOutput}>
                <div className={styles.diagramOutputIcon}>🧑</div>
                <div className={styles.diagramOutputTitle}>Patient</div>
                <div className={styles.diagramOutputDesc}>
                  Plain-language summary with medications and follow-ups
                </div>
              </div>
              <div className={styles.diagramOutput}>
                <div className={styles.diagramOutputIcon}>👨‍👩‍👧</div>
                <div className={styles.diagramOutputTitle}>Family &amp; Caregiver</div>
                <div className={styles.diagramOutputDesc}>
                  Action items, medication changes, and care coordination
                </div>
              </div>
              <div className={styles.diagramOutput}>
                <div className={styles.diagramOutputIcon}>🏥</div>
                <div className={styles.diagramOutputTitle}>Organization</div>
                <div className={styles.diagramOutputDesc}>
                  Structured data for engagement, continuity, and workflows
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.dataPrinciple}>
        <p className={styles.dataPrincipleQuote}>
          &ldquo;Store once. Secure once. Share intelligently.&rdquo;
        </p>
        <p className={styles.dataPrincipleSub}>
          Our enterprise vision is built around a data-first principle: healthcare organizations
          maintain control of their data, while RemiMinderAI provides the intelligence layer that
          transforms conversations into actionable experiences.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Who This Serves</p>
          <h2>Designed for Every Side of the Conversation</h2>
          <p className={styles.sectionIntro}>
            We're hearing the same pain point from patients, families, and clinicians alike:
            important healthcare conversations deserve better tools.
          </p>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🩺</div>
              <h3>Healthcare Professionals</h3>
              <p>
                We're exploring how to reduce the documentation burden that follows every patient
                encounter — helping clinicians spend more time with patients and less time on
                paperwork. In conversations with a travel nurse and a pediatrician, we heard the
                same thing: recalling every detail from a conversation later that day, let alone
                weeks later, is one of the hardest parts of the job.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🧑</div>
              <h3>Patients</h3>
              <p>
                Our consumer app already helps patients understand what happened during a visit —
                with plain-language summaries, medication reminders, and follow-up instructions.
                We're building toward a future where every patient leaves a healthcare conversation
                with clarity, not confusion.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>👨‍👩‍👧</div>
              <h3>Families &amp; Caregivers</h3>
              <p>
                Caregivers can't always be in the room. We're designing ways for families to stay
                informed through shared visit summaries, coordinated medication tracking, and clear
                next steps — so no one is left guessing what the doctor said.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🏥</div>
              <h3>Healthcare Organizations</h3>
              <p>
                Better communication across the care journey leads to better outcomes. We're
                exploring how RemiMinderAI can help organizations improve patient engagement, reduce
                post-discharge misunderstandings, and support continuity of care — all without
                creating another data silo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Deployment Flexibility</p>
          <h2>Your Data. Your Environment. Our Intelligence.</h2>
          <p className={styles.sectionIntro}>
            We're designing RemiMinderAI with flexible deployment options that allow healthcare
            organizations to maintain control of their data while leveraging AI-powered conversation
            intelligence. The goal is not to create another healthcare data silo.
          </p>

          <div className={styles.deployGrid}>
            <div className={`${styles.deployCard} ${styles.deployCardPreferred}`}>
              <div className={`${styles.deployTag} ${styles.deployTagPreferred}`}>
                Preferred for Enterprise
              </div>
              <h3>Hospital-Hosted</h3>
              <p>
                RemiMinderAI services run inside the hospital's own cloud environment. The hospital
                controls PHI, manages compliance, and owns the data. RemiMinderAI provides the AI
                intelligence layer — no unnecessary data duplication, no data leaving your
                infrastructure.
              </p>
            </div>
            <div className={styles.deployCard}>
              <div className={styles.deployTag}>Also Available</div>
              <h3>Private Cloud</h3>
              <p>
                A dedicated RemiMinderAI cloud environment for organizations that prefer faster
                deployment with enterprise-grade controls, encryption, and a single-tenant
                architecture with appropriate compliance agreements.
              </p>
            </div>
            <div className={styles.deployCard}>
              <div className={styles.deployTag}>Available Today</div>
              <h3>Consumer</h3>
              <p>
                Patient-owned recordings processed in a secure cloud environment. The patient
                controls their data, chooses what to share, and manages their own care information.
                This is our live product on Android and coming soon to iOS.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Integration Vision</p>
          <h2>Built to Complement, Not Compete</h2>
          <p className={styles.sectionIntro}>
            Hospitals already have secure cloud environments, EHR systems, identity management, and
            compliance processes. RemiMinderAI is designed to plug into that existing infrastructure
            as an API-first platform — not ask organizations to adopt another tool.
          </p>

          <div className={styles.integrationList}>
            {INTEGRATIONS.map((item) => (
              <div className={styles.integrationItem} key={item.title}>
                <div className={styles.integrationCheck}>→</div>
                <div>
                  <div className={styles.integrationText}>{item.title}</div>
                  <div className={styles.integrationSub}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Open Architecture</p>
          <h2>Think API, Not Just App</h2>
          <p className={styles.sectionIntro}>
            Our long-term architecture is a set of modular, API-accessible services — not a closed
            application. Healthcare organizations and technology partners consume the specific
            capabilities they need, within their own infrastructure and workflows.
          </p>

          <div className={styles.diagram}>
            <div className={styles.apiPlatformWrap}>
              <div className={`${styles.labelUpper} ${styles.apiPlatformLabel}`}>
                RemiMinderAI Platform APIs
              </div>
              <div className={styles.chipRow}>
                {PLATFORM_APIS.map((api) => (
                  <span className={styles.chipNavy} key={api}>
                    {api}
                  </span>
                ))}
              </div>
            </div>
            <span className={styles.diagramArrow} />
            <div className={`${styles.labelUpper} ${styles.consumedByLabel}`}>Consumed By</div>
            <span className={styles.diagramArrow} />
            <div className={`${styles.chipRow} ${styles.chipRowSpaced}`}>
              {CONSUMERS.map((consumer) => (
                <span className={styles.chipCoral} key={consumer}>
                  {consumer}
                </span>
              ))}
            </div>
            <p className={styles.diagramCaption}>
              Your infrastructure. Our intelligence layer. Open integration.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Documentation Integration</p>
          <h2>Works With However You Document Today</h2>
          <p className={styles.sectionIntro}>
            Whether an organization uses ambient AI tools, traditional dictation, EHR templates, or
            manual note-taking — RemiMinderAI is designed to work alongside existing documentation
            workflows. For organizations using ambient tools, we become the patient-facing
            intelligence layer. For those that don't, we can serve as both the capture and the
            patient communication layer.
          </p>

          <div className={styles.diagram}>
            <div className={styles.docSource}>
              <span className={styles.diagramSourceLabel}>Doctor Visit / Patient Encounter</span>
            </div>
            <span className={styles.diagramArrow} />
            <div className={styles.docMid}>
              <span className={styles.chipMuted}>
                Ambient AI Tool, Dictation System, EHR Template, or Direct Recording
              </span>
            </div>
            <span className={styles.diagramArrow} />
            <div className={styles.ambientGrid}>
              <div>
                <div className={styles.labelUpper}>Clinical Documentation</div>
                <div className={styles.ambientBox}>
                  <div className={styles.ambientTitle}>Provider &amp; EHR</div>
                  <div className={styles.ambientDesc}>
                    Structured SOAP notes, clinical documentation, EHR entry
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.labelUpper}>RemiMinderAI API</div>
                <div className={styles.ambientBoxCoral}>
                  <div className={styles.ambientTitleCoral}>Patient &amp; Family Experience</div>
                  <div className={styles.ambientDesc}>
                    Visit summary, medication instructions, follow-up tasks, caregiver updates,
                    multilingual support
                  </div>
                </div>
              </div>
            </div>
            <p className={`${styles.diagramCaption} ${styles.diagramCaptionTight}`}>
              Same conversation. Different audiences. Complementary outputs.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Privacy &amp; Trust</p>
          <h2>Healthcare Conversations Deserve the Highest Level of Trust</h2>
          <p className={styles.sectionIntro}>
            As we expand beyond consumer use cases, we are exploring enterprise capabilities
            designed to meet the standards healthcare organizations require — starting with the
            principle that organizations should maintain control of their data.
          </p>

          <div className={styles.trustGrid}>
            {TRUST_ITEMS.map((item) => (
              <div className={styles.trustItem} key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>Global Opportunity</p>
          <h2>Not Just the U.S. — A Worldwide Need</h2>
          <p className={styles.sectionIntro}>
            The documentation burden and patient communication gap are not American problems —
            they're global ones. In many parts of the world, the opportunity is even larger because
            the infrastructure gap is wider.
          </p>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🇺🇸</div>
              <h3>United States</h3>
              <p>
                EHR adoption is near-universal, and ambient AI is growing fast. RemiMinderAI fits as
                the patient communication layer alongside existing clinical tools — complementing
                what hospitals already have.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🇮🇳</div>
              <h3>India &amp; Emerging Markets</h3>
              <p>
                With a doctor-to-patient ratio of 1:1,500 and EHR adoption still in early stages,
                millions of healthcare conversations happen with no digital documentation at all.
                RemiMinderAI can serve as both the capture and communication layer — bringing
                AI-powered documentation to healthcare systems that need it most, in the languages
                patients and providers actually speak.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🌍</div>
              <h3>Multilingual by Design</h3>
              <p>
                RemiMinderAI already supports 10 languages and is designed to expand further —
                because healthcare conversations don't happen in just one language. Our architecture
                is built to serve diverse populations with plain-language summaries and voice
                support in their native language.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.remiq}>
        <p>
          RemiMinderAI is the first application being developed under the <strong>Remiq</strong>{" "}
          vision — a platform for transforming healthcare conversations into actionable intelligence
          for patients, caregivers, clinicians, and healthcare organizations.{" "}
          <a href="https://remiq.health" target="_blank" rel="noopener noreferrer">
            Learn more at remiq.health
          </a>
        </p>
      </div>

      <section className={styles.closing}>
        <h2>
          Healthcare AI Shouldn't Replace Conversations.
          <br />
          It Should Help People Remember Them.
        </h2>
        <p>
          Whether you're a patient trying to remember what your doctor said, a caregiver supporting
          a loved one, or a healthcare organization looking to improve communication — our mission
          is the same: help every important healthcare conversation lead to better care.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className={styles.ctaBtn}>
          Start The Conversation
        </a>
      </section>

      <div className={styles.backHomeWrap}>
        <button
          type="button"
          className={styles.backHome}
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      <footer className={styles.footer}>
        <p>
          &copy; 2026 RemiMinderAI &middot; A Remiq Company &middot; This page describes our future
          vision and product roadmap. Features described as &ldquo;exploring&rdquo; or
          &ldquo;preferred for enterprise&rdquo; are not yet available.
        </p>
      </footer>
    </div>
  );
}
