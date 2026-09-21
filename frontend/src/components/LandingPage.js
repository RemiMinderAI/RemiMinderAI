import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import { useLocation } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import TestimonialsSection from "./TestimonialsSection";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import ProductWorkflow from "./ProductWorkflow";
import RealLifeSection from "./RealLifeSection";
import AnyLanguageSection from "./AnyLanguageSection";
import WhyNotGroupTextSection from "./WhyNotGroupTextSection";
import { Mic, CheckCircle2, Bell, Sparkles } from "lucide-react";

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

  return (
    <div className={styles.container}>

      <MarketingHeader scrolled={scrolled} />

      <main id="home">
        <HeroSection />
        <ProductWorkflow />
      </main>

      <section id="who-its-for" className={styles.whoItsFor}>
        <div className={styles.sectionLabel}>WHO IT&apos;S FOR</div>
        <h2 className={styles.sectionTitle}>
          Built for <span className={styles.tealText}>family caregivers</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          For family caregivers supporting loved ones with medical appointments.
          RemiMinderAI helps everyone stay aligned on care plans — even if you
          weren&apos;t in the room.
        </p>

        <div className={styles.whoFeatured}>
          <div className={styles.whoFeaturedImageWrap}>
            <img
              src="/images/who-its-for-family-table.jpg"
              alt="Adult children and a parent sitting at the kitchen table with prescriptions and appointment notes"
              className={styles.whoFeaturedImage}
            />
          </div>
          <div className={styles.whoFeaturedCopy}>
            <div className={styles.personaTag}>Family caregivers</div>
            <h3>The appointment lasted 12 minutes. The questions last for weeks.</h3>
            <p>
              After the visit, families are left piecing together medications,
              instructions, and follow-ups from incomplete memories. RemiMinderAI
              turns that conversation into a shared care plan the whole family can
              revisit from anywhere.
            </p>
            <p className={styles.whoFeaturedClose}>
              Help families stay aligned on care plans from anywhere.
            </p>
          </div>
        </div>
      </section>

      <WhyNotGroupTextSection />
      <RealLifeSection />
      <AnyLanguageSection />
      <TestimonialsSection />

      <section className={styles.remiVoxSection} aria-labelledby="remivox-heading">
        <div className={styles.remiVoxInner}>
          <div className={styles.remiVoxCopy}>
            <div className={styles.remiVoxBadge}>
              <Sparkles size={15} aria-hidden="true" />
              New in the app
            </div>
            <h2 id="remivox-heading" className={styles.remiVoxTitle}>
              Say it once. <span>RemiVox</span> helps you remember.
            </h2>
            <p className={styles.remiVoxDescription}>
              Turn spoken words into reminders and ask questions about your health
              records&mdash;all without typing.
            </p>
            <div className={styles.remiVoxOffer}>
              <CheckCircle2 size={20} aria-hidden="true" />
              <span><strong>Try RemiVox free for 14 days</strong></span>
            </div>
            <a className={styles.remiVoxCta} href="#get-started">
              Download the app now
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div
            className={styles.remiVoxDemo}
            role="img"
            aria-label="RemiVox setting a medication reminder from a voice request"
          >
            <div className={styles.voiceOrb} aria-hidden="true">
              <span className={styles.voiceRing} />
              <span className={styles.voiceRing} />
              <span className={styles.voiceRing} />
              <Mic size={34} strokeWidth={2} />
            </div>
            <div className={styles.voiceWave} aria-hidden="true">
              {[18, 30, 44, 26, 52, 36, 22, 42, 28].map((height, index) => (
                <span key={index} style={{ "--wave-height": `${height}px` }} />
              ))}
            </div>
            <p className={styles.voicePrompt}>
              &ldquo;Remind me to take my medication at 8 PM.&rdquo;
            </p>
            <div className={styles.voiceConfirmation}>
              <span className={styles.voiceConfirmationIcon}>
                <Bell size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>Reminder set</strong>
                Today at 8:00 PM
              </span>
              <CheckCircle2 size={21} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <p className={styles.medicalDisclaimer}>
        RemiMinderAI is not a medical device and does not provide medical advice, diagnosis, or
        treatment. Always follow your healthcare provider&apos;s instructions.
      </p>
      <SiteFooter />

    </div>
  );
};

export default LandingPage;
