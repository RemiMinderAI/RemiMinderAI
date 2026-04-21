import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, isFirestoreAvailable } from "../firebase";
import styles from "./MailingListModal.module.css";

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "family_caregiver", label: "Family Caregiver" },
  { value: "clinician", label: "Clinician" },
  { value: "healthcare_admin", label: "Healthcare Admin" },
  { value: "other", label: "Other" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const openMailingListModalStub = (opts) => {
  if (process.env.NODE_ENV === "development" && !openMailingListModalStub._ready) {
    console.warn("MailingListModal is not mounted yet.");
  }
  void opts;
};
openMailingListModalStub._ready = false;

let openMailingListModalImpl = openMailingListModalStub;

/**
 * @param {{ source?: string, planInterest?: string }} [opts]
 * source: e.g. 'landing_page', 'about', 'pricing'
 */
export function openMailingListModal(opts) {
  openMailingListModalImpl(opts);
}

function validateEmail(v) {
  return EMAIL_RE.test((v || "").trim());
}

export default function MailingListModal() {
  const [mounted, setMounted] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [panelIn, setPanelIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("family_caregiver");
  const [website, setWebsite] = useState("");

  const openOptionsRef = useRef({});
  const emailRef = useRef(null);
  const hasBeenOpenRef = useRef(false);
  const successCloseTimer = useRef(null);

  const resetForm = useCallback(() => {
    setEmail("");
    setName("");
    setRole("family_caregiver");
    setWebsite("");
    setFormError("");
  }, []);

  const close = useCallback(() => {
    setPanelIn(false);
    setOverlayOpen(false);
  }, []);

  useEffect(() => {
    const open = (opts) => {
      openOptionsRef.current = opts || {};
      setSuccess(false);
      setLoading(false);
      setFormError("");
      setEmail("");
      setName("");
      setRole("family_caregiver");
      setWebsite("");
      setPanelIn(false);
      setMounted(true);
    };
    open._ready = true;
    openMailingListModalImpl = open;
    openMailingListModalStub._ready = true;
    return () => {
      openMailingListModalImpl = openMailingListModalStub;
      openMailingListModalStub._ready = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOverlayOpen(true);
        setTimeout(() => setPanelIn(true), 10);
      });
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
      resetForm();
      setSuccess(false);
      setLoading(false);
      setFormError("");
      setMounted(false);
      hasBeenOpenRef.current = false;
    }, 300);
    return () => clearTimeout(t);
  }, [mounted, overlayOpen, resetForm]);

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
      emailRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(t);
  }, [overlayOpen, success]);

  useEffect(() => {
    if (!mounted || !overlayOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, overlayOpen, close]);

  useEffect(() => {
    if (success) {
      successCloseTimer.current = window.setTimeout(() => {
        close();
      }, 3000);
      return () => {
        if (successCloseTimer.current) {
          clearTimeout(successCloseTimer.current);
        }
      };
    }
    return undefined;
  }, [success, close]);

  const handleBackdropPointerDown = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  const submitNotify = async (type, data) => {
    const r = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
    if (!r.ok) {
      throw new Error("notify");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (website.trim() !== "") {
      return;
    }

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const normEmail = email.trim().toLowerCase();
    const opt = openOptionsRef.current;
    const source = opt?.source || "landing_page";
    const roleLabel = ROLES.find((r) => r.value === role)?.label ?? role;
    const listPayload = {
      email: normEmail,
      name: (name || "").trim() || null,
      role: roleLabel,
      planInterest: opt?.planInterest || null,
    };

    setLoading(true);

    const fire = isFirestoreAvailable() ? db : null;
    if (fire) {
      try {
        const q = query(
          collection(fire, "mailing_list"),
          where("email", "==", normEmail),
          limit(1)
        );
        const existing = await getDocs(q);
        if (!existing.empty) {
          setFormError("You're already on the list. We'll be in touch at launch.");
          setLoading(false);
          return;
        }

        await addDoc(collection(fire, "mailing_list"), {
          email: normEmail,
          name: (name || "").trim() || "",
          role: roleLabel,
          timestamp: serverTimestamp(),
          source,
          ...(opt?.planInterest ? { planInterest: opt.planInterest } : {}),
        });
      } catch (err) {
        console.error(err);
        setFormError(
          "We couldn't save your email right now. Please try again in a moment."
        );
        setLoading(false);
        return;
      }
    } else {
      try {
        await submitNotify("mailing_list", { ...listPayload, source });
      } catch {
        setFormError(
          "We couldn't complete your request right now. Please try again soon."
        );
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
      return;
    }

    try {
      await submitNotify("mailing_list", {
        ...listPayload,
        source,
        planInterest: opt?.planInterest || undefined,
      });
    } catch (err) {
      console.error(err);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (!mounted) {
    return null;
  }

  const modal = (
    <div
      className={`${styles.backdrop} ${overlayOpen ? styles.backdropOpen : ""}`}
      role="presentation"
      onMouseDown={handleBackdropPointerDown}
    >
      <div
        className={`${styles.root} ${styles.panel} ${
          panelIn && overlayOpen ? styles.panelIn : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={success ? "mailing-modal-success" : "mailing-modal-title"}
        onMouseDown={(ev) => ev.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        {success ? (
          <div className={styles.successBlock}>
            <div className={styles.checkWrap} aria-hidden="true">
              <svg
                className={styles.checkSvg}
                viewBox="0 0 24 24"
                focusable="false"
              >
                <path d="M5 13l4 4L20 6" />
              </svg>
            </div>
            <p id="mailing-modal-success" className={styles.successTitle}>
              You&apos;re on the list. We&apos;ll reach out at launch.
            </p>
          </div>
        ) : (
          <>
            <h2 id="mailing-modal-title" className={styles.title}>
              Join our mailing list
            </h2>
            <p className={styles.subtitle}>
              Get launch updates, early access, and product news. No spam.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="mail-website">Website</label>
                <input
                  id="mail-website"
                  name="website"
                  value={website}
                  onChange={(ev) => setWebsite(ev.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="mail-email">
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="mail-email"
                  className={styles.input}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(ev) => {
                    setEmail(ev.target.value);
                    if (formError) setFormError("");
                  }}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="mail-name">
                  Name (optional)
                </label>
                <input
                  id="mail-name"
                  className={styles.input}
                  type="text"
                  name="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  autoComplete="name"
                  placeholder="How we should address you"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="mail-role">
                  Role
                </label>
                <select
                  id="mail-role"
                  className={styles.select}
                  name="role"
                  value={role}
                  onChange={(ev) => setRole(ev.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {formError && (
                <p className={styles.errorText} role="alert">
                  {formError}
                </p>
              )}

              <div className={styles.rowActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>Joining…</span>
                    </>
                  ) : (
                    <span>Join the list</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
