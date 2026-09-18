import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    NavLink: ({ children, to, ...props }) => (
      <a href={typeof to === "string" ? to : "/"} {...props}>
        {children}
      </a>
    ),
  };
});

describe("LandingPage hero redesign", () => {
  test("states the product category, caregiver headline, and trust signals immediately", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

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
    expect(screen.getByText(/10 languages/i)).toBeInTheDocument();

    expect(
      screen.getByAltText(/home dashboard with today's schedule/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/visit summary · español/i)).toBeInTheDocument();
    expect(screen.getByText(/resumen de visita/i)).toBeInTheDocument();
  });

  test("does not render the old hero carousel", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText(/remiminderai story/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/every healthcare journey begins with a conversation/i)
    ).not.toBeInTheDocument();
  });

  test("leads Who it's for with family caregivers and the kitchen-table image", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

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
