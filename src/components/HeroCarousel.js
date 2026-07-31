import React, { useCallback, useEffect, useRef, useState } from "react";
import { Smartphone, Apple } from "lucide-react";
import styles from "./HeroCarousel.module.css";

const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.remiminderai.app";

const SLIDES = [
  {
    src: "/carousel/slide_1_the_moment.jpg",
    alt: "Every healthcare journey begins with a conversation",
  },
  {
    src: "/carousel/slide_2_human_problem.jpg",
    alt: "Patients leave appointments already forgetting what mattered most",
  },
  {
    src: "/carousel/slide_4_family_problem.jpg",
    alt: "Families are left piecing together care from incomplete memories",
  },
  {
    src: "/carousel/slide_5_missing_layer.jpg",
    alt: "Medical records store information. Conversations preserve understanding.",
  },
  {
    src: "/carousel/slide_6_solution.jpg",
    alt: "RemiMinderAI — Capture. Understand. Remember. Share.",
    solution: true,
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
            {slide.solution ? (
              <div className={styles.solutionCard}>
                <div
                  className={styles.solutionPhoto}
                  style={{ backgroundImage: `url(${slide.src})` }}
                  role="img"
                  aria-label={slide.alt}
                />
                <div className={styles.solutionPanel}>
                  <div className={styles.solutionRule} aria-hidden="true" />
                  <p className={styles.solutionLabel}>The Solution</p>
                  <p className={styles.solutionBody}>
                    Turns healthcare conversations into clear, shareable memories —
                    helping patients, caregivers, and families stay aligned.
                  </p>
                  <p className={styles.solutionTagline}>
                    Capture. Understand. Remember. Share.
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                className={styles.image}
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className={`${styles.ctaRow} ${isLastSlide ? styles.ctaRowEmphasis : ""}`}
      >
        <a
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaAndroid}
        >
          <Smartphone size={18} aria-hidden="true" />
          <span>Download Android</span>
        </a>
        <button type="button" className={styles.ctaIos} disabled>
          <Apple size={18} aria-hidden="true" />
          <span>iOS Coming Soon</span>
        </button>
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
