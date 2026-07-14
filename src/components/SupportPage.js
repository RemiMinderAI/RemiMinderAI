import React, { useEffect, useState } from "react";
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./SupportPage.module.css";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";

const FAQ_ITEMS = [
  {
    id: "account",
    question: "How do I create an account or sign in?",
    answer:
      "Download the RemiMinderAI app from the Google Play Store (Android) or join our mailing list to be notified when iOS is available. You can sign in with Google or Apple — no separate password required. If you already have an account, tap Sign In on the welcome screen and choose the same method you used when you signed up.",
  },
  {
    id: "recording",
    question: "How does visit recording work?",
    answer:
      "Before you record, the app asks you to confirm that your doctor has consented to being recorded. Tap Record during your visit, and RemiMinderAI captures the conversation, transcribes it, and generates a plain-language summary with medications, follow-ups, and next steps. Recordings stay in your account unless you choose to share them with an invited caregiver.",
  },
  {
    id: "scanning",
    question: "How does document or prescription scanning work?",
    answer:
      "Tap the scan option in the app and point your camera at a prescription or medical document. The app reads the text on-device and extracts medication names, dosages, and instructions. The image itself is not retained — only the extracted text is saved to your dashboard for reference and reminders.",
  },
  {
    id: "reminders",
    question: "How do reminders and notifications work?",
    answer:
      "RemiMinderAI can remind you about medications and upcoming appointments based on information from your visits and scans. Enable notifications in the app and your device settings to receive alerts. You or your invited caregiver can add, edit, or dismiss reminders at any time from the Reminders screen.",
  },
  {
    id: "caregiver",
    question: "How do I invite a caregiver or manage their access?",
    answer:
      "From your patient dashboard, invite a family member or trusted friend by entering their email address. They receive an invitation to create their own caregiver account. You control what they can see and can modify or revoke access at any time. Caregivers never have independent access without your explicit invitation.",
  },
  {
    id: "billing",
    question: "How do subscriptions and billing work?",
    answer:
      "RemiMinderAI offers a free tier during beta, plus paid Family and Premium plans with monthly or yearly billing. Paid subscriptions are processed securely through Stripe. If you have a billing question or need to update your plan, contact us and include the email address on your account.",
  },
  {
    id: "privacy",
    question: "How can I delete my data or exercise my privacy rights?",
    answer:
      "You can delete individual recordings, reminders, and caregiver invitations inside the app. To delete your full account, open the app and go to Profile → Delete Account, or visit remiminderai.com/delete-account. You can also email team@remiminderai.com or use the form below with the topic \"Privacy or data deletion.\" We respond within one business day. See our Privacy Policy for full details on your rights.",
  },
  {
    id: "bug",
    question: "I found a bug or technical issue — what should I do?",
    answer:
      "We're sorry you ran into trouble. Please send us a message using the form below with the topic \"Bug or technical issue\" and include your device type (e.g. Android 14, Samsung Galaxy), app version if you know it, and what you were doing when the problem occurred. Screenshots are helpful. We aim to respond within one business day.",
  },
  {
    id: "medical",
    question: "Is RemiMinderAI a medical device or source of medical advice?",
    answer:
      "No. RemiMinderAI is a personal recorder and reminder app — not a medical device. It does not provide medical advice, diagnosis, or treatment. Summaries and medication lists are generated from what your doctor said during a visit; they are meant to help you remember, not replace your doctor's instructions. Always consult your healthcare provider with questions about your care.",
  },
];

const TOPIC_OPTIONS = [
  "Account or sign-in",
  "Visit recording",
  "Document scanning",
  "Reminders and notifications",
  "Caregiver access",
  "Subscription or billing",
  "Privacy or data deletion",
  "Bug or technical issue",
  "Other",
];

export default function SupportPage() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={`${pricingStyles.pricingHeader} ${styles.supportHeader}`}
        showMailingList
      />

      <section className={styles.hero} aria-labelledby="support-hero-heading">
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Help &amp; Support</div>
          <h1 id="support-hero-heading" className={styles.heroTitle}>
            How can we help?
          </h1>
          <p className={styles.heroSub}>
            Find answers below or send us a message — we respond within one business day.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-label="Frequently asked questions">
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Frequently asked questions</div>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <details key={item.id} className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  <span>{item.question}</span>
                  <span className={styles.faqToggle} aria-hidden="true">
                    <span className={styles.faqToggleOpen}>+</span>
                    <span className={styles.faqToggleClose}>×</span>
                  </span>
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="contact-heading">
        <div className={styles.sectionInner}>
          <div className={styles.contactCard}>
            <h2 id="contact-heading" className={styles.contactTitle}>
              Send us a message
            </h2>
            <p className={styles.contactSub}>
              We respond within one business day, Monday – Friday.
            </p>

            {submitted ? (
              <div className={styles.confirmation} role="status">
                ✓ Message sent — we&apos;ll be in touch within one business day.
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.nameRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="support-first-name">
                      First name
                    </label>
                    <input
                      id="support-first-name"
                      name="firstName"
                      type="text"
                      className={styles.input}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="support-last-name">
                      Last name
                    </label>
                    <input
                      id="support-last-name"
                      name="lastName"
                      type="text"
                      className={styles.input}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="support-email">
                    Email
                  </label>
                  <input
                    id="support-email"
                    name="email"
                    type="email"
                    className={styles.input}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="support-topic">
                    Topic
                  </label>
                  <select
                    id="support-topic"
                    name="topic"
                    className={styles.select}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    {TOPIC_OPTIONS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="support-message">
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    name="message"
                    className={styles.textarea}
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send message
                </button>
              </form>
            )}

            <div className={styles.divider}>or email us directly</div>
            <a href="mailto:support@remiminderai.com" className={styles.emailLink}>
              support@remiminderai.com
            </a>
          </div>
        </div>
      </section>

      <p className={styles.disclaimer}>
        RemiMinderAI is not a medical device and does not provide medical advice, diagnosis, or
        treatment.
      </p>

      <SiteFooter />
    </div>
  );
}
