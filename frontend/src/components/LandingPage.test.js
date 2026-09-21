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

  test("drops the bottom Get Started Today CTA and keeps the trial proof line", () => {
    renderHome();

    expect(screen.queryByText(/get started today/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /start caring with confidence/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/zero to beta in 7 weeks/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/free 14-day trial/i).length).toBeGreaterThanOrEqual(2);
  });

  test("shows real-user testimonials and a featured Instagram video review", () => {
    renderHome();

    expect(screen.getByText(/what users are saying/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /real people\. real appointments\. real clarity\./i,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(/beta program feedback/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/private beta in progress/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/beta user perspective/i)).not.toBeInTheDocument();

    expect(screen.getByText(/lee ann/i)).toBeInTheDocument();
    expect(
      screen.getByText(/even just seeing them on the Overview screen/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/physical therapist/i)).toBeInTheDocument();
    expect(
      screen.getByText(/hazel hawkins medical center, hollister/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/patrick flynn uses remiminderai to take care of his mom/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/soumendranath/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/video review/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /soumendranath's review on instagram/i })
    ).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/DdZ3xNxx9Et/?hl=en"
    );
  });

  test("tells real-life caregiving stories across cities", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /what it looks like in real life/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/9:45 AM, Monday\. San Jose, CA\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/she opens remiminderai and taps record/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you didn't have to call\. you didn't have to guess/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/in delhi, a son finally gets the full picture/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/now anish knows what ["“]fine["”] really means/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/in zurich, a grandson worries less/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/in lisbon, a daughter stays informed/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/thursday, 8:00 PM\. back in san jose/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/caregiving doesn't stop at borders/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/hindi, bengali, spanish, german, portuguese/i)
    ).toBeInTheDocument();
  });

  test("does not show Get Started in the home nav bar", () => {
    renderHome();

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).queryByRole("link", { name: /^get started$/i })).not.toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /^home$/i })).toBeInTheDocument();
  });
});
