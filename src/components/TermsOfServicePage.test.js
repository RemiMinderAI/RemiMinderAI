import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TermsOfServicePage from "./TermsOfServicePage";

jest.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ hash: "" }),
  useNavigate: () => jest.fn(),
}));

describe("TermsOfServicePage", () => {
  const originalFetch = window.fetch;

  beforeEach(() => {
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        "# Terms of Service\n\n**RemiMinderAI LLC** · Effective date: July 31, 2026\n\n## 1. What RemiMinderAI Is\n\nRemiMinderAI helps people.\n\n## 18. Contact Us\n\nEmail: team@remiminderai.com\n",
    });
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  test("renders the supplied headings, effective date, and contact line", async () => {
    render(<TermsOfServicePage />);

    expect(await screen.findByRole("heading", { name: "Terms of Service" })).toBeInTheDocument();
    expect(screen.getByText(/Effective date: July 31, 2026/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. What RemiMinderAI Is" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "18. Contact Us" })).toBeInTheDocument();
    expect(screen.getByText(/team@remiminderai.com/)).toBeInTheDocument();
  });

  test("loads /terms_of_service.md", async () => {
    render(<TermsOfServicePage />);
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith("/terms_of_service.md");
    });
  });
});
