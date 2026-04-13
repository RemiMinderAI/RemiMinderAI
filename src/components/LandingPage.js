import React, { useState, useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';
import howItWorksImage from '../assets/coverpage.png';
import elderlyImage from '../assets/user-elderly-caregiver.jpg';
import familyImage from '../assets/user-family.jpg';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Mic, FileText, Bell, Shield, Heart, Brain, Clock, Users, 
  ArrowRight, CheckCircle2, Smartphone, Apple, Star,
  Lock, Zap, Globe, Maximize2
} from "lucide-react";
import ProductDemo from "./ProductDemo";
import logo from '../assets/RemiMinder_logo_512.png';

const MAILING_LIST_URL = "https://docs.google.com/forms/d/e/1FAIpQLScUUVtqWYyrDdnrfWDLK57QQVWVqwjIBbkoPz1DfXvBmkUaKw/viewform?usp=sharing&ouid=115359110800847240110";
const ANDROID_URL = "https://play.google.com/apps/internaltest/4701094525127045534";

const LandingPage = () => {
  localStorage.setItem("onboarding_complete", true);

  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#how-it-works") {
      const el = document.getElementById("how-it-works");
      el?.scrollIntoView({ behavior: "smooth" });
    }
    if (location.search.includes("fullscreen=true")) {
      setIsFullScreen(true);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  const steps = [
    {
      icon: <Mic className={styles.stepIcon} />,
      title: "Record & Capture",
      description: "Easily record doctor visits and medical conversations with one tap.",
      number: "01"
    },
    {
      icon: <FileText className={styles.stepIcon} />,
      title: "Summarize & Organize",
      description: "Get structured AI summaries of your visits.",
      number: "02"
    },
    {
      icon: <Bell className={styles.stepIcon} />,
      title: "Remind & Support",
      description: "Smart reminders for medications and follow-ups.",
      number: "03"
    },
    {
      icon: <Shield className={styles.stepIcon} />,
      title: "Privacy First",
      description: "Encrypted, secure, and always under your control.",
      number: "04"
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Peace of Mind",
      description: "Everything from your healthcare visits is captured and organized.",
      stat: "95%",
      statLabel: "feel more in control",
    },
    {
      icon: Brain,
      title: "Better Health Outcomes",
      description: "Improved adherence through clear guidance.",
      stat: "3x",
      statLabel: "better adherence",
    },
    {
      icon: Clock,
      title: "Time Saved",
      description: "No more re-reading notes or missing instructions.",
      stat: "10hrs",
      statLabel: "saved per month",
    },
    {
      icon: Users,
      title: "Family Connection",
      description: "Keep caregivers aligned in real time.",
      stat: "100%",
      statLabel: "family alignment",
    },
  ];

  return (
    <div className={styles.container}>

      {/* HERO (REBUILT FOR INVESTOR CLARITY) */}
      <main className={styles.heroSection} ref={heroRef}>

        <div className={styles.leftPanel}>

          <div className={styles.aiTag}>
            Smart AI for Health & Care Coordination
          </div>

          <h1 className={styles.title}>
            Turn doctor visits into <br />
            <span className={styles.highlightText}>clear, actionable care plans</span>
          </h1>

          <p className={styles.description}>
            RemiMinderAI listens to medical conversations, extracts key instructions, 
            and transforms them into simple reminders for seniors and caregivers.
          </p>

          {/* CTA (UPGRADED) */}
          <div className={styles.buttonGroup}>

            <a href={MAILING_LIST_URL} className={styles.primaryButton}>
              Join Beta <ArrowRight size={16} />
            </a>

            <a href={ANDROID_URL} className={styles.androidButton}>
              <Smartphone size={16} />
              Download Android
            </a>

            <button className={styles.iosButton} disabled>
              <Apple size={16} />
              iOS Soon
            </button>

            {/* DISTINCT DEMO CTA */}
            <button
              onClick={() => setIsFullScreen(true)}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#6366f1,#a855f7)",
                color: "white",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(99,102,241,0.3)"
              }}
            >
              ⚡ Try Me Demo
            </button>

          </div>

          <div className={styles.trustRow}>
            <div>Encrypted</div>
            <div>HIPAA-ready</div>
            <div>AI-powered</div>
          </div>

        </div>

        {/* RIGHT PANEL (UNCHANGED) */}
        <div className={styles.rightPanel}>
          <div className={styles.phoneHeroWrapper}>
            <img
              src={require('../assets/Home_Screen.png')}
              className={styles.phoneHeroImage}
              alt="App"
            />
          </div>
        </div>

      </main>

      {/* SOCIAL PROOF (UNCHANGED) */}
      <div className={styles.socialProofBar}>
        <span>Built for caregivers & families</span>
        <span>Early beta validated</span>
        <span>Zero to MVP in weeks</span>
      </div>

      {/* EVERYTHING BELOW UNCHANGED */}
      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <img src={howItWorksImage} alt="" />
      </section>

      {/* Benefits */}
      <section id="benefits" className={styles.benefitsSection}>
        {benefits.map((b, i) => (
          <div key={i}>
            <b.icon />
            <h3>{b.title}</h3>
            <p>{b.description}</p>
          </div>
        ))}
      </section>

      {/* CTA SECTION (SIMPLIFIED + INVESTOR STYLE) */}
      <section className={styles.ctaSection}>

        <h2>Ready to improve patient care outcomes?</h2>

        <p>
          Join early access or try the demo experience instantly.
        </p>

        <div className={styles.ctaButtonGroup}>

          <a href={MAILING_LIST_URL} className={styles.ctaPrimaryButton}>
            Request Access
          </a>

          <a href={ANDROID_URL} className={styles.ctaAndroidButton}>
            Download Android
          </a>

          <button
            onClick={() => setIsFullScreen(true)}
            style={{
              marginTop: "10px",
              background: "linear-gradient(135deg,#6366f1,#a855f7)",
              color: "white",
              padding: "14px 20px",
              borderRadius: "14px",
              border: "none",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            ⚡ Try Me Demo
          </button>

        </div>

      </section>

      {/* FULLSCREEN DEMO (UNCHANGED) */}
      {isFullScreen && (
        <div onClick={() => setIsFullScreen(false)}>
          <ProductDemo />
        </div>
      )}

    </div>
  );
};

export default LandingPage;