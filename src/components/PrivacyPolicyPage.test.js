import React from "react";
import { render, waitFor } from "@testing-library/react";
import PrivacyPolicyPage from "./PrivacyPolicyPage";

jest.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ hash: globalThis.location.hash }),
  useNavigate: () => jest.fn(),
}));

describe("PrivacyPolicyPage anchor navigation", () => {
  const originalFetch = window.fetch;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeEach(() => {
    window.history.pushState(
      {},
      "",
      "/privacy#delete-individual-content"
    );
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        "# Privacy Policy\n\n### Delete Individual Content {#delete-individual-content}\n\nDelete your content.",
    });
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    window.cancelAnimationFrame = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    window.fetch = originalFetch;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  test("scrolls to the target after markdown rendering", async () => {
    render(<PrivacyPolicyPage />);

    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        block: "start",
      });
    });
  });
});
