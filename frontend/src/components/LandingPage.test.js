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
    expect(
      screen.getByRole("heading", {
        name: /the appointment lasted 12 minutes/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /say it once/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/new in the app/i)).toBeInTheDocument();
    expect(screen.queryByText(/loved by early beta users/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/being there for someone doesn't always mean being in the room/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/every appointment contains important decisions/i)
    ).not.toBeInTheDocument();
  });

  test("drops the bottom Get Started Today CTA and keeps the trial proof line", () => {
    renderHome();

    expect(screen.queryByText(/get started today/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /start caring with confidence/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/zero to beta in 7 weeks/i)).not.toBeInTheDocument();
    expect(screen.getByText(/free 14-day trial/i)).toBeInTheDocument();
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

  test("shows the San Jose story with app screenshots and language summaries", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /from the waiting room to your phone/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/how it works in practice/i)).toBeInTheDocument();
    expect(
      screen.getByText(/a real appointment\. a real summary\. a real reminder\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^step 1$/i)).toBeInTheDocument();
    expect(screen.getByText(/^step 2$/i)).toBeInTheDocument();
    expect(screen.getByText(/^step 3$/i)).toBeInTheDocument();
    expect(screen.getByText(/9:45 AM\. Monday\. San Jose, CA\./i)).toBeInTheDocument();
    expect(screen.getByText(/10:32 AM\. You're at work\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/thursday, 8:00 PM\. back in san jose/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/in delhi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/in zurich/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/in lisbon/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /record visit screen with consent checkboxes/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /conditions discussed, medication, and next to do/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /atorvastatin, metoprolol/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /one visit\. any language/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/^español$/i)).toBeInTheDocument();
    expect(screen.getByText("हिन्दी")).toBeInTheDocument();
    expect(
      screen.getByText(/english, bengali, portuguese, french, german, mandarin, arabic/i)
    ).toBeInTheDocument();
  });

  test("compares family chat, spreadsheets, and RemiMinderAI in cards", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /the tools you're already using weren't built for this/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/family chats, shared notes, and spreadsheets get you halfway/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /family chat/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /shared spreadsheet/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^remiminderai$/i })).toBeInTheDocument();
    expect(
      screen.getByText(/recap from whoever was in the room, half-remembered/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/recorded and ai-summarized, word for word/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/summaries in 10 languages/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  test("does not show Get Started in the home nav bar", () => {
    renderHome();

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).queryByRole("link", { name: /^get started$/i })).not.toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /^home$/i })).toBeInTheDocument();
  });
});
