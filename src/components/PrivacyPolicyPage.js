import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import landingStyles from "./LandingPage.module.css";
import styles from "./PrivacyPolicyPage.module.css";
import SiteFooter from "./SiteFooter";
import logo from "../assets/RemiMinder_logo_512.png";

/**
 * Parse minimal markdown (headings, paragraphs, bold, unordered lists) into React nodes.
 * Numbered ## headings get stable ids: section-1, section-2, ...
 */
function parsePrivacyMarkdown(mdText) {
  const lines = mdText.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;
  let sectionIndex = 0;

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx}>{part.slice(2, -2)}</strong>
        );
      }
      return part;
    });
  };

  const flushParagraph = (buf) => {
    const t = buf.join(" ").trim();
    if (!t) return;
    blocks.push(
      <p key={`p-${key++}`}>{renderInline(t)}</p>
    );
    buf.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      const title = trimmed.slice(2).trim();
      blocks.push(
        <h1 key={`h1-${key++}`} id="privacy-top">
          {title}
        </h1>
      );
      i += 1;
      continue;
    }

    const h2Num = trimmed.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (h2Num) {
      sectionIndex += 1;
      const id = `section-${h2Num[1]}`;
      blocks.push(
        <h2 key={`h2-${key++}`} id={id}>
          {h2Num[1]}. {h2Num[2]}
        </h2>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      const rest = trimmed.slice(3).trim();
      sectionIndex += 1;
      const slug = rest
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blocks.push(
        <h2 key={`h2-${key++}`} id={slug || `section-extra-${sectionIndex}`}>
          {rest}
        </h2>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${key++}`}>{trimmed.slice(4).trim()}</h3>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${key++}`}>
          {items.map((item, liIdx) => (
            <li key={`${liIdx}-${item.slice(0, 24)}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (trimmed.startsWith("_") && trimmed.endsWith("_") && trimmed.length > 2) {
      blocks.push(
        <p key={`em-${key++}`} className={styles.leadLine}>
          {renderInline(trimmed.replace(/^_|_$/g, ""))}
        </p>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("##") && !trimmed.startsWith("## ")) {
      sectionIndex += 1;
      const rest = trimmed.replace(/^##+\s*/, "").trim();
      const slug = rest
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blocks.push(
        <h2 key={`h2-${key++}`} id={slug || `section-extra-${sectionIndex}`}>
          {rest}
        </h2>
      );
      i += 1;
      continue;
    }

    const paraBuf = [];
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("#")) {
      const l = lines[i].trim();
      if (l.startsWith("- ")) break;
      paraBuf.push(l);
      i += 1;
    }
    if (paraBuf.length) {
      flushParagraph(paraBuf);
    } else {
      i += 1;
    }
  }

  return blocks;
}

function buildToc(mdText) {
  const lines = mdText.split(/\n/);
  const items = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (m) {
      items.push({ id: `section-${m[1]}`, label: `${m[1]}. ${m[2]}` });
    }
  }
  return items;
}

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [rawMd, setRawMd] = useState("");
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL || ""}/privacy_policy.md`);
        if (!res.ok) throw new Error(`Could not load policy (${res.status})`);
        const text = await res.text();
        if (!cancelled) setRawMd(text);
      } catch (e) {
        if (!cancelled) setLoadError(e.message || "Failed to load privacy policy.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toc = useMemo(() => (rawMd ? buildToc(rawMd) : []), [rawMd]);
  const body = useMemo(() => (rawMd ? parsePrivacyMarkdown(rawMd) : []), [rawMd]);

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
        <h1 className={styles.headerTitle}>Privacy Policy ΓÇö RemiMinderAI</h1>
      </header>

      <main className={styles.main}>
        {loadError && <p className={styles.error}>{loadError}</p>}
        {!loadError && !rawMd && (
          <p className={styles.meta}>Loading privacy policyΓÇª</p>
        )}
        {rawMd && (
          <>
            {toc.length > 0 && (
              <nav className={styles.toc} aria-label="Policy sections">
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
            ΓåÉ Back to Home
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
