import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketingHeader from "./MarketingHeader";
import SiteFooter from "./SiteFooter";
import landingStyles from "./LandingPage.module.css";
import pricingStyles from "./PricingPage.module.css";
import styles from "./BlogPages.module.css";
import { BLOG_POSTS, formatPostDate } from "../blog/posts";
import { usePageMeta } from "../utils/pageMeta";

export default function BlogIndexPage() {
  const [scrolled, setScrolled] = useState(false);

  usePageMeta({
    title: "Blog | RemiMinderAI",
    description:
      "Guides for caregivers and families on remembering doctor visits, sharing care plans, and using RemiMinderAI.",
    path: "/blog",
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
        <header className={styles.indexHeader}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.indexTitle}>Remember what the doctor said</h1>
          <p className={styles.indexSubtitle}>
            Practical guides for caregivers and families navigating appointments,
            follow-ups, and shared care.
          </p>
        </header>

        <div className={styles.cardGrid}>
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={post.path}
              className={styles.card}
            >
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardPreview}>{post.preview}</p>
              <div className={styles.cardMeta}>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readMinutes} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
