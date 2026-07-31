import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";

const SLIDES = [
  {
    src: "/carousel/slide_1_the_moment.png",
    alt: "Every healthcare journey begins with a conversation",
  },
  {
    src: "/carousel/slide_2_human_problem.png",
    alt: "Patients leave appointments already forgetting what mattered most",
  },
  {
    src: "/carousel/slide_3_system_problem.png",
    alt: "Healthcare becomes a telephone game — every handoff loses context",
  },
  {
    src: "/carousel/slide_4_family_problem.png",
    alt: "Families are left piecing together care from incomplete memories",
  },
  {
    src: "/carousel/slide_5_missing_layer.png",
    alt: "Medical records store information. Conversations preserve understanding.",
  },
  {
    src: "/carousel/slide_6_solution.png",
    alt: "RemiMinderAI — Capture. Understand. Remember. Share.",
  },
];

const INTERVAL_MS = 5000;

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

  return (
    <section
      className={styles.carouselSection}
      aria-roledescription="carousel"
      aria-label="RemiMinderAI story"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
            <img
              src={slide.src}
              alt={slide.alt}
              className={styles.image}
              draggable={false}
            />
          </div>
        ))}
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
