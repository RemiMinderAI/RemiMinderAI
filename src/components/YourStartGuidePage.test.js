import React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import YourStartGuidePage from "./YourStartGuidePage";
import MarketingHeader from "./MarketingHeader";

function renderGuide() {
  return render(
    <MemoryRouter>
      <YourStartGuidePage />
    </MemoryRouter>
  );
}

describe("Your Start Guide", () => {
  test("renders every manual section and subsection", () => {
    renderGuide();

    expect(
      screen.getByRole("heading", { level: 1, name: "Your Start Guide" })
    ).toBeInTheDocument();

    [
      "1. Getting Started",
      "2. Recording a Doctor Visit",
      "3. Visit Summaries",
      "4. Care Team",
      "5. Reminders",
      "6. Scanning Documents",
      "7. Profile and Settings",
    ].forEach((name) => {
      expect(
        screen.getByRole("heading", { level: 2, name })
      ).toBeInTheDocument();
    });

    [
      "1.1 System Requirements",
      "1.2 Download and Install",
      "1.3 Create Your Account",
      "1.4 Select Your Role",
      "2.1 Before You Record",
      "2.2 Start a Recording",
      "2.3 Stop and Save",
      "3.1 Viewing Your Summary",
      "3.2 Sharing with Family or Caregivers",
      "3.3 Changing Summary Language",
      "4.1 Inviting a Caregiver or Family Member",
      "4.2 Accepting an Invite (Caregiver)",
      "4.3 Managing Your Care Team",
      "5.1 Creating a Reminder with Vox (Voice)",
      "5.2 Creating a Reminder Manually",
      "5.3 Reminder Types",
      "5.4 When a Reminder Fires",
      "5.5 Caregiver View",
      "6.1 Scanning a Prescription or Lab Report",
      "6.2 Viewing Scanned Documents",
      "7.1 Changing Your Summary Language",
      "7.2 Deleting Your Account",
    ].forEach((name) => {
      expect(
        screen.getByRole("heading", { level: 3, name })
      ).toBeInTheDocument();
    });
  });

  test("renders voice examples, warning, downloads, and support contact", () => {
    renderGuide();

    expect(
      screen.getByText(
        /remind me to take my thyroid pill at 8 AM every morning/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Please note:")).toBeInTheDocument();
    expect(
      screen.getByText(/this action cannot be undone/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /ready to get started/i })
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/download on the app store/i)
    ).toBeInTheDocument();
    expect(screen.getByAltText(/get it on google play/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /team@remiminderai\.com/i }).length
    ).toBeGreaterThanOrEqual(1);
  });

  test("replaces Use Cases in desktop and mobile navigation", () => {
    render(
      <MemoryRouter>
        <MarketingHeader scrolled={false} />
      </MemoryRouter>
    );

    const desktopNav = screen.getByRole("navigation", { name: "Main" });
    expect(
      within(desktopNav).getByRole("link", { name: "Your Start Guide" })
    ).toHaveAttribute("href", "/your-start-guide");
    expect(
      within(desktopNav).queryByRole("link", { name: "Use Cases" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const navs = screen.getAllByRole("navigation", { name: "Main" });
    const mobileNav = navs[1];
    expect(
      within(mobileNav).getByRole("link", { name: "Your Start Guide" })
    ).toHaveAttribute("href", "/your-start-guide");
    expect(
      within(mobileNav).queryByRole("link", { name: "Use Cases" })
    ).not.toBeInTheDocument();
  });
});
