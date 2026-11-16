/**
 * Pilot partnership inquiries. Shared by the /pilot form and /api/notify.
 * Keep the rendered page free of the words HIPAA, clinical, patient, and diagnosis.
 */

const ORG_TYPES = [
  "Hospital/discharge team",
  "Physician practice",
  "Caregiver community or nonprofit",
  "Senior living",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PILOT_TO = "team@remiminderai.com";

const LIMITS = {
  name: 120,
  organization: 160,
  role: 120,
  email: 200,
  phone: 40,
  challenge: 2000,
};

const MESSAGES = {
  name: "Enter your name.",
  organization: "Enter your organization.",
  role: "Enter your role.",
  organizationType: "Select an organization type.",
  email: "Enter a valid work email.",
  challenge: "Tell us the biggest challenge for your families.",
};

function honeypotTripped(data) {
  const value = data ? data.company_website : undefined;
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

function asText(value) {
  return typeof value === "string" ? value : "";
}

function validatePilotInquiry(data) {
  if (!data || typeof data !== "object") {
    return { ok: false, errors: { form: "Please check the form." } };
  }
  if (honeypotTripped(data)) {
    return { ok: true, dropped: true };
  }

  const name = asText(data.name).trim();
  const organization = asText(data.organization).trim();
  const role = asText(data.role).trim();
  const organizationType = asText(data.organizationType).trim();
  const email = asText(data.email).trim();
  const phone = asText(data.phone).trim();
  const challenge = asText(data.challenge).trim();

  const errors = {};
  if (!name || name.length > LIMITS.name) errors.name = MESSAGES.name;
  if (!organization || organization.length > LIMITS.organization) {
    errors.organization = MESSAGES.organization;
  }
  if (!role || role.length > LIMITS.role) errors.role = MESSAGES.role;
  if (!organizationType || !ORG_TYPES.includes(organizationType)) {
    errors.organizationType = MESSAGES.organizationType;
  }
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    errors.email = MESSAGES.email;
  }
  if (phone.length > LIMITS.phone) {
    errors.phone = "Enter a shorter phone number.";
  }
  if (!challenge || challenge.length > LIMITS.challenge) {
    errors.challenge = MESSAGES.challenge;
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    dropped: false,
    inquiry: {
      name,
      organization,
      role,
      organizationType,
      email,
      phone,
      challenge,
    },
  };
}

function escapeHtml(str) {
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

function oneLine(value) {
  return String(value || "").replace(/[\r\n\t]+/g, " ").trim();
}

function pilotInquiryEmail(inquiry) {
  const phone = inquiry.phone ? escapeHtml(inquiry.phone) : "Not provided";
  const organization = oneLine(inquiry.organization).slice(0, LIMITS.organization);
  return {
    to: PILOT_TO,
    replyTo: inquiry.email,
    subject: `Pilot partnership inquiry: ${organization}`,
    html: `<h2>Pilot partnership inquiry</h2>
       <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
       <p><strong>Organization:</strong> ${escapeHtml(inquiry.organization)}</p>
       <p><strong>Role:</strong> ${escapeHtml(inquiry.role)}</p>
       <p><strong>Organization type:</strong> ${escapeHtml(inquiry.organizationType)}</p>
       <p><strong>Work email:</strong> ${escapeHtml(inquiry.email)}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Biggest challenge for their families:</strong></p>
       <p>${escapeHtml(inquiry.challenge)}</p>
       <p><strong>Source:</strong> /pilot</p>`,
  };
}

module.exports = {
  ORG_TYPES,
  LIMITS,
  MESSAGES,
  PILOT_TO,
  validatePilotInquiry,
  pilotInquiryEmail,
  escapeHtml,
};
