import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import LandingPage from "./LandingPage";

function renderHome() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe("LandingPage hero redesign", () => {
  test("states the product, workflow, and two readable app screenshots immediately", () => {
    renderHome();

    expect(
      screen.getAllByText(/AI healthcare companion app/i).length
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /your mom's doctor said something important/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/record the visit, get an AI summary, scan lab results/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^Record$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Summarize$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Scan$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/voice reminders/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/share live/i)).toBeInTheDocument();

    expect(
      screen.getByAltText(/home dashboard with today's schedule/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/visit summary with medications and next steps/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByAltText(/patient overview with medication reminders/i)
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /record the conversation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /get an AI summary/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /scan documents/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /set reminders by voice/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /share with family in real time/i })
    ).toBeInTheDocument();
  });

  test("does not render the old hero carousel", () => {
    renderHome();

    expect(screen.queryByLabelText(/remiminderai story/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/every healthcare journey begins with a conversation/i)
    ).not.toBeInTheDocument();
  });

  test("leads Who it's for with family caregivers and the kitchen-table image", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /built for family caregivers/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/kitchen table with prescriptions/i)
    ).toBeInTheDocument();
  });

  test("drops the bottom Get Started Today CTA and adds PT beta feedback", () => {
    renderHome();

    expect(screen.queryByText(/get started today/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /start caring with confidence/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/zero to beta in 7 weeks/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/free 14-day trial/i).length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText(/physical therapist/i)).toBeInTheDocument();
    expect(
      screen.getByText(/without really understanding their follow-up instructions/i)
    ).toBeInTheDocument();
  });

  test("does not show Get Started in the home nav bar", () => {
    renderHome();

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).queryByRole("link", { name: /^get started$/i })).not.toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /^home$/i })).toBeInTheDocument();
  });
});
