import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import heroImage from '../assets/hero-ai-orb.jpg'; 
import howItWorksImage from '../assets/coverpage.png';
import elderlyImage from '../assets/user-elderly-caregiver.jpg';
import familyImage from '../assets/user-family.jpg';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Mic, FileText, Bell, Shield, Heart, Brain, Clock, Users, 
  User, ArrowRight, CheckCircle2, Smartphone, Apple
} from "lucide-react";
import ProductDemo from "./ProductDemo";
import { Maximize2 } from "lucide-react";
import logo from '../assets/RemiMinder_logo_512.png';

const MAILING_LIST_URL = "https://docs.google.com/forms/d/e/1FAIpQLScUUVtqWYyrDdnrfWDLK57QQVWVqwjIBbkoPz1DfXvBmkUaKw/viewform?usp=sharing&ouid=115359110800847240110";
const ANDROID_URL = "https://play.google.com/apps/internaltest/4701094525127045534";

const LandingPage = () => {
  localStorage.setItem("onboarding_complete", true);
  
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (location.hash === "#how-it-works") {
      const el = document.getElementById("how-it-works");
      el?.scrollIntoView({ behavior: "smooth" });
    }
    if (location.search.includes("fullscreen=true")) {
      setIsFullScreen(true);
    }
  }, [location]);
  
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Mic className={styles.stepIcon} />,
      title: "Record & Capture",
      description:
        "Easily record doctor visits and medical conversations with one tap. Your AI companion listens and captures every important detail.",
    },
    {
      icon: <FileText className={styles.stepIcon} />,
      title: "Summarize & Organize",
      description:
        "Get clear, structured summaries of your visits. All your health information organized in one secure place.",
    },
    {
      icon: <Bell className={styles.stepIcon} />,
      title: "Remind & Support",
      description:
        "Never miss medications or follow-ups. Smart reminders keep you and your loved ones on track.",
    },
    {
      icon: <Shield className={styles.stepIcon} />,
      title: "Privacy First",
      description:
        "Your health data is encrypted and secure. Built with privacy at the core, you're always in control.",
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Peace of Mind",
      description:
        "Know that every important detail from your healthcare visits is captured and organized, giving you confidence in your care decisions.",
      stat: "95%",
      statLabel: "feel more in control",
    },
    {
      icon: Brain,
      title: "Better Health Outcomes",
      description:
        "With clear summaries and reminders, you're more likely to follow treatment plans and catch important health changes early.",
      stat: "3x",
      statLabel: "better medication adherence",
    },
    {
      icon: Clock,
      title: "Time Saved",
      description:
        "Stop trying to remember what the doctor said or searching for that note. Everything you need is right at your fingertips.",
      stat: "10hrs",
      statLabel: "saved per month",
    },
    {
      icon: Users,
      title: "Family Connection",
      description:
        "Keep your family in the loop automatically. Share updates and coordinate care effortlessly with the people who matter most.",
      stat: "100%",
      statLabel: "family satisfaction",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate("/")}>
          <div className={styles.logoImg}>
            <img
              src={logo}
              alt="RemiMinder Logo"
              className={styles.logoImg}
            />
          </div>
          RemiMinderAI
        </div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>Home</a>
          <a
            href="#"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              setIsFullScreen(true);
            }}
          >
            Product Demo
          </a>
          <a
            href="#how-it-works"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            How It Works
          </a>
          <a href="/about" className={styles.navLink}>About</a>
        </nav>
        <a
          href={MAILING_LIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mailingListButton}
        >
          Join Our Mailing List
        </a>
      </header>

      {/* Hero Section */}
      <main className={styles.heroSection}>
        <div className={styles.leftPanel}>
          <div className={styles.aiTag}>✨ AI-Powered Healthcare Companion</div>
          <h1 className={styles.title}>
            Your healthcare,
            <br />
            <span className={styles.highlightRemembered}>remembered</span> and{' '}
            <span className={styles.highlightReimagined}>reimagined</span>
          </h1>
          <p className={styles.description}>
            Never miss a detail from your doctor visits. RemiMinder records
            conversations, creates clear summaries, and keeps your health
            journey organized—so you can focus on what matters most.
          </p>

          <div className={styles.buttonGroup}>
            <a
              href={MAILING_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Sign Up&nbsp;<ArrowRight size={16} />
            </a>
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.androidButton}
            >
              <Smartphone size={16} />&nbsp;Download Android
            </a>
            <button
              className={styles.iosButton}
              disabled
            >
              <Apple size={16} />&nbsp;Download iOS&nbsp;
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            </button>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>50K+</div>
              <div className={styles.statLabel}>Families Supported</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>98%</div>
              <div className={styles.statLabel}>User Satisfaction</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>AI Support</div>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.demoWrapper}>
            <section id="product" className={`${styles.demoFrame} ${isFullScreen ? styles.fullScreen : ""}`}>
              <ProductDemo />
              <button
                className={styles.fullscreenButton}
                onClick={() => setIsFullScreen(!isFullScreen)}
                aria-label="Toggle fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.hiwIntro}>
          <h2>
            How <span className={styles.gradientText}>RemiMinder</span> Works
          </h2>
          <p>Four simple steps to transform how you manage your healthcare journey.</p>
        </div>

        <div className={styles.hiwImageWrapper}>
          <img
            src={howItWorksImage}
            alt="How RemiMinder Works Visual Flow"
            className={styles.hiwImage}
          />
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepIconWrapper}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHO IT'S FOR SECTION --- */}
      <section id="who-its-for" className={styles.whoItsFor}>
        <div className={styles.whoIntro}>
          <h2>
            Built for <span className={styles.gradientText}>everyone</span> who cares<br />about health
          </h2>
          <p>
            From patients navigating complex conditions to families supporting loved ones.
          </p>
        </div>

        <div className={styles.personaGrid}>
          <div className={styles.personaCard}>
            <div className={styles.personaImageWrapper}>
              <img
                src={elderlyImage}
                alt="For Seniors and Patients"
                className={styles.personaImage}
              />
            </div>
            <div className={styles.personaContent}>
              <h3>For Seniors & Patients</h3>
              <p>
                Stay on top of your health with clear visit summaries, medication reminders, and easy access to your medical history.
              </p>
            </div>
          </div>

          <div className={styles.personaCard}>
            <div className={styles.personaImageWrapper}>
              <img
                src={familyImage}
                alt="For Families and Caregivers"
                className={styles.personaImage}
              />
            </div>
            <div className={styles.personaContent}>
              <h3>For Families & Caregivers</h3>
              <p>
                Support your loved ones with shared health insights, appointment tracking, and real-time updates on their care journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section id="benefits" className={styles.benefitsSection}>
        <div className={styles.benefitsDivider} />
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsIntro}>
            <h2>
              Real impact on <span className={styles.gradientText}>real lives</span>
            </h2>
            <p>
              More than just features — RemiMinder transforms how you experience healthcare.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={styles.benefitGlow} />
                <div className={styles.benefitInner}>
                  <div className={styles.benefitTop}>
                    <div className={styles.benefitIconWrapper}>
                      <benefit.icon size={32} />
                    </div>
                    <div className={styles.benefitStat}>
                      <div className={styles.benefitStatValue}>{benefit.stat}</div>
                      <div className={styles.benefitStatLabel}>{benefit.statLabel}</div>
                    </div>
                  </div>
                  <div className={styles.benefitContent}>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION SECTION --- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaHeader}>
            <h2>
              Ready to transform your{" "}
              <span className={styles.gradientText}>healthcare experience?</span>
            </h2>
            <p>
              Join thousands of families already using RemiMinder. Sign up or download the app to get started.
            </p>
          </div>

          <div className={styles.ctaCardWrapper}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaButtonGroup}>
                <a
                  href={MAILING_LIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaPrimaryButton}
                >
                  Sign Up&nbsp;<ArrowRight size={18} />
                </a>
                <a
                  href={ANDROID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaAndroidButton}
                >
                  <Smartphone size={18} />&nbsp;Download Android
                </a>
                <button className={styles.ctaIosButton} disabled>
                  <Apple size={18} />&nbsp;Download iOS&nbsp;
                  <span className={styles.comingSoonBadge}>Coming Soon</span>
                </button>
              </div>

              {/* Features list */}
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  <span>Early access to all features</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  <span>Exclusive onboarding support</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  <span>Founding member pricing</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  <span>Privacy-first, secure by design</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.trustSection}>
            <p>Trusted by healthcare professionals and families worldwide</p>
            <div className={styles.trustBadges}>
              <div className={styles.statusDot}></div>
              <span>HIPAA Compliant • SOC 2 Certified • End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
            <p>© 2025 RemiMinderAI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;