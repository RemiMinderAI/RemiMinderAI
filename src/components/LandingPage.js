import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import { useLocation } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import TestimonialsSection from "./TestimonialsSection";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import ProductWorkflow from "./ProductWorkflow";
import RealLifeSection from "./RealLifeSection";
import WhyNotGroupTextSection from "./WhyNotGroupTextSection";

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
