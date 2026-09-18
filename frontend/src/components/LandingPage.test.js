import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";

function renderHome() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe("LandingPage hero redesign", () => {
  test("states the product category, caregiver headline, and trust signals immediately", () => {
    renderHome();

    const categoryBadges = screen.getAllByText(/AI healthcare companion app/i);
    expect(categoryBadges.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /your mom's doctor said something important/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/records medical appointments, generates AI summaries/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/free 14-day trial/i)).toBeInTheDocument();
    expect(screen.getByText(/no credit card required/i)).toBeInTheDocument();

    expect(screen.getByText(/HIPAA-conscious design/i)).toBeInTheDocument();
    expect(screen.getByText(/^Encrypted$/i)).toBeInTheDocument();
    expect(screen.getByText(/iOS \+ Android/i)).toBeInTheDocument();
    expect(screen.getByText(/^10 languages$/i)).toBeInTheDocument();

    expect(
      screen.getByAltText(/home dashboard with today's schedule/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/patient overview with medication reminders/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/visit details with AI visit summary/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^visit summary$/i)).toBeInTheDocument();
    expect(screen.getByText(/^patient overview$/i)).toBeInTheDocument();
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
      screen.getByText(/supporting loved ones with medical appointments/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/kitchen table with prescriptions/i)
    ).toBeInTheDocument();
  });
});
