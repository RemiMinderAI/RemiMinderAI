import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Check, Stethoscope, Users } from "lucide-react";
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./PilotPage.module.css";
import MarketingHeader from "./MarketingHeader";
import { ANDROID_URL, CONTACT_EMAIL, IOS_URL, trackDownloadClick } from "../constants/site";
import { usePageMeta } from "../utils/pageMeta";
import pilotInquiry from "../pilotInquiry";

const { ORG_TYPES, validatePilotInquiry } = pilotInquiry;

const PAGE_TITLE = "Pilot RemiMinderAI with Your Families | RemiMinderAI";

const EMPTY = {
  name: "",
  organization: "",
  role: "",
  organizationType: "",
  email: "",
  phone: "",
  challenge: "",
  companyWebsite: "",
};

const FIELD_IDS = [
  ["name", "pilot-name"],
  ["organization", "pilot-organization"],
  ["role", "pilot-role"],
  ["organizationType", "pilot-organization-type"],
  ["email", "pilot-email"],
  ["phone", "pilot-phone"],
  ["challenge", "pilot-challenge"],
];

const PARTNERS = [
  {
    title: "Hospitals & Discharge Teams",
    text: "Help families keep and follow post-discharge instructions.",
    icon: Building2,
  },
  {
    title: "Physician Practices",
    text: "Support families in following up on visit information at home.",
    icon: Stethoscope,
  },
  {
    title: "Caregiver Communities",
    text: "Give the families you already serve a simple tool to stay informed and coordinated.",
    icon: Users,
  },
];

const SCREENS = [
  {
    src: "/pilot/home-vox.png",
    filename: "home-vox.png",
    alt: "RemiMinderAI home screen with tasks and the Vox voice assistant",
  },
  {
    src: "/pilot/visit-summary.png",
    filename: "visit-summary.png",
    alt: "RemiMinderAI visit summary written in plain language",
  },
];

function SampleScreen({ src, filename, alt }) {
  const [ready, setReady] = useState(false);

  return (
    <div className={styles.bezel}>
      <img
        src={src}
        alt={ready ? alt : ""}
        width="390"
        height="844"
        className={ready ? styles.shot : styles.shotPending}
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
        aria-hidden={ready ? undefined : true}
      />
      {!ready && (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <span className={styles.placeholderLabel}>Screenshot placeholder</span>
          <span className={styles.placeholderFile}>{filename}</span>
        </div>
      )}
    </div>
  );
}

function CheckItem({ children }) {
  return (
    <li>
      <span className={styles.checkIcon} aria-hidden="true">
        <Check size={16} strokeWidth={2.5} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function PilotPage() {
  const [scrolled, setScrolled] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("idle");
  const successRef = useRef(null);

  usePageMeta({
    title: PAGE_TITLE,
    description: PAGE_TITLE,
    path: "/pilot",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status === "sent") {
      successRef.current?.focus();
    }
  }, [status]);

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (formError) setFormError("");
  };

  const focusFirstInvalid = (nextErrors) => {
    const match = FIELD_IDS.find(([field]) => nextErrors[field]);
    if (!match) return;
    document.getElementById(match[1])?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: values.name,
      organization: values.organization,
      role: values.role,
      organizationType: values.organizationType,
      email: values.email,
      phone: values.phone,
      challenge: values.challenge,
      company_website: values.companyWebsite,
    };
    const result = validatePilotInquiry(payload);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      focusFirstInvalid(result.errors);
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pilot_inquiry", data: payload }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (body.fields && typeof body.fields === "object") {
          setErrors(body.fields);
          setStatus("idle");
          focusFirstInvalid(body.fields);
          return;
        }
        throw new Error("send failed");
      }
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setFormError(
        `We couldn't send that just now. Please try again, or email ${CONTACT_EMAIL}.`
      );
    }
  };

  return (
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={pricingStyles.pricingHeader}
      />

      <main>
        <section className={styles.hero} aria-labelledby="pilot-hero-heading">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 id="pilot-hero-heading">
                Better Care Transitions Start with Informed Families.
              </h1>
              <p>
                Families leave appointments and hospitals with instructions,
                medication changes, follow-ups, and questions. Too often,
                important details get lost.
              </p>
              <p className={styles.heroLead}>
                RemiMinderAI helps families capture, understand, and share care
                information so they can stay engaged and take part in everyday
                care.
              </p>
              <a className={styles.orangeButton} href="#pilot">
                Explore Our Pilot Program
              </a>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.phones}>
                {SCREENS.map((screen) => (
                  <SampleScreen key={screen.filename} {...screen} />
                ))}
              </div>
              <p className={styles.screenCaption}>
                Sample screens: record the visit, get a plain-language summary,
                and set voice reminders with Vox.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.band} aria-labelledby="pilot-band-heading">
          <div className={styles.bandInner}>
            <h2 id="pilot-band-heading">
              Caregivers and Families: Partners in Care, Every Step of the Way.
            </h2>
            <p>
              A practical way to keep families informed, organized, and
              connected throughout the care journey.
            </p>
          </div>
        </section>

        <section className={styles.partners} aria-label="Partner organizations">
          <ul className={styles.partnerGrid}>
            {PARTNERS.map(({ title, text, icon: Icon }) => (
              <li key={title} className={styles.partnerCard}>
                <span className={styles.partnerIcon} aria-hidden="true">
                  <Icon size={28} strokeWidth={1.75} />
                </span>
                <h2>{title}</h2>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="pilot"
          className={styles.pilotSection}
          aria-labelledby="pilot-program-heading"
        >
          <div className={styles.pilotGrid}>
            <div>
              <p className={styles.eyebrow}>Pilot program</p>
              <h2 id="pilot-program-heading">A Simple Pilot. Real Feedback.</h2>
              <p className={styles.pilotIntro}>
                Partner with us to see how RemiMinderAI can support your
                families, with no extra work for your staff.
              </p>
              <ul className={styles.checks}>
                <CheckItem>2 months free for each pilot family</CheckItem>
                <CheckItem>3 to 5 families per partner</CheckItem>
                <CheckItem>
                  We handle setup and support, so no extra work for your staff
                </CheckItem>
                <CheckItem>
                  A short summary of what families used and said
                </CheckItem>
              </ul>
            </div>

            <div id="inquiry" className={styles.formCard}>
              <h2>Request a Pilot Partnership</h2>
              {status === "sent" ? (
                <p
                  ref={successRef}
                  tabIndex={-1}
                  className={styles.success}
                  role="status"
                >
                  Thanks. We&apos;ll be in touch within 1 business day.
                </p>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.field}>
                    <label htmlFor="pilot-name">
                      Your name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="pilot-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(event) => update("name", event.target.value)}
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "pilot-name-error" : undefined}
                      maxLength={120}
                    />
                    {errors.name && (
                      <p id="pilot-name-error" className={styles.error} role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="pilot-organization">
                      Organization <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="pilot-organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      value={values.organization}
                      onChange={(event) => update("organization", event.target.value)}
                      aria-required="true"
                      aria-invalid={errors.organization ? "true" : "false"}
                      aria-describedby={
                        errors.organization ? "pilot-organization-error" : undefined
                      }
                      maxLength={160}
                    />
                    {errors.organization && (
                      <p
                        id="pilot-organization-error"
                        className={styles.error}
                        role="alert"
                      >
                        {errors.organization}
                      </p>
                    )}
                  </div>

                  <div className={styles.splitFields}>
                    <div className={styles.field}>
                      <label htmlFor="pilot-role">
                        Your role <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="pilot-role"
                        name="role"
                        type="text"
                        autoComplete="organization-title"
                        value={values.role}
                        onChange={(event) => update("role", event.target.value)}
                        aria-required="true"
                        aria-invalid={errors.role ? "true" : "false"}
                        aria-describedby={errors.role ? "pilot-role-error" : undefined}
                        maxLength={120}
                      />
                      {errors.role && (
                        <p id="pilot-role-error" className={styles.error} role="alert">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="pilot-organization-type">
                        Organization type <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="pilot-organization-type"
                        name="organizationType"
                        value={values.organizationType}
                        onChange={(event) =>
                          update("organizationType", event.target.value)
                        }
                        aria-required="true"
                        aria-invalid={errors.organizationType ? "true" : "false"}
                        aria-describedby={
                          errors.organizationType
                            ? "pilot-organization-type-error"
                            : undefined
                        }
                      >
                        <option value="">Select organization type</option>
                        {ORG_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.organizationType && (
                        <p
                          id="pilot-organization-type-error"
                          className={styles.error}
                          role="alert"
                        >
                          {errors.organizationType}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="pilot-email">
                      Work email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="pilot-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={values.email}
                      onChange={(event) => update("email", event.target.value)}
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "pilot-email-error" : undefined}
                      maxLength={200}
                    />
                    {errors.email && (
                      <p id="pilot-email-error" className={styles.error} role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="pilot-phone">Phone (optional)</label>
                    <input
                      id="pilot-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "pilot-phone-error" : undefined}
                      maxLength={40}
                    />
                    {errors.phone && (
                      <p id="pilot-phone-error" className={styles.error} role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="pilot-challenge">
                      What&apos;s the biggest challenge for your families?{" "}
                      <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="pilot-challenge"
                      name="challenge"
                      rows={5}
                      value={values.challenge}
                      onChange={(event) => update("challenge", event.target.value)}
                      aria-required="true"
                      aria-invalid={errors.challenge ? "true" : "false"}
                      aria-describedby={
                        errors.challenge ? "pilot-challenge-error" : undefined
                      }
                      maxLength={2000}
                    />
                    {errors.challenge && (
                      <p
                        id="pilot-challenge-error"
                        className={styles.error}
                        role="alert"
                      >
                        {errors.challenge}
                      </p>
                    )}
                  </div>

                  <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="pilot-company-website">Website</label>
                    <input
                      id="pilot-company-website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.companyWebsite}
                      onChange={(event) =>
                        update("companyWebsite", event.target.value)
                      }
                    />
                  </div>

                  {formError && (
                    <p className={styles.error} role="alert">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={status === "submitting"}
                    aria-busy={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending…" : "Submit Inquiry"}
                  </button>
                  <p className={styles.replyNote}>
                    We&apos;ll get back to you within 1 business day.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className={styles.outcomes} aria-label="Pilot outcomes">
          <div className={styles.outcomeGrid}>
            <article className={styles.outcomeCard}>
              <h2>At the end of the pilot</h2>
              <p>
                You&apos;ll receive a short one-page summary of what your
                families used and said.
              </p>
            </article>
            <article className={styles.outcomeCard}>
              <h2>Why partner with RemiMinderAI?</h2>
              <ul className={styles.checks}>
                <CheckItem>
                  Keep families informed and engaged after the visit
                </CheckItem>
                <CheckItem>
                  Offer a simple, trusted tool to your community
                </CheckItem>
                <CheckItem>
                  Learn from real family use, in their own words
                </CheckItem>
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.privacy} aria-label="Privacy">
          <p>
            Families stay in control: caregivers see summaries and reminders
            only when the person shares them. No ads, no data sales, no AI
            training on your data. RemiMinderAI is a consumer wellness tool and
            doesn&apos;t replace medical advice.
          </p>
          <p>
            <Link to="/privacy">Privacy Policy</Link>
          </p>
        </section>

        <section className={styles.closing} aria-labelledby="pilot-closing-heading">
          <h2 id="pilot-closing-heading">
            Together, we can make care more connected.
          </h2>
          <p>
            Bring RemiMinderAI to your families, and be part of a more informed,
            more engaged care journey.
          </p>
          <a className={styles.goldButton} href="#inquiry">
            Partner with Us
          </a>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.storeBadges}>
            <a
              href={IOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackDownloadClick}
            >
              <img
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                height="48"
              />
            </a>
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackDownloadClick}
            >
              <img
                src="/images/google-play-badge.png"
                alt="Get it on Google Play"
                height="48"
              />
            </a>
          </div>
          <nav className={styles.footerLinks} aria-label="Footer">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </nav>
          <p className={styles.copyright}>© 2026 REMIMINDERAI LLC</p>
        </div>
      </footer>
    </div>
  );
}
