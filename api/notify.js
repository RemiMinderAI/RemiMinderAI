const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Vercel serverless: notify via Resend for mailing list + feedback.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!resend) {
    console.error("Resend: RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email failed" });
  }

  if (!process.env.NOTIFICATION_EMAIL) {
    console.error("NOTIFICATION_EMAIL is not set");
    return res.status(500).json({ error: "Email failed" });
  }

  const { type, data } = req.body || {};
  if (!type || !data) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const subject =
    type === "mailing_list"
      ? `New mailing list signup: ${data.email || ""}`
      : "New feedback from RemiMinderAI";

  let html;
  if (type === "mailing_list") {
    const planLine = data.planInterest
      ? `<p><strong>Plan interest:</strong> ${escape(data.planInterest)}</p>`
      : "";
    html = `<h2>New signup</h2>
       <p><strong>Source:</strong> ${escape(data.source || "unknown")}</p>
       <p><strong>Email:</strong> ${escape(data.email)}</p>
       <p><strong>Name:</strong> ${escape(data.name || "Not provided")}</p>
       <p><strong>Role:</strong> ${escape(data.role || "Not provided")}</p>
       ${planLine}`;
  } else {
    html = `<h2>New feedback</h2>
       <p><strong>Role:</strong> ${escape(data.role)}</p>
       <p><strong>Rating:</strong> ${escape(String(data.rating))}/5</p>
       <p><strong>Message:</strong></p><p>${escape(data.message)}</p>
       <p><strong>Email:</strong> ${escape(data.email || "Anonymous")}</p>`;
  }

  try {
    await resend.emails.send({
      from: "RemiMinderAI <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL,
      subject,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Email failed" });
  }
};

function escape(str) {
  return String(str || "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );
}
