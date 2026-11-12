import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import landingStyles from "./LandingPage.module.css";
import styles from "./PrivacyPolicyPage.module.css";
import SiteFooter from "./SiteFooter";
import logo from "../assets/RemiMinder_logo_512.png";
import { buildToc, parsePrivacyMarkdown } from "./PrivacyPolicyPage";

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [rawMd, setRawMd] = useState("");
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL || ""}/terms_of_service.md`);
        if (!res.ok) throw new Error(`Could not load terms (${res.status})`);
        const text = await res.text();
        if (!cancelled) setRawMd(text);
      } catch (e) {
        if (!cancelled) setLoadError(e.message || "Failed to load terms of service.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!rawMd || !hash) return undefined;

    let targetId;
    try {
      targetId = decodeURIComponent(hash.slice(1));
    } catch {
      targetId = hash.slice(1);
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, rawMd]);

  const toc = useMemo(() => (rawMd ? buildToc(rawMd) : []), [rawMd]);
  const body = useMemo(
    () => (rawMd ? parsePrivacyMarkdown(rawMd, "terms-top") : []),
    [rawMd]
  );

  return (
    <div className={`${landingStyles.container} ${styles.wrap}`}>
      <header className={styles.minHeader}>
        <button
          type="button"
          className={styles.logoBtn}
          onClick={() => navigate("/")}
          aria-label="RemiMinderAI home"
        >
          <img src={logo} alt="" className={styles.logoImg} />
        </button>
        <h1 className={styles.headerTitle}>Terms of Service — RemiMinderAI</h1>
      </header>

      <main className={styles.main}>
        {loadError && <p className={styles.error}>{loadError}</p>}
        {!loadError && !rawMd && (
          <p className={styles.meta}>Loading terms of service…</p>
        )}
        {rawMd && (
          <>
            {toc.length > 0 && (
              <nav className={styles.toc} aria-label="Terms sections">
                <div className={styles.tocTitle}>On this page</div>
                <ul className={styles.tocList}>
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>{t.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <article className={styles.article}>{body}</article>
          </>
        )}

        <div className={styles.bottomActions}>
          <button type="button" className={styles.backHome} onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
