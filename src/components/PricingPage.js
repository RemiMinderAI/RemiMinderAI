import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import styles from "./PricingPage.module.css";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import { supabase } from "../supabaseClient";
import { billingApiPath, STRIPE_CHECKOUT_SESSION_STORAGE_KEY } from "../config";

const START_FREE_MAILTO =
  "mailto:team@remiminderai.com?subject=" +
  encodeURIComponent("Start Free - RemiMinderAI Beta Signup") +
  "&body=" +
  encodeURIComponent(
    "Hi RemiMinderAI team, I'd like to sign up for the free tier. Please send me next steps."
  );

const PricingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [familyBilling, setFamilyBilling] = useState(/** @type {"monthly" | "yearly"} */ ("monthly"));
  const [premiumBilling, setPremiumBilling] = useState(/** @type {"monthly" | "yearly"} */ ("monthly"));
  const [checkoutLoading, setCheckoutLoading] = useState(/** @type {null | "family" | "premium"} */ (null));
  const [checkoutMessage, setCheckoutMessage] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const c = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      try {
        sessionStorage.setItem(STRIPE_CHECKOUT_SESSION_STORAGE_KEY, sessionId);
      } catch {
        // ignore
      }
    }
    if (c === "success") {
      setCheckoutMessage(
        "Your subscription is being confirmed. If you paid as a guest, sign in with the same email to link your plan to your account."
      );
    } else if (c === "cancel") {
      setCheckoutMessage("Checkout was canceled. You can try again anytime.");
    }
    if (c || sessionId) {
      const next = new URLSearchParams(searchParams);
      if (c) next.delete("checkout");
      if (sessionId) next.delete("session_id");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const startPaidCheckout = useCallback(
    async (plan) => {
      setCheckoutMessage(null);
      const billing = plan === "family" ? familyBilling : premiumBilling;
      setCheckoutLoading(plan);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers = { "Content-Type": "application/json" };
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        const res = await fetch(billingApiPath("/api/create-checkout-session"), {
          method: "POST",
          headers,
          body: JSON.stringify({ plan, billing }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setCheckoutMessage(data.error || "Could not start checkout. Please try again.");
          setCheckoutLoading(null);
          return;
        }
        if (data.url) {
          window.location.assign(data.url);
          return;
        }
        setCheckoutMessage("No checkout URL returned.");
      } catch (e) {
        console.error(e);
        setCheckoutMessage("Network error. If you are running locally, use `vercel dev` so /api is available, or set REACT_APP_BILLING_API_BASE.");
      } finally {
        setCheckoutLoading(null);
      }
    },
    [familyBilling, premiumBilling]
  );

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

  const isFamilyLoading = checkoutLoading === "family";
  const isPremiumLoading = checkoutLoading === "premium";

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

        {checkoutMessage && (
          <p
            className={styles.checkoutBanner}
            role="status"
          >
            {checkoutMessage}
          </p>
        )}

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

            <div className={styles.billingToggle} role="group" aria-label="Family billing period">
              <button
                type="button"
                className={`${styles.billingOption} ${familyBilling === "monthly" ? styles.billingOptionActive : ""}`}
                onClick={() => setFamilyBilling("monthly")}
                aria-pressed={familyBilling === "monthly"}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`${styles.billingOption} ${familyBilling === "yearly" ? styles.billingOptionActive : ""}`}
                onClick={() => setFamilyBilling("yearly")}
                aria-pressed={familyBilling === "yearly"}
              >
                Yearly
              </button>
            </div>

            <div className={styles.priceBlock}>
              {familyBilling === "monthly" ? (
                <>
                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>$9.99</span>
                    <span className={styles.priceSuffix}>/month</span>
                  </div>
                  <p className={styles.subPrice}>$79.99 if billed annually (save $40)</p>
                </>
              ) : (
                <>
                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>$79.99</span>
                    <span className={styles.priceSuffix}>/year</span>
                  </div>
                  <p className={styles.subPrice}>Billed once per year</p>
                </>
              )}
            </div>
            <button
              type="button"
              className={`${styles.tierButton} ${styles.tierButtonFamily}`}
              disabled={isFamilyLoading}
              onClick={() => startPaidCheckout("family")}
            >
              {isFamilyLoading ? "Redirecting to secure checkout…" : "Choose Family"}
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

            <div className={styles.billingToggle} role="group" aria-label="Premium billing period">
              <button
                type="button"
                className={`${styles.billingOption} ${premiumBilling === "monthly" ? styles.billingOptionActive : ""}`}
                onClick={() => setPremiumBilling("monthly")}
                aria-pressed={premiumBilling === "monthly"}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`${styles.billingOption} ${premiumBilling === "yearly" ? styles.billingOptionActive : ""}`}
                onClick={() => setPremiumBilling("yearly")}
                aria-pressed={premiumBilling === "yearly"}
              >
                Yearly
              </button>
            </div>

            <div className={styles.priceBlock}>
              {premiumBilling === "monthly" ? (
                <>
                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>$19.99</span>
                    <span className={styles.priceSuffix}>/month</span>
                  </div>
                  <p className={styles.subPrice}>$159.99 if billed annually (save $80)</p>
                </>
              ) : (
                <>
                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>$159.99</span>
                    <span className={styles.priceSuffix}>/year</span>
                  </div>
                  <p className={styles.subPrice}>Billed once per year</p>
                </>
              )}
            </div>
            <button
              type="button"
              className={styles.tierButton}
              disabled={isPremiumLoading}
              onClick={() => startPaidCheckout("premium")}
            >
              {isPremiumLoading ? "Redirecting to secure checkout…" : "Choose Premium"}
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

        <p className={styles.billingNote}>
          Secure payment via Stripe. Subscriptions and receipts are the source of truth. You can
          check out on this page without signing in first; if you are new, create an account with
          the same email you use at checkout so we can link your plan. You can also{" "}
          <a href={START_FREE_MAILTO} className={styles.inlineLink}>
            start free
          </a>{" "}
          or join the list.
        </p>

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
