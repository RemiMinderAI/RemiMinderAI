import React from "react";
import styles from "./AboutPage.module.css";
import { useNavigate } from "react-router-dom";
import { Linkedin } from 'lucide-react';

const AboutPage = () => {
    const navigate = useNavigate();
  
    const goToSignIn = () => navigate("/sign-in");

    const teamMembers = [
      {
        name: "Paramita Malakar",
        role: "Product & AI/ML Leader",
        bio: "Product & Quality Assurance Leader focused on transforming ideas into impactful AI and enterprise solutions.",
        linkedin: "https://www.linkedin.com/in/paramitam/",
        initials: "PM",
      },
      {
        name: "Jibin Kunjumon",
        role: "Backend Engineer & AI/ML Developer",
        bio: "Backend Engineer & AI Developer specializing in intelligent systems powered by Large Language Models, multi-agent workflows, and production-grade backend architectures.",
        linkedin: "https://www.linkedin.com/in/jibin-kunjumon-9bbb3542/",
        initials: "JK",
      },
      {
        name: "Sridevi T",
        role: "AI Engineer",
        bio: "Full-Stack AI Engineer with 6 years of software engineering experience, specializing in designing and delivering production-ready Generative AI systems.",
        linkedin: "https://www.linkedin.com/in/sridevipt/",
        initials: "ST",
      },
      {
        name: "Cromwell De Guzman",
        role: "AI Designer",
        bio: "Front-end and game developer with AI UI/UX experience.",
        linkedin: "https://www.linkedin.com/in/cromwell-de-guzman-a19482218/",
        initials: "CD",
      },
    ];

  return (
    <main className={styles.container}>
      {/* --- HEADER --- */}
      <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
          <div className={styles.headerLogoIcon}>RM</div> {/* logo box */}
          RemiMinderAI
        </div>
        <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>Home</a>
            <a href="/?fullscreen=true" className={styles.navLink}>Product Demo</a>
            <a href="/#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="/about" className={styles.navLink}>About</a>
        </nav>
        <button onClick={goToSignIn} className={styles.signInButton}>Sign In</button>
      </header>

      {/* --- HERO --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            About <span className={styles.gradientText}>RemiMinderAI</span>
          </h1>
          <p className={styles.heroSubtitle}>
            RemiMinder is a digital health platform that empowers patients and caregivers to manage
            health information effectively using AI-powered tools. We're building the future of personal health management.
          </p>
        </div>
      </section>

      {/* --- WHAT WE DO & PROBLEMS --- */}
      <section className={styles.businessSection}>
        <div className={styles.sectionGrid}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>What We Do</h2>
            <p>
              <strong>RemiMinder is an AI-powered health management platform</strong> that helps patients record, organize, and share 
              their health information with caregivers and healthcare providers.
            </p>
            <p>
              Our mobile and web application uses advanced speech recognition and natural language processing to 
              transcribe doctor visits, extract key medical information, and generate actionable health insights.
            </p>
            <p>
              The platform connects patients with their family caregivers through a secure dashboard, enabling real-time 
              health monitoring, medication management, and coordinated care—all while maintaining HIPAA-compliant data security.
            </p>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Problems We Solve</h2>
            <ul className={styles.problemList}>
              <li>Patients forget up to 80% of medical information within 24 hours of doctor visits</li>
              <li>Caregivers lack visibility into their loved ones' health status and appointments</li>
              <li>Fragmented health records across multiple providers create gaps in care</li>
              <li>Seniors struggle with complex medication schedules and adherence</li>
              <li>Families waste hours coordinating care through phone calls and texts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- OUR TEAM --- */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Our Team</h2>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.name} className={styles.teamCard}>
              <div className={styles.avatar}>{member.initials}</div>

              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamRole}>{member.role}</p>
              <p className={styles.teamBio}>{member.bio}</p>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedinLink}
              >
                <Linkedin size={16} strokeWidth={1.75} />
                <span>LinkedIn →</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* --- COMPANY INFO --- */}
      <section className={styles.companyInfoSection}>
        <div className={styles.sectionCard}>
          <h2 className={styles.companyInfoSection}>Company Information</h2>

          <ul className={styles.companyInfoList}>
            <li>
              <strong>Company Name:</strong> RemiMinderAI
            </li>
            <li>
              <strong>Founded:</strong> 2025
            </li>
            <li>
              <strong>Industry:</strong> Digital Health / HealthTech
            </li>
            <li>
              <strong>Stage:</strong> Seed / Early Growth
            </li>
            <li>
              <strong>Contact:</strong> remiminderai@gmail.com
            </li>
          </ul>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        {/* <div className={styles.footerContainer}>
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
        </div> */}
        <div className={styles.footerContainer}>
            <p>© 2025 RemiMinderAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default AboutPage;
