import React, { useState } from "react";
import { Play } from "lucide-react";
import styles from "./TestimonialsSection.module.css";

const VIDEO_REVIEW_URL = "https://www.instagram.com/p/DdZ3xNxx9Et/?hl=en";
const VIDEO_EMBED_URL = "https://www.instagram.com/p/DdZ3xNxx9Et/embed";

const TESTIMONIALS = [
  {
    quote:
      "I need reminders for my medications so I don't forget to take them. Even just seeing them on the Overview screen in RemiMinderAI helps me stay on track.",
    attribution: ["Lee Ann", "Patient", "California"],
  },
  {
    quote:
      "After every session, my patients leave without really understanding their follow-up instructions. By the next visit, the home program is forgotten or mixed up. RemiMinderAI can give them a clear record they can revisit and share with family, so the plan actually sticks.",
    attribution: ["Physical Therapist", "Hazel Hawkins Medical Center, Hollister"],
  },
  {
    body: "Patrick Flynn uses RemiMinderAI to take care of his mom. Feedback coming soon.....",
    pending: true,
  },
];

function Attribution({ parts }) {
  return (
    <cite className={styles.attribution}>
      <div className={styles.attributionLine}>
        {parts.map((part, index) => (
          <React.Fragment key={`${part}-${index}`}>
            {index > 0 ? (
              <span className={styles.locationDot} aria-hidden="true">
                ·
              </span>
            ) : null}
            <span className={index === 0 ? styles.role : styles.meta}>{part}</span>
          </React.Fragment>
        ))}
      </div>
    </cite>
  );
}

function FeaturedVideoCard() {
  const [embedBlocked, setEmbedBlocked] = useState(false);

  return (
    <article className={`${styles.card} ${styles.featuredCard}`}>
      <span className={styles.videoBadge}>Video review</span>
      <blockquote className={styles.blockquote}>
        <p className={styles.quoteText}>
          RemiMinderAI is very helpful for me to keep track of my medication and
          appointments. I&apos;m using it every day and have asked my friends and
          family to use it too.
        </p>
        <Attribution
          parts={["Soumendranath", "English teacher", "Kolkata, India"]}
        />
      </blockquote>
      <div className={styles.videoFrame}>
        {!embedBlocked ? (
          <iframe
            className={styles.instagramEmbed}
            src={VIDEO_EMBED_URL}
            title="Soumendranath video review on Instagram"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            onError={() => setEmbedBlocked(true)}
          />
        ) : null}
        <a
          className={styles.videoFallback}
          href={VIDEO_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          hidden={!embedBlocked}
        >
          <span className={styles.playButton} aria-hidden="true">
            <Play size={22} fill="currentColor" />
          </span>
          <span className={styles.videoFallbackLabel}>Watch on Instagram</span>
        </a>
      </div>
      <a
        className={styles.watchLink}
        href={VIDEO_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch Soumendranath&apos;s review on Instagram
      </a>
    </article>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="testimonials-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrowText}>What users are saying</span>
          </div>
          <h2 id="testimonials-heading" className={styles.title}>
            Real people. Real appointments. Real clarity.
          </h2>
        </header>

        <div className={styles.grid}>
          {TESTIMONIALS.map((item, index) => (
            <article
              key={index}
              className={`${styles.card} ${item.pending ? styles.pendingCard : ""}`}
            >
              {item.pending ? (
                <p className={styles.pendingText}>{item.body}</p>
              ) : (
                <>
                  <span className={styles.quoteMark} aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className={styles.blockquote}>
                    <p className={styles.quoteText}>{item.quote}</p>
                    <Attribution parts={item.attribution} />
                  </blockquote>
                </>
              )}
            </article>
          ))}
          <FeaturedVideoCard />
        </div>
      </div>
    </section>
  );
}
