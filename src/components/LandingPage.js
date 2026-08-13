import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import elderlyImage from '../assets/user-elderly-caregiver.jpg';
import familyImage from '../assets/user-family.jpg';
import { useLocation } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import TestimonialsSection from "./TestimonialsSection";
import SiteFooter from "./SiteFooter";
import HeroCarousel from "./HeroCarousel";
import WhatRemiMinderIsSection from "./WhatRemiMinderIsSection";
import { 
  Mic, FileText, FolderOpen, Share2, Heart, Brain, Clock, Users, 
  CheckCircle2, Smartphone, Apple, Star,
  Zap, Globe
} from "lucide-react";

const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.remiminderai.app";
const IOS_URL = "https://apps.apple.com/app/remiminder-ai/id6776771952";

const LandingPage = () => {
  localStorage.setItem("onboarding_complete", true);

  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (location.hash === "#how-it-works") {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    }
    if (location.hash === "#get-started" || location.hash === "#demo") {
      document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      icon: <Mic className={styles.stepIcon} />,
      title: "Remember",
      description: "Capture conversations and important healthcare information.",
      number: "01",
      highlight: false
    },
    {
      icon: <FileText className={styles.stepIcon} />,
      title: "Understand",
      description: "Turn complex medical language into clear, everyday explanations.",
      number: "02",
      highlight: true
    },
    {
      icon: <FolderOpen className={styles.stepIcon} />,
      title: "Stay Organized",
      description: "Keep documents, medications, and reminders together.",
      number: "03",
      highlight: false
    },
    {
      icon: <Share2 className={styles.stepIcon} />,
      title: "Share",
      description: "Keep family and caregivers informed—wherever they are.",
      number: "04",
      highlight: false
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Built for Peace of Mind",
      description:
        "Capture important healthcare conversations and keep everything organized in one place, so nothing important gets lost.",
      footnote: null,
    },
    {
      icon: Brain,
      title: "Designed for Better Follow-Through",
      description:
        "Turn conversations into clear next steps, reminders, and care plans that help families stay on track.",
      footnote: null,
    },
    {
      icon: Clock,
      title: "Less Mental Load",
      description:
        "Stop relying on memory. Give patients and caregivers a shared understanding of what comes next.",
      footnote: null,
    },
    {
      icon: Users,
      title: "Keeping Families Connected",
      description:
        "Whether you're together or miles apart, everyone can stay informed and aligned around care.",
      footnote: null,
    },
  ];

  const clinicQuestions = [
    "What medication changed?",
    "What did the doctor recommend?",
    "When is the next appointment?",
    "Did everyone understand the plan?",
  ];

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <MarketingHeader scrolled={scrolled} />

      {/* ── HERO CAROUSEL ── */}
      <main id="home">
        <HeroCarousel />
      </main>

      <WhatRemiMinderIsSection />

      {/* ── SOCIAL PROOF BAR ── */}
      <div className={styles.socialProofBar}>
        <div className={styles.socialProofInner}>
          <div className={styles.proofItem}>
            <div className={styles.stars}>{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
            <span>Loved by early beta users</span>
          </div>
          <div className={styles.proofDivider} />
          <div className={styles.proofItem}><Globe size={14} /><span>Built for families &amp; caregivers</span></div>
          <div className={styles.proofDivider} />
          <div className={styles.proofItem}><Zap size={14} /><span>Zero to beta in 7 weeks</span></div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <section className={styles.demoCTASection} id="get-started">
        <div className={styles.demoCTAContainer}>
          <div className={styles.ctaContent}>
            <div className={styles.sectionLabelLight}>GET STARTED TODAY</div>
            <h2 className={styles.ctaTitleDark}>
              Start Caring with Confidence
            </h2>

            <div className={styles.ctaFeaturesCard}>
              {[
                { text: "Remember what matters.", icon: <CheckCircle2 size={18} /> },
                { text: "Stay organized.", icon: <CheckCircle2 size={18} /> },
                { text: "Support the people you love.", icon: <CheckCircle2 size={18} /> },
              ].map((f, i) => (
                <div key={i} className={styles.ctaFeaturesCardItem}>
                  <span className={styles.ctaFeaturesCardIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <p className={styles.ctaSupportText}>
              Download RemiMinderAI today and bring clarity to every healthcare journey.
            </p>

            <div className={styles.ctaDownloadRow} style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
              <a
                href={IOS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/app-store-badge.svg"
                  alt="Download on the App Store"
                  style={{ height: '48px' }}
                />
              </a>
              <a
                href={ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/google-play-badge.png"
                  alt="Get it on Google Play"
                  style={{ height: '48px' }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionLabel}>AFTER EVERY APPOINTMENT</div>
        <h2 className={styles.sectionTitle}>
          After Every <span className={styles.tealText}>Appointment</span>
        </h2>

        {/* Before / After Transformation Block */}
        <div className={styles.transformBlock}>
          <div className={styles.transformTitle}>What changes with RemiMinder</div>
          <div className={styles.transformGrid}>
            <div className={styles.transformBefore}>
              <div className={styles.transformLabel}>
                <span className={styles.transformLabelDot} style={{background:'#e05c5c'}} />
                Before
              </div>
              <ul className={styles.transformList}>
                <li>"Did the doctor say twice a day or once daily?"</li>
                <li>Confusing notes and missed instructions</li>
                <li>Scattered information across texts and memory</li>
                <li>Caregiver stress and repeated phone calls</li>
              </ul>
            </div>
            <div className={styles.transformArrow}>→</div>
            <div className={styles.transformAfter}>
              <div className={styles.transformLabel}>
                <span className={styles.transformLabelDot} style={{background:'var(--teal)'}} />
                After
              </div>
              <ul className={styles.transformList}>
                <li>Clear medication schedule, every time</li>
                <li>Structured care plan ready instantly</li>
                <li>Shared understanding across all caregivers</li>
                <li>Peace of mind for the whole family</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.stepCard} ${step.highlight ? styles.stepCardHighlight : ''}`}
            >
              {step.highlight && (
                <div className={styles.stepHighlightBadge}>✦ AI Magic Moment</div>
              )}
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={`${styles.stepIconWrapper} ${step.highlight ? styles.stepIconHighlight : ''}`}>
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {step.emotion ? <p className={styles.stepEmotion}>{step.emotion}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section id="who-its-for" className={styles.whoItsFor}>
        <div className={styles.sectionLabel}>WHO IT'S FOR</div>
        <h2 className={styles.sectionTitle}>
          Built for real <span className={styles.tealText}>caregiving challenges</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Missed medications, unclear instructions, and fragmented care communication 
          create real stress for families. RemiMinder fixes that.
        </p>

        <div className={styles.personaGrid}>
          <div className={styles.personaCard}>
            <div className={styles.personaImageWrapper}>
              <img src={elderlyImage} alt="For Seniors and Patients" className={styles.personaImage} />
              <div className={styles.personaImageOverlay} />
            </div>
            <div className={styles.personaContent}>
              <div className={styles.personaTag}>Patients</div>
              <h3>For Seniors &amp; Patients</h3>
              <p>Stay on top of your health with clear visit summaries, medication reminders, and easy access to your medical history.</p>
            </div>
          </div>

          <div className={styles.personaCard}>
            <div className={styles.personaImageWrapper}>
              <img src={familyImage} alt="For Families and Caregivers" className={styles.personaImage} />
              <div className={styles.personaImageOverlay} />
            </div>
            <div className={styles.personaContent}>
              <div className={styles.personaTag}>Caregivers</div>
              <h3>For Families &amp; Caregivers</h3>
              <p>Support your loved ones with shared health insights, appointment tracking, and real-time updates on their care journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section id="benefits" className={styles.benefitsSection}>
        <div className={styles.sectionLabel}>WHY IT MATTERS</div>
        <h2 className={styles.sectionTitle}>
          Why <span className={styles.tealText}>RemiMinderAI</span> Matters
        </h2>
        <p className={styles.sectionSubtitle}>
          Healthcare is built around appointments.
          <br />
          Life happens between them.
        </p>

        <div className={styles.benefitsIntro}>
          <p>After every doctor visit, families are left with important questions.</p>
          <p>
            Medications need to be remembered.
            <br />
            Instructions need to be understood.
            <br />
            Follow-up appointments need to be scheduled.
            <br />
            Loved ones need to stay informed.
          </p>
          <p>This is where caregivers quietly become care coordinators.</p>
          <p className={styles.benefitsIntroClose}>
            RemiMinderAI helps patients and families stay organized, revisit what was discussed, and
            move forward with confidence.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.benefitTop}>
                <div className={styles.benefitIconWrapper}><benefit.icon size={24} /></div>
              </div>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDesc}>{benefit.description}</p>
              {benefit.footnote && (
                <p className={styles.benefitFootnote}>{benefit.footnote}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── HEALTHCARE DOESN'T STOP AT THE CLINIC ── */}
      <section id="beyond-the-clinic" className={styles.whoItsFor}>
        <div className={styles.sectionLabel}>BETWEEN APPOINTMENTS</div>
        <h2 className={styles.sectionTitle}>
          Healthcare Doesn&apos;t Stop at the <span className={styles.tealText}>Clinic</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          The appointment may last 20 minutes.
          <br />
          The questions last for weeks.
        </p>

        <div className={styles.stepsGrid}>
          {clinicQuestions.map((question, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</div>
              <div className={styles.stepIconWrapper}>
                <CheckCircle2 className={styles.stepIcon} />
              </div>
              <h3>{question}</h3>
            </div>
          ))}
        </div>

        <p className={styles.clinicClosing}>
          RemiMinderAI helps patients and families answer those questions together by turning
          conversations into clear summaries, organized care plans, and timely reminders.
        </p>
      </section>

      <TestimonialsSection />
      <p className={styles.medicalDisclaimer}>
        RemiMinderAI is not a medical device and does not provide medical advice, diagnosis, or
        treatment. Always follow your healthcare provider&apos;s instructions.
      </p>
      <SiteFooter />

    </div>
  );
};

export default LandingPage;
