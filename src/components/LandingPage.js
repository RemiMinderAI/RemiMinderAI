import React, { useState, useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';
import howItWorksImage from '../assets/coverpage.png';
import elderlyImage from '../assets/user-elderly-caregiver.jpg';
import familyImage from '../assets/user-family.jpg';
import { useNavigate, useLocation } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import CtaSection from "./CtaSection";
import TestimonialsSection from "./TestimonialsSection";
import SiteFooter from "./SiteFooter";
import { 
  Mic, FileText, Bell, Shield, Heart, Brain, Clock, Users, 
  ArrowRight, CheckCircle2, Smartphone, Apple, Star,
  Lock, Zap, Globe, Play
} from "lucide-react";
import logo from '../assets/RemiMinder_logo_512.png';
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
  const [flashArmed, setFlashArmed] = useState(false);
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

  useEffect(() => {
    const id = window.setTimeout(() => setFlashArmed(true), 900);
    return () => window.clearTimeout(id);
  }, []);
  
  const navigate = useNavigate();

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
      title: "Peace of Mind",
      description: "Every important detail from your healthcare visits is captured and organized, giving you confidence in your care decisions.",
      stat: "95%",
      statLabel: "feel more in control",
    },
    {
      icon: Brain,
      title: "Better Health Outcomes",
      description: "With clear summaries and reminders, you're more likely to follow treatment plans and catch important health changes early.",
      stat: "3x",
      statLabel: "better medication adherence",
    },
    {
      icon: Clock,
      title: "Time Saved",
      description: "Stop trying to remember what the doctor said. Everything you need is right at your fingertips, organized and searchable.",
      stat: "10hrs",
      statLabel: "saved per month",
    },
    {
      icon: Users,
      title: "Family Connection",
      description: "Keep your family in the loop automatically. Share updates and coordinate care effortlessly with the people who matter most.",
      stat: "100%",
      statLabel: "family satisfaction",
    },
  ];

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <MarketingHeader scrolled={scrolled} />

      {/* ── HERO ── */}
      <main className={styles.heroSection} ref={heroRef} id="home">
        <div className={styles.heroBackground}>
          <div className={styles.heroBgOrb1} />
          <div className={styles.heroBgOrb2} />
          <div className={styles.heroBgGrid} />
        </div>

                <div className={styles.leftPanel}>
          <div className={`${styles.aiTag} ${styles.heroAnimBadge}`}>
            <span className={styles.aiTagInner}>
              <span className={styles.aiTagDot} />
              Smart AI for Health &amp; Care Coordination
            </span>
          </div>
          <h1 className={styles.title}>
            <span className={`${styles.heroTitleInner} ${styles.heroAnimHeadline}`}>
              <span className={styles.heroHeadlineLead}>Remember every visit.</span>{" "}
              <span className={styles.togetherWrap}>
                Together.
                <svg
                  className={`${styles.flashSvg} ${flashArmed ? styles.flashSvgArmed : ""}`}
                  viewBox="0 0 200 14"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M4,8 Q40,3 80,7 T150,6 T196,8" />
                </svg>
              </span>
            </span>
          </h1>
          <p className={`${styles.description} ${styles.heroAnimSub}`}>
            Turn doctor conversations into clear, shareable summaries so you and your family always know what comes next.
          </p>

          <div className={`${styles.buttonGroup} ${styles.heroAnimCtas}`}>
            <a href={ANDROID_URL} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              <Smartphone size={16} />
              <span>Download Android</span>
            </a>
            <button className={styles.iosButton} disabled>
              <Apple size={16} />
              <span>iOS Soon</span>
            </button>
            <button
              type="button"
              className={styles.androidButton}
              onClick={() => openMailingList({ source: "hero" })}
            >
              Join our mailing list
            </button>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.trustItem}><Lock size={13} /><span>HIPAA Compliant</span></div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}><Shield size={13} /><span>End-to-End Encrypted</span></div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}><Zap size={13} /><span>Powered by Google Cloud AI</span></div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.hiwImageWrapper}>
            <img src={howItWorksImage} alt="RemiMinder App Beta" className={styles.hiwImage} />
          </div>
        </div>
      </main>

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
              <a href={ANDROID_URL} target="_blank" rel="noopener noreferrer" className={styles.personaCta}>
                Try the App <ArrowRight size={14} />
              </a>
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
              <button
                type="button"
                className={styles.personaCta}
                onClick={() => openMailingList({ source: "landing_page" })}
              >
                Join Waitlist <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section id="benefits" className={styles.benefitsSection}>
        <div className={styles.sectionLabel}>REAL IMPACT</div>
        <h2 className={styles.sectionTitle}>
          Measurable impact on <span className={styles.tealText}>real lives</span>
        </h2>
        <p className={styles.sectionSubtitle}>More than just features — RemiMinder transforms how you experience healthcare.</p>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.benefitTop}>
                <div className={styles.benefitIconWrapper}><benefit.icon size={24} /></div>
                <div className={styles.benefitStat}>
                  <div className={styles.benefitStatValue}>{benefit.stat}</div>
                  <div className={styles.benefitStatLabel}>{benefit.statLabel}</div>
                </div>
              </div>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDesc}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSection />
      <CtaSection />
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
