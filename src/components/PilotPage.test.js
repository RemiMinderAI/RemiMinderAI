import React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import PilotPage from "./PilotPage";
import pilotInquiry from "../pilotInquiry";

const { ORG_TYPES } = pilotInquiry;

function renderPage() {
  return render(
    <MemoryRouter>
      <PilotPage />
    </MemoryRouter>
  );
}

function fillValidForm() {
  fireEvent.change(screen.getByRole("textbox", { name: /^your name/i }), {
    target: { value: "Ada Lovelace" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /^organization/i }), {
    target: { value: "Harbor Family Support" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /^your role/i }), {
    target: { value: "Program lead" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: /organization type/i }), {
    target: { value: ORG_TYPES[2] },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /work email/i }), {
    target: { value: "ada@harbor.example" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /phone/i }), {
    target: { value: "831-555-0100" },
  });
  fireEvent.change(
    screen.getByRole("textbox", { name: /biggest challenge/i }),
    { target: { value: "Details from the visit get lost on the way home." } }
  );
}

describe("Pilot page", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the partner story, placeholders, and footer without forbidden words", () => {
    renderPage();

    expect(document.title).toBe(
      "Pilot RemiMinderAI with Your Families | RemiMinderAI"
    );
    expect(
      document.head.querySelector('meta[name="description"]')
    ).toHaveAttribute(
      "content",
      "Pilot RemiMinderAI with Your Families | RemiMinderAI"
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /better care transitions start with informed families/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/too often, important details get lost/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore our pilot program/i })
    ).toHaveAttribute("href", "#pilot");

    expect(screen.getByText("home-vox.png")).toBeInTheDocument();
    expect(screen.getByText("visit-summary.png")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /home screen with tasks and the vox/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /visit summary written in plain language/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sample screens: record the visit/i)
    ).toBeInTheDocument();

    expect(screen.getByText("3 to 5 families per partner")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /a simple pilot\. real feedback/i })
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("link", { name: "Privacy Policy" }).length
    ).toBeGreaterThanOrEqual(1);
    screen.getAllByRole("link", { name: "Privacy Policy" }).forEach((link) => {
      expect(link).toHaveAttribute("href", "/privacy");
    });
    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: /download on the app store/i })
    ).toBeInTheDocument();
    expect(
      within(footer).getByRole("link", { name: /get it on google play/i })
    ).toBeInTheDocument();
    expect(
      within(footer).getByRole("link", { name: /terms of service/i })
    ).toHaveAttribute("href", "/terms");
    expect(
      within(footer).getByRole("link", { name: /team@remiminderai\.com/i })
    ).toHaveAttribute("href", "mailto:team@remiminderai.com");
    expect(within(footer).getByText(/© 2026 REMIMINDERAI LLC/)).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(
      within(nav).getByRole("link", { name: "For Partners" })
    ).toHaveAttribute("href", "/pilot");
    expect(
      within(nav).getByRole("link", { name: "Partner with Us" })
    ).toHaveAttribute("href", "/pilot#inquiry");
    expect(
      within(nav).queryByRole("link", { name: /mailing list/i })
    ).not.toBeInTheDocument();

    expect(document.body.textContent).not.toMatch(
      /\b(hipaa|clinical|patients?|diagnos(?:is|es))\b/i
    );
  });

  test("shows inline errors and does not email an incomplete form", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your organization.")).toBeInTheDocument();
    expect(screen.getByText("Enter your role.")).toBeInTheDocument();
    expect(screen.getByText("Select an organization type.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid work email.")).toBeInTheDocument();
    expect(
      screen.getByText("Tell us the biggest challenge for your families.")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("rejects a malformed work email before sending", () => {
    renderPage();
    fillValidForm();
    fireEvent.change(screen.getByRole("textbox", { name: /work email/i }), {
      target: { value: "ada-at-harbor" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(screen.getByText("Enter a valid work email.")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("emails the inquiry through the existing notify route and confirms", async () => {
    renderPage();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(
      await screen.findByRole("status")
    ).toHaveTextContent("Thanks. We'll be in touch within 1 business day.");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/notify");
    const body = JSON.parse(options.body);
    expect(body.type).toBe("pilot_inquiry");
    expect(body.data).toMatchObject({
      name: "Ada Lovelace",
      organization: "Harbor Family Support",
      email: "ada@harbor.example",
      organizationType: ORG_TYPES[2],
      company_website: "",
    });
    expect(options.body).not.toMatch(/firestore|database/i);
  });

  test("sends a honeypot value so the server can drop it", async () => {
    renderPage();
    fillValidForm();
    const trap = document.querySelector('input[name="company_website"]');
    fireEvent.change(trap, { target: { value: "http://spam.example" } });
    fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));

    await screen.findByRole("status");
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.data.company_website).toBe("http://spam.example");
  });

  test("keeps the form up when email fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email failed" }),
    });
    renderPage();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(
      await screen.findByText(/couldn't send that just now/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit inquiry/i })).toBeEnabled();
  });
});
