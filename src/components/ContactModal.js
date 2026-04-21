import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import styles from "./ContactModal.module.css";
import { CONTACT_EMAIL } from "../constants/site";

function noop() {}

/** Set by <ContactModal /> when mounted — About page calls these to open/close. */
export let openContactModal = noop;
export let closeContactModal = noop;

export default function ContactModal() {
  const [mounted, setMounted] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const nameInputRef = useRef(null);
  const hasBeenOpenRef = useRef(false);

  useEffect(() => {
    openContactModal = () => {
      setMounted(true);
    };
    closeContactModal = () => {
      setOverlayOpen(false);
    };
    return () => {
      openContactModal = noop;
      closeContactModal = noop;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOverlayOpen(true));
    });
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  useEffect(() => {
    if (overlayOpen) {
      hasBeenOpenRef.current = true;
    }
  }, [overlayOpen]);

  useEffect(() => {
    if (!mounted || overlayOpen || !hasBeenOpenRef.current) {
      return undefined;
    }
    const t = window.setTimeout(() => {
      setMounted(false);
      hasBeenOpenRef.current = false;
    }, 300);
    return () => clearTimeout(t);
  }, [mounted, overlayOpen]);

  useEffect(() => {
    if (!mounted) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const t = window.setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 90);
    return () => clearTimeout(t);
  }, [overlayOpen]);

  useEffect(() => {
    if (!mounted || !overlayOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeContactModal();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, overlayOpen]);

  const handleBackdropPointerDown = (e) => {
    if (e.target === e.currentTarget) {
      closeContactModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem("name")?.value?.trim() ?? "";
    const email = form.elements.namedItem("email")?.value?.trim() ?? "";
    const message = form.elements.namedItem("message")?.value?.trim() ?? "";
    const subject = encodeURIComponent(`RemiMinderAI — message from ${name || "visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    closeContactModal();
  };

  if (!mounted) {
    return null;
  }

  const modal = (
    <div
      className={`${styles.overlay} ${overlayOpen ? styles.overlayOpen : ""}`}
      role="presentation"
      onMouseDown={handleBackdropPointerDown}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-desc"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.headerRow}>
          <div>
            <h2 id="contact-modal-title" className={styles.title}>
              Contact the Team
            </h2>
            <p id="contact-modal-desc" className={styles.subtitle}>
              We&apos;re here to help. Send us a message and we&apos;ll get back to you.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeContactModal}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-name">
              Name
            </label>
            <input
              ref={nameInputRef}
              id="contact-name"
              name="name"
              type="text"
              className={styles.input}
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className={styles.input}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={styles.textarea}
              rows={5}
              placeholder="How can we help?"
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              <span>Send Message</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className={styles.fallback}>
              Prefer email?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
