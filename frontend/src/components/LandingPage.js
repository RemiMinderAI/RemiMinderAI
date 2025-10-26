import React from 'react';
import styles from './LandingPage.module.css';
import heroImage from '../assets/hero-ai-orb.jpg'; 
import howItWorksImage from '../assets/how-it-works-visual.jpg';
import elderlyImage from '../assets/user-elderly-caregiver.jpg';
import familyImage from '../assets/user-family.jpg';
import { useNavigate } from "react-router-dom";
import { 
  Mic, FileText, Bell, Shield, Heart, Brain, Clock, Users, 
  User, ArrowRight, CheckCircle2 
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate("/signin");
  };

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
        <div className={styles.logo}>
          <div className={styles.headerLogoIcon}>RM</div> {/* logo box */}
          RemiMinderAI
        </div>
        <nav className={styles.nav}>
          <a href="#how-it-works">How It Works</a>
          <a href="#who-its-for">Who It's For</a>
          <a href="#benefits">Benefits</a>
        </nav>
        <button onClick={goToSignIn} className={styles.signInButton}>Sign In</button>
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
            <button 
              onClick={() => navigate('/register/patient')} 
              className={styles.primaryButton}
            >
              Register as Patient&nbsp;<ArrowRight size={16} />
            </button>
            <button 
              onClick={() => navigate('/register/caregiver')} 
              className={styles.secondaryButton}
            >
              Register as Caregiver&nbsp;<ArrowRight size={16} />
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
          <img 
            src={heroImage} 
            alt="Healthcare professional holding a glowing icon" 
            className={styles.heroImage} 
          />
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
              Join thousands of families already using RemiMinder. Choose your
              path to get started.
            </p>
          </div>

          <div className={styles.ctaCardWrapper}>
            <div className={styles.ctaCard}>
              <div className={styles.userOptions}>
                {/* Patient Card */}
                <button
                  onClick={() => navigate("/register/patient")}
                  className={styles.ctaUserCard}
                >
                  <div className={styles.iconBox}>
                    <User size={24} />
                  </div>
                  <div className={styles.userContent}>
                    <h3>I'm a Patient</h3>
                    <p>Record your doctor visits, track your health journey, and never forget important details.</p>
                    <span className={styles.ctaLink}>
                      Get Started <ArrowRight size={16} />
                    </span>
                  </div>
                </button>

                {/* Caregiver Card */}
                <button
                  onClick={() => navigate("/register/caregiver")}
                  className={`${styles.ctaUserCard} ${styles.caregiverCard}`}
                >
                  <div className={styles.iconBox}>
                    <Users size={24} />
                  </div>
                  <div className={styles.userContent}>
                    <h3>I'm a Caregiver</h3>
                    <p>Stay connected with your loved ones' health, manage medications, and coordinate care easily.</p>
                    <span className={styles.ctaLink2}>
                      Get Started <ArrowRight size={16} />
                    </span>
                  </div>
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
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.brandLogo}>
                <div className={styles.brandIcon}>RM</div>
                <span className={styles.brandName}>RemiMinderAI</span>
              </div>
              <p className={styles.footerText}>
                Your healthcare, remembered and reimagined
              </p>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Product</h4>
              <ul className={styles.footerList}>
                <li><a href="#">Features</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Company</h4>
              <ul className={styles.footerList}>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Legal</h4>
              <ul className={styles.footerList}>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2025 RemiMinderAI. All rights reserved.</p>
            <div className={styles.socialLinks}>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
