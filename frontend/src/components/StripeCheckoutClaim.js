import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { billingApiPath, STRIPE_CHECKOUT_SESSION_STORAGE_KEY } from "../config";

/**
 * After a guest Stripe checkout, the user is redirected with `session_id` in the URL; we keep it
 * in sessionStorage and call `/api/claim-checkout-session` once they sign in (same email as at checkout).
 */
const StripeCheckoutClaim = () => {
  useEffect(() => {
    const getPendingSessionId = () => {
      try {
        const fromStore = sessionStorage.getItem(STRIPE_CHECKOUT_SESSION_STORAGE_KEY);
        if (fromStore) return fromStore;
      } catch {
        // ignore
      }
      try {
        const s = new URLSearchParams(window.location.search).get("session_id");
        if (s) {
          sessionStorage.setItem(STRIPE_CHECKOUT_SESSION_STORAGE_KEY, s);
          return s;
        }
      } catch {
        // ignore
      }
      return null;
    };

    const run = async (session) => {
      if (!session?.access_token) return;
      const sessionId = getPendingSessionId();
      if (!sessionId) return;
      const res = await fetch(billingApiPath("/api/claim-checkout-session"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        try {
          sessionStorage.removeItem(STRIPE_CHECKOUT_SESSION_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      run(s);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      run(session);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return null;
};

export default StripeCheckoutClaim;
