const {
  ORG_TYPES,
  PILOT_TO,
  validatePilotInquiry,
  pilotInquiryEmail,
} = require("./pilotInquiry");

const VALID = {
  name: "Ada Lovelace",
  organization: "Harbor Family Support",
  role: "Program lead",
  organizationType: ORG_TYPES[0],
  email: "ada@harbor.example",
  phone: "831-555-0100",
  challenge: "Families leave visits without a shared record of next steps.",
  company_website: "",
};

describe("pilot inquiry email", () => {
  test("accepts a complete inquiry and addresses it to the team inbox", () => {
    const result = validatePilotInquiry(VALID);
    expect(result.ok).toBe(true);
    expect(result.dropped).toBe(false);

    const email = pilotInquiryEmail(result.inquiry);
    expect(email.to).toBe(PILOT_TO);
    expect(email.to).toBe("team@remiminderai.com");
    expect(email.replyTo).toBe(VALID.email);
    expect(email.subject).toContain("Harbor Family Support");
    expect(email.html).toContain("Ada Lovelace");
    expect(email.html).toContain("831-555-0100");
    expect(email.html).not.toMatch(/\b(hipaa|clinical|patient|diagnosis)\b/i);
  });

  test("drops a filled honeypot without building an inquiry", () => {
    const result = validatePilotInquiry({
      ...VALID,
      company_website: "https://spam.example",
    });
    expect(result).toEqual({ ok: true, dropped: true });
  });

  test("rejects missing fields, a bad email, and an unknown organization type", () => {
    const result = validatePilotInquiry({
      name: "  ",
      organization: "",
      role: "",
      organizationType: "Clinic",
      email: "not-an-email",
      phone: "",
      challenge: "",
      company_website: "",
    });
    expect(result.ok).toBe(false);
    expect(result.errors.name).toMatch(/name/i);
    expect(result.errors.organization).toMatch(/organization/i);
    expect(result.errors.role).toMatch(/role/i);
    expect(result.errors.organizationType).toMatch(/organization type/i);
    expect(result.errors.email).toMatch(/email/i);
    expect(result.errors.challenge).toMatch(/challenge/i);
  });

  test("escapes html and strips line breaks from the subject", () => {
    const result = validatePilotInquiry({
      ...VALID,
      organization: "North\nSide <script>",
      challenge: `Families ask <b>what</b> & "why"`,
    });
    const email = pilotInquiryEmail(result.inquiry);
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.subject).toContain("North Side");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toContain("&lt;b&gt;");
    expect(email.html).toContain("&amp;");
    expect(email.html).not.toContain("<script>");
  });

  test("leaves phone blank as not provided", () => {
    const result = validatePilotInquiry({ ...VALID, phone: "   " });
    expect(pilotInquiryEmail(result.inquiry).html).toContain("Not provided");
  });
});
