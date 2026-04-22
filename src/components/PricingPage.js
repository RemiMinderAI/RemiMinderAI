import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import styles from "./PricingPage.module.css";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import { useMailingList } from "../context/MailingListContext";

const START_FREE_MAILTO =
  "mailto:team@remiminderai.com?subject=" +
  encodeURIComponent("Start Free - RemiMinderAI Beta Signup") +
  "&body=" +
  encodeURIComponent(
    "Hi RemiMinderAI team, I'd like to sign up for the free tier. Please send me next steps."
  );

const PricingPage = () => {
  const { open: openMailingList } = useMailingList();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const freeFeatures = [
    "**2 recorded visits** every month",
    "**1 caregiver** you invite",
    "AI summaries and transcripts",
    "Basic medication reminders",
    "30-day recording history",
    "HIPAA-compliant and encrypted",
  ];

  const familyFeatures = [
    "**Unlimited** recorded visits",
    "**Up to 5 caregivers** invited",
    "**2 prescription scans** per month",
    "Smart medication reminders",
    "Unlimited recording history",
    "Priority email support",
  ];

  const premiumFeatures = [
    "**Up to 3 patients** per account",
    "**Up to 10 caregivers** total",
    "**Unlimited** prescription scans",
    "Early access to new features",
    "Priority support, 24-hour response",
  ];

  const renderFeatureLine = (line) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className={styles.featureStrong}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={styles.pricingPageRoot}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={styles.pricingHeader}
      />

      <main className={styles.pricingWrap}>
        <section className={styles.heroBlock} aria-labelledby="pricing-heading">
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrowText}>Simple, honest pricing</span>
          </div>
          <h1 id="pricing-heading" className={styles.pageTitle}>
            Plans for every kind of family
          </h1>
          <p className={styles.subtitleLine1}>
            Start free. Upgrade when you&apos;re ready. Cancel anytime, no questions asked.
          </p>
          <p className={styles.subtitleLine2}>
            Save up to $80 a year by choosing annual billing.
          </p>
        </section>

        <section className={styles.cardsGrid} aria-label="Pricing tiers">
          {/* Free */}
          <article className={styles.card}>
            <h2 className={styles.tierName}>Free</h2>
            <p className={styles.tierTagline}>
              Try RemiMinderAI on your next doctor visit. No credit card needed.
            </p>
            <div className={styles.priceBlock}>
              <div className={styles.priceRow}>
                <span className={styles.priceAmount}>$0</span>
                <span className={styles.priceSuffix}>forever</span>
              </div>
              <p className={styles.subPrice}>No credit card required</p>
            </div>
            <a href={START_FREE_MAILTO} className={styles.tierButton}>
              Start Free
            </a>
            <p className={styles.featuresLabel}>Includes</p>
            <ul className={styles.featureList}>
              {freeFeatures.map((line) => (
                <li key={line} className={styles.featureItem}>
                  <span className={styles.featureCheckWrap} aria-hidden="true">
                    <Check className={styles.featureCheckIcon} size={14} strokeWidth={3} />
                  </span>
                  <span className={styles.featureText}>{renderFeatureLine(line)}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Family featured */}
          <article className={`${styles.card} ${styles.cardFeatured}`}>
            <div className={styles.popularBadge}>MOST POPULAR</div>
            <h2 className={styles.tierName}>Family</h2>
            <p className={styles.tierTagline}>
              For one loved one and the family who helps care for them.
            </p>
            <div className={styles.priceBlock}>
              <div className={styles.priceRow}>
                <span className={styles.priceAmount}>$9.99</span>
                <span className={styles.priceSuffix}>/month</span>
              </div>
              <div className={styles.annualRow}>
                <span className={styles.annualText}>or $79 a year</span>
                <span className={styles.savingsPill}>Save $40</span>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.tierButton} ${styles.tierButtonFamily}`}
              onClick={() =>
                openMailingList({
                  source: "pricing",
                  planInterest: "family",
                })
              }
            >
              Choose Family
            </button>
            <p className={styles.featuresLabel}>Everything in Free, plus</p>
            <ul className={styles.featureList}>
              {familyFeatures.map((line) => (
                <li key={line} className={styles.featureItem}>
                  <span className={styles.featureCheckWrap} aria-hidden="true">
                    <Check className={styles.featureCheckIcon} size={14} strokeWidth={3} />
                  </span>
                  <span className={styles.featureText}>{renderFeatureLine(line)}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Premium */}
          <article className={styles.card}>
            <h2 className={styles.tierName}>Premium</h2>
            <p className={styles.tierTagline}>
              For families managing care for more than one loved one.
            </p>
            <div className={styles.priceBlock}>
              <div className={styles.priceRow}>
                <span className={styles.priceAmount}>$19.99</span>
                <span className={styles.priceSuffix}>/month</span>
              </div>
              <div className={styles.annualRow}>
                <span className={styles.annualText}>or $159 a year</span>
                <span className={styles.savingsPill}>Save $80</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.tierButton}
              onClick={() =>
                openMailingList({
                  source: "pricing",
                  planInterest: "premium",
                })
              }
            >
              Choose Premium
            </button>
            <p className={styles.featuresLabel}>Everything in Family, plus</p>
            <ul className={styles.featureList}>
              {premiumFeatures.map((line) => (
                <li key={line} className={styles.featureItem}>
                  <span className={styles.featureCheckWrap} aria-hidden="true">
                    <Check className={styles.featureCheckIcon} size={14} strokeWidth={3} />
                  </span>
                  <span className={styles.featureText}>{renderFeatureLine(line)}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className={styles.trustSection} aria-label="Trust and guarantees">
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <span className={styles.trustCheckWrap} aria-hidden="true">
                <Check className={styles.trustCheckIcon} size={14} strokeWidth={3} />
              </span>
              <span className={styles.trustText}>HIPAA Compliant</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustCheckWrap} aria-hidden="true">
                <Check className={styles.trustCheckIcon} size={14} strokeWidth={3} />
              </span>
              <span className={styles.trustText}>Cancel Anytime</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustCheckWrap} aria-hidden="true">
                <Check className={styles.trustCheckIcon} size={14} strokeWidth={3} />
              </span>
              <span className={styles.trustText}>14-Day Money-Back Guarantee</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustCheckWrap} aria-hidden="true">
                <Check className={styles.trustCheckIcon} size={14} strokeWidth={3} />
              </span>
              <span className={styles.trustText}>Your Data, Never Sold</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PricingPage;
