import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirestoreAvailable } from "../firebase";
import styles from "./FeedbackWidget.module.css";

const STORAGE_PULSE = "remiminder_feedback_pulse_off";
const MAX_MSG = 2000;

const ROLES = [
  { id: "patient", label: "Patient" },
  { id: "caregiver", label: "Caregiver" },
  { id: "clinician", label: "Clinician" },
  { id: "curious", label: "Just curious" },
];

function ChatBubbleIcon() {
  return (
    <svg
      className={styles.fabIcon}
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 3H4a2 2 0 00-2 2v8a2 2 0 002 2h3v4l4-4h9a2 2 0 002-2V5a2 2 0 00-2-2z" />
    </svg>
  );
}

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [cardIn, setCardIn] = useState(false);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [pulseOn, setPulseOn] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_PULSE) === "1") {
        setPulseOn(false);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const dismissPulseForSession = useCallback(() => {
    setPulseOn(false);
    try {
      sessionStorage.setItem(STORAGE_PULSE, "1");
    } catch {
      // ignore
    }
  }, []);

  const openPanel = () => {
    setOpen(true);
    setBackdrop(true);
    requestAnimationFrame(() => {
      setCardIn(true);
    });
  };

  const closePanel = () => {
    dismissPulseForSession();
    setCardIn(false);
    setBackdrop(false);
    window.setTimeout(() => {
      setOpen(false);
      setError("");
      if (done) {
        setDone(false);
        setRole(null);
        setRating(0);
        setMessage("");
        setEmail("");
        setStep(0);
      }
    }, 280);
  };

  const submitNotify = async (data) => {
    const r = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "feedback", data }),
    });
    if (!r.ok) {
      throw new Error("notify");
    }
  };

  const handleSubmit = async () => {
    if (!role) {
      setError("Please pick one option above.");
      return;
    }
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    const msg = (message || "").trim();
    if (!msg) {
      setError("A short message helps us a lot — even one line.");
      return;
    }

    setError("");
    setLoading(true);
    const roleLabel = ROLES.find((r) => r.id === role)?.label ?? role;
    const followEmail = (email || "").trim();
    const payload = {
      role: roleLabel,
      rating,
      message: msg,
      email: followEmail || null,
    };

    const fire = isFirestoreAvailable() ? db : null;
    if (fire) {
      try {
        await addDoc(collection(fire, "feedback"), {
          ...payload,
          email: followEmail || "",
          timestamp: serverTimestamp(),
          source: "feedback_widget",
        });
      } catch (err) {
        console.error(err);
        setError("We couldn't save that just now. Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      await submitNotify({
        ...payload,
        email: followEmail || "Anonymous",
      });
    } catch (err) {
      console.error(err);
      if (!fire) {
        setError("We couldn't send that right now. Please try again soon.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setDone(true);
    dismissPulseForSession();
  };

  const fab = (
    <div
      className={styles.widget}
      aria-hidden={open}
      data-remiminder-feedback
    >
      <button
        type="button"
        className={`${styles.fab} ${pulseOn && !open ? styles.fabPulse : ""}`}
        onClick={() => {
          if (open) return;
          openPanel();
        }}
        aria-label="Open feedback"
        aria-expanded={open}
        data-testid="remiminder-feedback-fab"
        style={{ pointerEvents: "auto" }}
      >
        <ChatBubbleIcon />
        <span className={styles.fabLabel}>Feedback</span>
      </button>
    </div>
  );

  const panel = open && (
    <>
      <div
        className={`${styles.backdrop} ${backdrop ? styles.backdropOn : ""}`}
        onMouseDown={closePanel}
        role="presentation"
      />
      <div
        className={`${styles.card} ${cardIn ? styles.cardOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.headerRow}>
          <h2 id="feedback-title" className={styles.cardTitle}>
            {done ? "Thank you" : "Help shape RemiMinderAI"}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closePanel}
            aria-label="Close feedback"
          >
            ×
          </button>
        </div>

        {done ? (
          <div className={styles.success}>
            <p className={styles.successEmoji} aria-hidden="true">
              💙
            </p>
            <p className={styles.successText}>
              Thanks — this shapes what we build next{' '}
              <span aria-hidden="true">💙</span>
            </p>
          </div>
        ) : (
          <>
            <div className={styles.stepper} aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${step >= i ? styles.dotOn : ""}`}
                />
              ))}
            </div>

            {step === 0 && (
              <>
                <p className={styles.stepLabel}>Question 1 of 4</p>
                <p className={styles.question}>Who are you?</p>
                <div className={styles.choices} role="list">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`${styles.choice} ${
                        role === r.id ? styles.choiceActive : ""
                      }`}
                      onClick={() => {
                        setRole(r.id);
                        setError("");
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {error && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  className={`${styles.primary} ${styles.nextOnly}`}
                  onClick={() => {
                    if (!role) {
                      setError("Please pick one option.");
                      return;
                    }
                    setError("");
                    setStep(1);
                  }}
                >
                  Next
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <p className={styles.stepLabel}>Question 2 of 4</p>
                <p className={styles.question}>How useful does this look?</p>
                <div className={styles.stars} role="group" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.starBtn} ${
                        rating >= n ? styles.starOn : ""
                      }`}
                      onClick={() => {
                        setRating(n);
                        setError("");
                      }}
                      aria-label={`${n} out of 5 stars`}
                    >
                      <Star
                        size={32}
                        strokeWidth={1.4}
                        fill={rating >= n ? "currentColor" : "none"}
                        color="currentColor"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                {error && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}
                <div className={styles.row}>
                  <button
                    type="button"
                    className={styles.backLink}
                    onClick={() => {
                      setStep(0);
                      setError("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => {
                      if (rating < 1) {
                        setError("Tap a star to rate.");
                        return;
                      }
                      setError("");
                      setStep(2);
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className={styles.stepLabel}>Question 3 of 4</p>
                <p className={styles.question}>
                  What would make this a must-have?
                </p>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v.length <= MAX_MSG) {
                      setMessage(v);
                    }
                    if (error) setError("");
                  }}
                  maxLength={MAX_MSG}
                  placeholder="Short notes are perfect."
                  rows={4}
                />
                <p className={styles.counter} aria-live="polite">
                  {message.length} / {MAX_MSG}
                </p>
                {error && step === 2 && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}
                <div className={styles.row}>
                  <button
                    type="button"
                    className={styles.backLink}
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => {
                      if (!(message || "").trim()) {
                        setError("A quick note helps us learn faster.");
                        return;
                      }
                      setError("");
                      setStep(3);
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className={styles.stepLabel}>Last step (optional)</p>
                <p className={styles.question}>Email for follow-up?</p>
                <p className={styles.muted}>
                  Optional — if you want us to follow up, leave your email. Skip
                  to send anonymously.
                </p>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {error && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}
                <div className={styles.row} style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className={styles.backLink}
                    onClick={() => {
                      setStep(2);
                      setError("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className={styles.spinner} aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      "Send feedback"
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );

  return createPortal(
    <>
      {fab}
      {panel}
    </>,
    document.body
  );
}
