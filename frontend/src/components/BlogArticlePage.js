import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./BlogPages.module.css";
import { getPostBySlug, formatPostDate } from "../blog/posts";
import { markdownToReact } from "../blog/markdown";
import { usePageMeta } from "../utils/pageMeta";
import { ANDROID_URL, IOS_URL, trackDownloadClick } from "../constants/site";

function ArticleDownloadCta() {
  return (
    <aside className={styles.cta} aria-label="Download RemiMinderAI">
      <h2 className={styles.ctaTitle}>Download RemiMinderAI</h2>
      <p className={styles.ctaCopy}>
        Record the visit, get an AI summary, and share the care plan with family.
        Free 14-day trial.
      </p>
      <div className={styles.ctaBadges}>
        <a
          href={IOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackDownloadClick}
        >
          <img
            src="/images/app-store-badge.svg"
            alt="Download on the App Store"
            height={48}
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
            height={48}
          />
        </a>
      </div>
    </aside>
  );
}

export default function BlogArticlePage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const [scrolled, setScrolled] = useState(false);

  usePageMeta({
    title: post ? `${post.title} | RemiMinderAI` : "Article not found | RemiMinderAI",
    description: post
      ? post.description
      : "This article is not available on RemiMinderAI.",
    path: post ? post.path : `/blog/${slug || ""}`,
    type: post ? "article" : "website",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${landingStyles.container} ${styles.page}`}>
      <MarketingHeader
        scrolled={scrolled}
        headerExtraClass={pricingStyles.pricingHeader}
      />

      <main className={styles.main}>
        {post ? (
          <article className={styles.article}>
            <p className={styles.backRow}>
              <Link to="/blog" className={styles.backLink}>
                ← All articles
              </Link>
            </p>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <p className={styles.articleMeta}>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true"> · </span>
              <span>{post.readMinutes} min read</span>
            </p>
            <div className={styles.articleBody}>
              {markdownToReact(post.markdown, { leadClassName: styles.lead })}
            </div>
            <ArticleDownloadCta />
          </article>
        ) : (
          <div className={styles.article}>
            <h1 className={styles.articleTitle}>Article not found</h1>
            <p className={styles.articleMeta}>
              That post is not in the RemiMinderAI blog.
            </p>
            <p className={styles.backRow}>
              <Link to="/blog" className={styles.backLink}>
                ← All articles
              </Link>
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
