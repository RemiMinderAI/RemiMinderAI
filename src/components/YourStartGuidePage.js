import React, { useEffect, useState } from "react";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import { ANDROID_URL, CONTACT_EMAIL, IOS_URL, trackDownloadClick } from "../constants/site";
import landingStyles from "./LandingPage.module.css";
import styles from "./YourStartGuidePage.module.css";

const CONTENTS = [
  {
    id: "getting-started",
    label: "1. Getting Started",
    children: [
      ["system-requirements", "1.1 System Requirements"],
      ["download-install", "1.2 Download and Install"],
      ["create-account", "1.3 Create Your Account"],
      ["select-role", "1.4 Select Your Role"],
    ],
  },
  {
    id: "recording-visit",
    label: "2. Recording a Doctor Visit",
    children: [
      ["before-recording", "2.1 Before You Record"],
      ["start-recording", "2.2 Start a Recording"],
      ["stop-save", "2.3 Stop and Save"],
    ],
  },
  {
    id: "visit-summaries",
    label: "3. Visit Summaries",
    children: [
      ["viewing-summary", "3.1 Viewing Your Summary"],
      ["sharing-summary", "3.2 Sharing with Family or Caregivers"],
      ["summary-language", "3.3 Changing Summary Language"],
    ],
  },
  {
    id: "care-team",
    label: "4. Care Team",
    children: [
      ["invite-caregiver", "4.1 Inviting a Caregiver or Family Member"],
      ["accept-invite", "4.2 Accepting an Invite (Caregiver)"],
      ["manage-care-team", "4.3 Managing Your Care Team"],
    ],
  },
  {
    id: "reminders",
    label: "5. Reminders",
    children: [
      ["vox-reminder", "5.1 Creating a Reminder with Vox (Voice)"],
      ["manual-reminder", "5.2 Creating a Reminder Manually"],
      ["reminder-types", "5.3 Reminder Types"],
      ["reminder-fires", "5.4 When a Reminder Fires"],
      ["caregiver-view", "5.5 Caregiver View"],
    ],
  },
  {
    id: "scanning-documents",
    label: "6. Scanning Documents",
    children: [
      ["scan-document", "6.1 Scanning a Prescription or Lab Report"],
      ["view-documents", "6.2 Viewing Scanned Documents"],
    ],
  },
  {
    id: "profile-settings",
    label: "7. Profile and Settings",
    children: [
      ["change-language", "7.1 Changing Your Summary Language"],
      ["delete-account", "7.2 Deleting Your Account"],
    ],
  },
];

function TableOfContents({ mobile = false }) {
  if (mobile) {
    const navigateTo = (event) => {
      const id = event.target.value;
      if (!id) return;
      window.history.replaceState(null, "", `#${id}`);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      event.target.value = "";
    };

    return (
      <div className={styles.mobileToc}>
        <label htmlFor="guide-section">On this page</label>
        <select id="guide-section" defaultValue="" onChange={navigateTo}>
          <option value="" disabled>
            Jump to a section
          </option>
          {CONTENTS.map((section) => (
            <React.Fragment key={section.id}>
              <option value={section.id}>{section.label}</option>
              {section.children.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </React.Fragment>
          ))}
        </select>
      </div>
    );
  }

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>On this page</p>
      <ol>
        {CONTENTS.map((section) => (
          <li key={section.id}>
            <a className={styles.tocMain} href={`#${section.id}`}>
              {section.label}
            </a>
            <ol>
              {section.children.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MainSection({ id, title, children }) {
  return (
    <section id={id} className={styles.mainSection}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Subsection({ id, title, children }) {
  return (
    <section id={id} className={styles.subsection}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export default function YourStartGuidePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = "Your Start Guide | RemiMinderAI";
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader scrolled={scrolled} />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>RemiMinderAI User&apos;s Guide</p>
          <h1>Your Start Guide</h1>
          <p className={styles.heroLead}>
            Everything you need to record visits, review summaries, coordinate
            care, set reminders, and keep health documents organized.
          </p>
          <div className={styles.meta}>
            <span>Version 1.0</span>
            <span>Last updated September 2026</span>
            <span>iOS and Android</span>
          </div>
        </div>
      </header>

      <MobileGuideNavigation />

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <TableOfContents />
        </aside>

        <article className={styles.content}>
          <MainSection id="getting-started" title="1. Getting Started">
            <Subsection id="system-requirements" title="1.1 System Requirements">
              <ul>
                <li>iPhone running iOS 15 or later</li>
                <li>Android phone running Android 10 or later</li>
                <li>
                  Active internet connection required for recording, summaries,
                  and syncing
                </li>
                <li>A valid email address for account creation</li>
              </ul>
            </Subsection>

            <Subsection id="download-install" title="1.2 Download and Install">
              <p>Download RemiMinderAI from:</p>
              <ul>
                <li>Apple App Store — search &ldquo;RemiMinderAI&rdquo;</li>
                <li>Google Play Store — search &ldquo;RemiMinderAI&rdquo;</li>
                <li>
                  Or visit{" "}
                  <a href="https://www.remiminderai.com">www.remiminderai.com</a>{" "}
                  for direct download links
                </li>
              </ul>
            </Subsection>

            <Subsection id="create-account" title="1.3 Create Your Account">
              <ol>
                <li>
                  Open the app and tap <strong>Sign Up</strong>.
                </li>
                <li>
                  Log in using your <strong>Google</strong> or{" "}
                  <strong>Apple</strong> credentials, or create a new account by
                  entering your first name, last name, and email address.
                </li>
                <li>
                  A confirmation email will be sent to the email address you
                  provided.
                </li>
                <li>
                  Open the email and tap the confirmation link to verify your
                  account.
                </li>
                <li>
                  Return to the app and <strong>sign in</strong>.
                </li>
              </ol>
            </Subsection>

            <Subsection id="select-role" title="1.4 Select Your Role">
              <p>After signing in, you will be asked to select your role:</p>
              <ul>
                <li>
                  <strong>Patient</strong> — You are tracking your own health.
                  You will have access to visit recording, summaries, reminders,
                  and document scanning.
                </li>
                <li>
                  <strong>Caregiver</strong> — You are supporting someone else.
                  You will be able to view their summaries, track their reminders,
                  and see their care updates from your{" "}
                  <strong>Caregiver Dashboard</strong>.
                </li>
              </ul>
              <p>
                Your role determines your dashboard view and the features
                available to you.
              </p>
            </Subsection>
          </MainSection>

          <MainSection id="recording-visit" title="2. Recording a Doctor Visit">
            <Subsection id="before-recording" title="2.1 Before You Record">
              <ul>
                <li>
                  Inform your doctor that you will be recording the visit for
                  personal use. Most providers are comfortable with this.
                </li>
                <li>
                  RemiMinderAI records in English by default. If your appointment
                  will be in another language, change the language before
                  recording: go to <strong>Profile → Language</strong> and select
                  the appropriate language.
                </li>
                <li>
                  Ensure your phone has sufficient battery and a stable internet
                  connection.
                </li>
              </ul>
            </Subsection>

            <Subsection id="start-recording" title="2.2 Start a Recording">
              <ol>
                <li>
                  Open the app and tap <strong>Visit</strong>.
                </li>
                <li>Review and check the consent checkboxes.</li>
                <li>
                  Tap the <strong>Record</strong> button.
                </li>
                <li>
                  Place your phone face-down or in your pocket. RemiMinderAI will
                  continue capturing the conversation.
                </li>
              </ol>
            </Subsection>

            <Subsection id="stop-save" title="2.3 Stop and Save">
              <ol>
                <li>
                  When the appointment is over, open the app and tap{" "}
                  <strong>Stop</strong>.
                </li>
                <li>The recording is saved automatically.</li>
                <li>
                  An AI-generated summary will be available within minutes under{" "}
                  <strong>Overview</strong>.
                </li>
              </ol>
              <aside className={styles.tip}>
                No manual note-taking is required. RemiMinderAI captures the full
                conversation and extracts the key information.
              </aside>
            </Subsection>
          </MainSection>

          <MainSection id="visit-summaries" title="3. Visit Summaries">
            <Subsection id="viewing-summary" title="3.1 Viewing Your Summary">
              <ol>
                <li>
                  From your <strong>Dashboard</strong>, tap{" "}
                  <strong>Overview</strong>.
                </li>
                <li>Tap the visit you want to review.</li>
                <li>
                  The summary includes:
                  <ul>
                    <li>Diagnosis or condition discussed</li>
                    <li>Medication changes or new prescriptions</li>
                    <li>Follow-up instructions and dates</li>
                    <li>Doctor&apos;s recommendations</li>
                  </ul>
                </li>
              </ol>
            </Subsection>

            <Subsection
              id="sharing-summary"
              title="3.2 Sharing with Family or Caregivers"
            >
              <ol>
                <li>Open the visit summary.</li>
                <li>
                  Toggle the <strong>Share</strong> switch to{" "}
                  <strong>On</strong>.
                </li>
                <li>
                  Any caregiver or family member connected to your account will
                  be able to view the summary from their{" "}
                  <strong>Caregiver Dashboard</strong>.
                </li>
              </ol>
              <aside className={styles.tip}>
                Sharing is optional. You control which summaries are visible to
                your Care Team.
              </aside>
            </Subsection>

            <Subsection
              id="summary-language"
              title="3.3 Changing Summary Language"
            >
              <p>
                RemiMinderAI supports summaries in 10 languages. To change:
              </p>
              <ol>
                <li>
                  Go to <strong>Profile → Language</strong>.
                </li>
                <li>Select your preferred language.</li>
                <li>
                  All future summaries will generate in the selected language.
                </li>
              </ol>
              <aside className={styles.note}>
                <strong>Note:</strong> The app interface and reminder
                notifications remain in English. The language setting applies to
                AI-generated visit summaries only.
              </aside>
            </Subsection>
          </MainSection>

          <MainSection id="care-team" title="4. Care Team">
            <Subsection
              id="invite-caregiver"
              title="4.1 Inviting a Caregiver or Family Member"
            >
              <ol>
                <li>
                  From your <strong>Patient Dashboard</strong>, tap{" "}
                  <strong>Care Team</strong>.
                </li>
                <li>
                  Tap <strong>Invite a Caregiver</strong>.
                </li>
                <li>
                  Enter the person&apos;s name, email address, and their
                  relationship to you (e.g., daughter, son, spouse, aide).
                </li>
                <li>
                  Tap <strong>Send Invite</strong>.
                </li>
              </ol>
              <p>An invitation email will be sent to the person you invited.</p>
            </Subsection>

            <Subsection
              id="accept-invite"
              title="4.2 Accepting an Invite (Caregiver)"
            >
              <p>
                If you have received an invite to join someone&apos;s Care Team:
              </p>
              <ol>
                <li>Open the invitation email from RemiMinderAI.</li>
                <li>Tap the confirmation link.</li>
                <li>
                  Download and open the RemiMinderAI app if you haven&apos;t
                  already.
                </li>
                <li>
                  Log in and select your role — <strong>Caregiver</strong>.
                </li>
                <li>
                  You are now connected. Shared summaries, reminders, and care
                  updates will appear on your{" "}
                  <strong>Caregiver Dashboard</strong>.
                </li>
              </ol>
              <aside className={styles.tip}>
                Alternatively, you can accept a pending invite inside the app by
                going to <strong>Care Team → Pending Invites</strong>.
              </aside>
            </Subsection>

            <Subsection
              id="manage-care-team"
              title="4.3 Managing Your Care Team"
            >
              <ul>
                <li>
                  To view your current Care Team members, go to{" "}
                  <strong>Care Team</strong> from your{" "}
                  <strong>Dashboard</strong>.
                </li>
                <li>
                  To remove a caregiver, tap their name and select{" "}
                  <strong>Remove</strong>.
                </li>
                <li>
                  Removed caregivers will no longer have access to your summaries
                  or reminders.
                </li>
              </ul>
            </Subsection>
          </MainSection>

          <MainSection id="reminders" title="5. Reminders">
            <Subsection
              id="vox-reminder"
              title="5.1 Creating a Reminder with Vox (Voice)"
            >
              <p>The fastest way to set a reminder.</p>
              <ol>
                <li>
                  Tap <strong>Vox</strong> from your{" "}
                  <strong>Dashboard</strong>.
                </li>
                <li>
                  Speak your reminder naturally. Examples:
                  <div className={styles.voiceExamples}>
                    <blockquote>
                      &ldquo;Remind me to take my thyroid pill at 8 AM every
                      morning.&rdquo;
                    </blockquote>
                    <blockquote>
                      &ldquo;Set an appointment reminder for Dr. Patel on October
                      3rd at 2 PM.&rdquo;
                    </blockquote>
                    <blockquote>
                      &ldquo;Set a task to pick up Mom&apos;s prescription on
                      Friday at 10 AM.&rdquo;
                    </blockquote>
                  </div>
                </li>
                <li>
                  RemiMinderAI creates the reminder automatically from your voice.
                </li>
              </ol>
              <aside className={styles.tip}>
                No special commands are required. Speak the way you normally
                would.
              </aside>
            </Subsection>

            <Subsection
              id="manual-reminder"
              title="5.2 Creating a Reminder Manually"
            >
              <ol>
                <li>
                  Tap <strong>Reminders</strong> from your{" "}
                  <strong>Dashboard</strong>.
                </li>
                <li>
                  Tap <strong>[+]</strong> to add a new reminder.
                </li>
                <li>
                  Enter the following:
                  <ul>
                    <li>Medication name</li>
                    <li>Dosage (e.g., 10 mg, 5 ml, 1 tablet, 2000 IU)</li>
                    <li>Schedule (see 5.3 below)</li>
                  </ul>
                </li>
                <li>
                  Add optional notes — &ldquo;take with food or meal,&rdquo;
                  &ldquo;after breakfast or meal.&rdquo; These will appear in the
                  reminder notification.
                </li>
                <li>
                  Tap <strong>Create Reminder</strong>.
                </li>
              </ol>
            </Subsection>

            <Subsection id="reminder-types" title="5.3 Reminder Types">
              <p>RemiMinderAI supports three types of reminders:</p>
              <h4>Medication Reminders</h4>
              <ul>
                <li>Once, twice, or three times daily at specific times</li>
                <li>
                  Every set number of hours (for pain medications or antibiotics)
                </li>
                <li>On specific days of the week</li>
              </ul>
              <h4>Appointment Reminders</h4>
              <ul>
                <li>
                  Single date and time for upcoming doctor visits or lab tests
                </li>
              </ul>
              <h4>Tasks</h4>
              <ul>
                <li>
                  One-time or recurring tasks such as &ldquo;order
                  refills,&rdquo; &ldquo;pick up prescription,&rdquo; or
                  &ldquo;schedule follow-up&rdquo;
                </li>
                <li>
                  Tasks appear under the <strong>Tasks</strong> section on your{" "}
                  <strong>Home</strong> screen
                </li>
              </ul>
            </Subsection>

            <Subsection id="reminder-fires" title="5.4 When a Reminder Fires">
              <p>
                When a reminder is due, RemiMinderAI sends a push notification to
                your phone — even when the phone is locked.
              </p>
              <p>To respond:</p>
              <ul>
                <li>Tap the notification or open the app.</li>
                <li>
                  Mark the reminder as <strong>Done</strong> or tap{" "}
                  <strong>Snooze</strong>.
                </li>
              </ul>
            </Subsection>

            <Subsection id="caregiver-view" title="5.5 Caregiver View">
              <p>
                Connected caregivers can see all active reminders from their{" "}
                <strong>Caregiver Dashboard</strong>, including:
              </p>
              <ul>
                <li>Upcoming dose times</li>
                <li>Whether a dose was marked as done</li>
                <li>Missed reminders</li>
              </ul>
              <aside className={styles.tip}>
                Caregivers receive visibility only — the patient or person being
                cared for receives the notification.
              </aside>
            </Subsection>
          </MainSection>

          <MainSection id="scanning-documents" title="6. Scanning Documents">
            <Subsection
              id="scan-document"
              title="6.1 Scanning a Prescription or Lab Report"
            >
              <ol>
                <li>
                  Tap <strong>Visit → Capture &amp; Scan</strong>.
                </li>
                <li>
                  Accept the consent prompt and tap <strong>Scan</strong>.
                </li>
                <li>
                  Point your camera at the prescription label, lab report, or
                  discharge paper.
                </li>
                <li>
                  RemiMinderAI uses OCR to read the document and store it clearly
                  in the app.
                </li>
              </ol>
            </Subsection>

            <Subsection
              id="view-documents"
              title="6.2 Viewing Scanned Documents"
            >
              <p>
                Scanned documents are stored alongside your visits for easy
                access.
              </p>
              <ol>
                <li>
                  Go to <strong>Overview</strong>.
                </li>
                <li>Tap the relevant visit.</li>
                <li>Scanned documents will appear under the visit record.</li>
              </ol>
            </Subsection>
          </MainSection>

          <MainSection id="profile-settings" title="7. Profile and Settings">
            <Subsection
              id="change-language"
              title="7.1 Changing Your Summary Language"
            >
              <p>
                See <a href="#summary-language">Section 3.3</a>.
              </p>
            </Subsection>

            <Subsection id="delete-account" title="7.2 Deleting Your Account">
              <ol>
                <li>
                  Go to <strong>Profile → Delete Account</strong>.
                </li>
                <li>Confirm deletion.</li>
              </ol>
              <aside className={styles.warning}>
                <strong>Please note:</strong>
                <ul>
                  <li>
                    Once your account is deleted, you will no longer be able to
                    log in.
                  </li>
                  <li>
                    All visit summaries, scanned documents, reminders, and Care
                    Team connections will be permanently removed.
                  </li>
                  <li>This action cannot be undone.</li>
                </ul>
              </aside>
              <p>
                You can also request account deletion by emailing{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </Subsection>
          </MainSection>

          <div className={styles.signoff}>
            <p>
              <strong>RemiMinderAI</strong>
              <br />
              Your AI health companion — so nothing gets forgotten.
            </p>
            <p>
              <a href="https://www.remiminderai.com">www.remiminderai.com</a>
              {" | "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <br />
              Available on the App Store and Google Play
            </p>
          </div>
        </article>
      </main>

      <section className={styles.cta} aria-labelledby="guide-cta-heading">
        <h2 id="guide-cta-heading">Ready to get started?</h2>
        <p>Download the app — no credit card needed.</p>
        <div className={styles.storeButtons}>
          <a
            href={IOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackDownloadClick}
          >
            <img src="/images/app-store-badge.svg" alt="Download on the App Store" />
          </a>
          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackDownloadClick}
          >
            <img src="/images/google-play-badge.png" alt="Get it on Google Play" />
          </a>
        </div>
        <p className={styles.contact}>
          Questions? Reach us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function MobileGuideNavigation() {
  return <TableOfContents mobile />;
}
