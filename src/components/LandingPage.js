import React, { useState, useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';
import elderlyImage from '../assets/user-elderly-caregiver.jpg';
import familyImage from '../assets/user-family.jpg';
import { useLocation } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import TestimonialsSection from "./TestimonialsSection";
import SiteFooter from "./SiteFooter";
import HeroPhoneStage from "./HeroPhoneStage";
import WhatRemiMinderIsSection from "./WhatRemiMinderIsSection";
import { 
  Mic, FileText, Bell, Shield, Heart, Brain, Clock, Users, 
  CheckCircle2, Smartphone, Apple, Star,
  Lock, Zap, Globe, Play
} from "lucide-react";
import ProductDemo from "./ProductDemo";
import { useMailingList } from "../context/MailingListContext";

const ANDROID_URL = "https://play.google.com/apps/internaltest/4701094525127045534";

const LandingPage = () => {
  localStorage.setItem("onboarding_complete", true);

  const { open: openMailingList } = useMailingList();
  const location = useLocation();
  const [showVideo, setShowVideo] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#how-it-works") {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    }
    if (location.hash === "#demo") {
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
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
      title: "Capture",
      description: "Record or upload doctor–patient conversations with one tap.",
      emotion: "No note-taking. No stress. Nothing gets lost.",
      number: "01",
      highlight: false
    },
    {
      icon: <FileText className={styles.stepIcon} />,
      title: "Understand",
      description: "AI extracts medications, instructions, and follow-ups automatically.",
      emotion: "Turns confusing medical conversations into clear, structured meaning in seconds.",
      number: "02",
      highlight: true
    },
    {
      icon: <Bell className={styles.stepIcon} />,
      title: "Organize",
      description: "Everything becomes a structured, shareable care plan.",
      emotion: "Keeps families and caregivers aligned without confusion or repeated calls.",
      number: "03",
      highlight: false
    },
    {
      icon: <Shield className={styles.stepIcon} />,
      title: "Remind",
      description: "Caregivers and patients get timely, smart reminders.",
      emotion: "Ensures nothing important is missed — ever.",
      number: "04",
      highlight: false
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Designed for peace of mind",
      description:
        "Every important detail from your healthcare visits is captured and organized, giving you confidence in your care decisions.",
      footnote: null,
    },
    {
      icon: Brain,
      title: "Built for better adherence",
      description:
        "Missed medications cost the U.S. healthcare system an estimated $300B annually. RemiMinderAI is built to help families close that gap, one visit at a time.",
      footnote:
        "Aggregate cost estimates of non-adherence and related waste vary by study and methodology; the scale remains directionally in the hundreds of billions USD annually in U.S. research.",
    },
    {
      icon: Clock,
      title: "Less mental load for caregivers",
      description:
        "Stop trying to remember what the doctor said. Everything you need is right at your fingertips, organized and searchable.",
      footnote: null,
    },
    {
      icon: Users,
      title: "Built to keep families aligned",
      description:
        "Keep your family in the loop automatically. Share updates and coordinate care effortlessly with the people who matter most.",
      footnote: null,
    },
  ];

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <MarketingHeader scrolled={scrolled} />

      {/* ── HERO ── */}
      <main className={styles.heroSection} ref={heroRef} id="home">
        <div className={styles.hero2Bg}>
          <div className={styles.hero2Ambient1} aria-hidden="true" />
          <div className={styles.hero2Ambient2} aria-hidden="true" />
          <div className={styles.hero2GridPattern} aria-hidden="true" />
        </div>

        <div className={styles.hero2Inner}>
          <div className={styles.hero2Grid}>
            <div className={styles.hero2CopyCol}>
              <div className={`${styles.hero2Eyebrow} ${styles.heroAnimBadge}`}>
                <span className={styles.hero2EyebrowDot} aria-hidden="true" />
                <span>Now in beta</span>
              </div>

              <h1 className={`${styles.hero2Title} ${styles.heroAnimHeadline}`}>
                Visits{" "}
                <span className={styles.hero2HeadlineEm}>
                  Together.
                </span>
              </h1>

              <p className={`${styles.hero2Sub} ${styles.heroAnimSub}`}>
                Turn doctor conversations into clear, shareable summaries so you and your family
                always know what comes next.
              </p>

              <div className={`${styles.hero2CtaBlock} ${styles.heroAnimCtas}`}>
                <div className={styles.hero2CtaRow}>
                  <a
                    href={ANDROID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.hero2BtnTeal}
                  >
                    <Smartphone size={18} aria-hidden="true" />
                    <span>Download Android</span>
                  </a>
                  <button type="button" className={styles.hero2BtnIos} disabled>
                    <Apple size={18} aria-hidden="true" />
                    <span>iOS Coming Soon</span>
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.hero2MailingBtn}
                  onClick={() => openMailingList({ source: "hero" })}
                >
                  Join our mailing list
                </button>
              </div>

              <div className={`${styles.hero2TrustRow} ${styles.heroAnimTrust}`}>
                <div className={styles.hero2TrustItem}>
                  <Lock size={14} strokeWidth={2.5} aria-hidden="true" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className={styles.hero2TrustItem}>
                  <Shield size={14} strokeWidth={2.5} aria-hidden="true" />
                  <span>End-to-End Encrypted</span>
                </div>
                <div className={styles.hero2TrustItem}>
                  <Zap size={14} strokeWidth={2.5} aria-hidden="true" />
                  <span>Powered by Google Cloud AI</span>
                </div>
              </div>
            </div>

            <div className={styles.hero2VisualCol}>
              <HeroPhoneStage />
            </div>
          </div>
        </div>
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

      {/* ── DEMO + CTA SPLIT SECTION ── */}
      <section className={styles.demoCTASection} id="demo">
        <div className={styles.demoCTAContainer}>

          {/* LEFT: Interactive Demo Box */}
          <div className={styles.ctaDemoBox}>
            <div className={styles.sectionLabel}>LIVE PREVIEW</div>
            <h3 className={styles.demoBoxTitle}>See it in action</h3>
            <p className={styles.demoBoxSubtitle}>
              See how RemiMinder turns a doctor conversation into a structured care plan instantly.
            </p>

            <div className={styles.ctaPreviewBox}>
              <div className={styles.previewRow}>
                <CheckCircle2 size={15} className={styles.previewIcon} />
                <span><strong>Medication:</strong> Metformin — 8:00 AM daily</span>
              </div>
              <div className={styles.previewRow}>
                <CheckCircle2 size={15} className={styles.previewIcon} />
                <span><strong>Follow-up:</strong> Tuesday 10:30 AM with Dr. Patel</span>
              </div>
              <div className={styles.previewRow}>
                <CheckCircle2 size={15} className={styles.previewIcon} />
                <span><strong>Summary:</strong> 3 key care instructions captured</span>
              </div>
              <div className={styles.previewRow}>
                <CheckCircle2 size={15} className={styles.previewIcon} />
                <span><strong>Shared with:</strong> Caregiver notified automatically</span>
              </div>
            </div>

            <button
              className={styles.demoButton}
              onClick={() => setShowVideo(true)}
            >
              <Play size={16} />
              Watch Demo
            </button>
          </div>

          {/* RIGHT: CTA Stack */}
          <div className={styles.ctaContent}>
            <div className={styles.sectionLabelLight}>GET STARTED TODAY</div>
            <h2 className={styles.ctaTitleDark}>
              Start experiencing RemiMinder today
            </h2>

            <div className={styles.ctaFeaturesCard}>
              {[
                { text: "No missed medications", icon: <CheckCircle2 size={18} /> },
                { text: "Clear visit summaries", icon: <CheckCircle2 size={18} /> },
                { text: "Caregiver alignment", icon: <CheckCircle2 size={18} /> },
                { text: "HIPAA compliant", icon: <CheckCircle2 size={18} /> },
              ].map((f, i) => (
                <div key={i} className={styles.ctaFeaturesCardItem}>
                  <span className={styles.ctaFeaturesCardIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <button
              className={styles.tryMeButton}
              onClick={() => setShowDemo(true)}
            >
              <Play size={16} />
              Try Now
            </button>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionLabel}>HOW IT WORKS</div>
        <h2 className={styles.sectionTitle}>
          From conversation to care <span className={styles.tealText}>in seconds</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Turn doctor conversations into clear, actionable care plans for patients and caregivers.
        </p>

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
              <p className={styles.stepEmotion}>{step.emotion}</p>
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
        <div className={styles.sectionLabel}>REAL IMPACT</div>
        <h2 className={styles.sectionTitle}>
          Why <span className={styles.tealText}>RemiMinderAI</span> matters
        </h2>
        <p className={styles.sectionSubtitle}>
          More than just features — we&apos;re building for the 54M+ unpaid family
          caregivers who carry it all.
        </p>

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

      <TestimonialsSection />
      <SiteFooter />

      {/* ── VIDEO MODAL ── */}
      {showVideo && (
        <div className={styles.videoOverlay} onClick={() => setShowVideo(false)}>
          <div className={styles.videoModal} onClick={e => e.stopPropagation()}>
            <button className={styles.videoCloseBtn} onClick={() => setShowVideo(false)}>✕</button>
            <div className={styles.videoWrapper}>
              <iframe
                src="https://www.youtube.com/embed/dVbArw-WjwA?autoplay=1"
                title="RemiMinder Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE DEMO OVERLAY ── */}
      {showDemo && (
        <div className={styles.fullScreenOverlay} onClick={() => setShowDemo(false)}>
          <section className={styles.fullScreen} onClick={e => e.stopPropagation()}>
            <ProductDemo />
            <button className={styles.fullscreenButton} onClick={() => setShowDemo(false)} aria-label="Close">
              ✕
            </button>
          </section>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
