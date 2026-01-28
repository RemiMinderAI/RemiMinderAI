import React from "react";
import styles from "./AboutPage.module.css";
import { useNavigate } from "react-router-dom";
import { Linkedin } from 'lucide-react';
import logo from '../assets/RemiMinder_logo_512.png';
import profilephoto1 from '../assets/profilephotos/tina.jfif';
import profilephoto2 from '../assets/profilephotos/jibin.jfif';
import profilephoto3 from '../assets/profilephotos/sri.jfif';
import profilephoto4 from '../assets/profilephotos/cromwell.jfif';

const AboutPage = () => {
    const navigate = useNavigate();
  
    const goToSignIn = () => navigate("/sign-in");

    const techStack = [
      {
        name: "Mobile Interface",
        bio: "Built with Flutter for a high-performance, cross-platform experience (iOS/Android) ensuring rapid feature parity.",
      },
      {
        name: "Mobile Interface",
        bio: "We utilize Google ML Kit for on-device OCR and Google Document AI for high-accuracy extraction of complex medical transcripts.",
      },
      {
        name: "Generative AI",
        bio: "Powered by Google Gemini via Vertex AI to provide real-time visit transcriptions and personalized health action plans.",
      },
    ]

    const cloudInfrastructure = [
      {
        name: "Backend",
        bio: "High-speed FastAPI (Python) services hosted on Google Cloud Run for serverless, auto-scaling performance.",
      },
      {
        name: "Database",
        bio: "Google Cloud SQL (PostgreSQL) for robust, relational storage of patient records.",
      },
      {
        name: "Security & Compliance",
        bio: "Firebase Auth for secure identity management and Google Cloud Storage for encrypted PHI (Protected Health Information).",
      },
    ]

    const teamMembers = [
      {
        name: "Paramita Malakar",
        role: "Product & AI/ML Leader",
        bio: "Product & Quality Assurance Leader focused on transforming ideas into impactful AI and enterprise solutions.",
        linkedin: "https://www.linkedin.com/in/paramitam/",
        initials: "PM",
        photo: profilephoto1,
      },
      // {
      //   name: "Jibin Kunjumon",
      //   role: "Backend Engineer & AI/ML Developer",
      //   bio: "Backend Engineer & AI Developer specializing in intelligent systems powered by Large Language Models, multi-agent workflows, and production-grade backend architectures.",
      //   linkedin: "https://www.linkedin.com/in/jibin-kunjumon-9bbb3542/",
      //   initials: "JK",
      //   photo: profilephoto2,
      // },
      {
        name: "Sridevi T",
        role: "AI Engineer",
        bio: "Full-Stack AI Engineer with 6 years of software engineering experience, specializing in designing and delivering production-ready Generative AI systems.",
        linkedin: "https://www.linkedin.com/in/sridevipt/",
        initials: "ST",
        photo: profilephoto3,
      },
      {
        name: "Cromwell De Guzman",
        role: "AI Designer",
        bio: "Front-end developer and game designer with AI UI/UX experience.",
        linkedin: "https://www.linkedin.com/in/cromwell-de-guzman-a19482218/",
        initials: "CD",
        photo: profilephoto4,
      },
    ];

  return (
    <main className={styles.container}>
      {/* --- HEADER --- */}
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
            RemiMinder is an AI-native health management platform built to simplify healthcare for families. 
            By automating the digitization of medical records and intelligently coordinating care schedules, 
            we ensure that critical health milestones are never missed. Our platform transforms fragmented 
            medical data into actionable, low-latency insights for patients and caregivers globally.
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

      {/* --- TECH STACK --- */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Our Core Tech Stack</h2>

        <div className={styles.teamGrid}>
          {techStack.map((member) => (
            <div key={member.name} className={styles.teamCard2}>
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CLOUD INFRASTRUCTURE --- */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Cloud Infrastructure</h2>

        <div className={styles.teamGrid}>
          {cloudInfrastructure.map((member) => (
            <div key={member.name} className={styles.teamCard2}>
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- OUR TEAM --- */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Our Team</h2>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.name} className={styles.teamCard}>
              <div className={styles.avatar}>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`${member.name} profile`}
                    className={styles.avatarImg}
                  />
                ) : (
                  <span>{member.initials}</span>
                )}
              </div>

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
                <span>LinkedIn</span>
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
              <strong>Industry:</strong> Wellness and Fitness Services
            </li>
            <li>
              <strong>Company Size:</strong> 2-10 employees
            </li>
            <li>
              <strong>Headquarters:</strong> San Jose, California
            </li>
            <li>
              <strong>Founded:</strong> 2025
            </li>
            <li>
              <strong>Email:</strong> Team@remiminderai.com
            </li>
            <li>
              <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/company/remiminderai/" target="_blank">linkedin.com/company/remiminderai</a>
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
