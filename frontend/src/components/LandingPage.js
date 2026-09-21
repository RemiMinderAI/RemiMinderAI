import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import { useLocation } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import TestimonialsSection from "./TestimonialsSection";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import ProductWorkflow from "./ProductWorkflow";
import WhatRemiMinderIsSection from "./WhatRemiMinderIsSection";
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

      <WhatRemiMinderIsSection />
      <RealLifeSection />
      <WhyNotGroupTextSection />
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
