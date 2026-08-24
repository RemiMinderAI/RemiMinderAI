import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";


const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.remiminderai.app";
const IOS_URL = "https://apps.apple.com/us/app/remiminderai/id6776771952";

const SLIDES = [
  {
    src: "/carousel/hero_1_doctor_visit.jpg",
    headline: "Every healthcare journey begins with a conversation.",
    subtext:
      "But the most important details often disappear after the visit.",
  },
  {
    src: "/carousel/hero_2_parking_lot.jpg",
    headline: "We hear. We understand. We try to remember.",
    subtext:
      "But our brains were never designed to store every medical detail.",
  },
  {
    src: "/carousel/hero_3_family_table.jpg",
    headline:
      "Families are left piecing together care from incomplete memories.",
  },
  {
    src: "/carousel/hero_4_missing_layer.jpg",
    headline: "Medical records store information.",
    subtext: "Conversations preserve understanding.",
    coralSubtext: true,
  },
  {
    src: "/carousel/hero_5_combined.jpg",
    headline: "RemiMinderAI",
    subtext:
      "Turns healthcare conversations into clear, shareable memories — helping patients, caregivers, and families stay aligned.",
    label: "The Solution",
    branded: true,
    extra: "Capture. Understand. Remember. Share.",
  },
];

const INTERVAL_MS = 5000;
const LAST_INDEX = SLIDES.length - 1;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setActiveIndex(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, activeIndex]);

  const isLastSlide = activeIndex === LAST_INDEX;

  return (
    <section
      className={styles.carouselSection}
      aria-roledescription="carousel"
      aria-label="RemiMinderAI story"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      <div className={styles.viewport}>
        {SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`${styles.slide} ${
              index === activeIndex ? styles.slideActive : ""
            }`}
            aria-hidden={index !== activeIndex}
          >
            <div className={styles.slideCard}>
              <div className={styles.imageWrap}>
                <img
                  src={slide.src}
                  alt=""
                  className={styles.image}
                  draggable={false}
                />
              </div>
              <div className={styles.textPanel}>
                {slide.label && (
                  <>
                  <div className={styles.solutionRule} aria-hidden="true" />
                  <p className={styles.solutionLabel}>The Solution</p>
                  </>
                )}
                <h2 className={styles.headline}>
                  {slide.branded ? (
                    <>
                    Remi<span className={styles.solutionMinder}>Minder</span>AI
                    </>
                  ) : (
                    slide.headline
                  )}
                </h2>
                {slide.subtext && (
                  <p
                    className={`${styles.subtext} ${
                      slide.coralSubtext ? styles.subtextCoral : ""
                    }`}
                  >
                    {slide.subtext}
                  </p>
                )}
                {slide.extra && <p className={styles.extraLine}>{slide.extra}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`${styles.ctaRow} ${isLastSlide ? styles.ctaRowEmphasis : ""}`}
      >
        <a href={IOS_URL} target="_blank" rel="noopener noreferrer">
          <img src="/images/app-store-badge.svg" alt="Download on the App Store" style={{ height: "48px" }} />
        </a>
        <a href={ANDROID_URL} target="_blank" rel="noopener noreferrer">
          <img src="/images/google-play-badge.png" alt="Get it on Google Play" style={{ height: "48px" }} />
        </a>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Carousel slides">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to slide ${index + 1}`}
            className={`${styles.dot} ${
              index === activeIndex ? styles.dotActive : ""
            }`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
