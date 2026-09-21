import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import BlogIndexPage from "./BlogIndexPage";
import BlogArticlePage from "./BlogArticlePage";
import MarketingHeader from "./MarketingHeader";
import { getPostBySlug } from "../blog/posts";

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Blog", () => {
  test("lists articles as cards with title, preview, date, and read time", () => {
    renderAt("/blog");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /remember what the doctor said/i,
      })
    ).toBeInTheDocument();

    const card = screen.getByRole("link", {
      name: /how to remember what the doctor said after your appointment/i,
    });
    expect(card).toHaveAttribute("href", "/blog/how-to-remember-what-doctor-said");
    expect(
      within(card).getByText(
        /you walked out of the appointment confident you'd remember everything/i
      )
    ).toBeInTheDocument();
    expect(within(card).getByText(/september 18, 2026/i)).toBeInTheDocument();
    expect(within(card).getByText(/min read/i)).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /how to share medical information with family members who live far away/i,
      })
    ).toHaveAttribute(
      "href",
      "/blog/how-to-share-medical-information-with-family-members-who-live-far-away"
    );
    expect(
      screen.getByRole("link", {
        name: /best apps for managing elderly parents' medical care in 2026/i,
      })
    ).toHaveAttribute(
      "href",
      "/blog/best-apps-managing-elderly-parents-medical-care-2026"
    );
  });

  test("renders the article with H1, meta, H2 sections, and download CTA", () => {
    renderAt("/blog/how-to-remember-what-doctor-said");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /how to remember what the doctor said after your appointment/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/september 18, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/min read/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /why we forget so quickly/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /how RemiMinderAI helps/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /download remiminderai/i })
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/download on the app store/i)
    ).toBeInTheDocument();
    expect(screen.getByAltText(/get it on google play/i)).toBeInTheDocument();

    const post = getPostBySlug("how-to-remember-what-doctor-said");
    expect(document.title).toBe(`${post.title} | RemiMinderAI`);
    expect(
      document.head.querySelector('meta[name="description"]')
    ).toHaveAttribute("content", post.description);
    expect(post.description.length).toBeLessThanOrEqual(155);
    expect(
      document.head.querySelector('meta[property="og:type"]')
    ).toHaveAttribute("content", "article");
    expect(
      document.head.querySelector('meta[property="og:url"]')
    ).toHaveAttribute(
      "content",
      "https://remiminderai.com/blog/how-to-remember-what-doctor-said"
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://remiminderai.com/blog/how-to-remember-what-doctor-said"
    );
  });

  test("renders the long-distance caregiving article", () => {
    renderAt(
      "/blog/how-to-share-medical-information-with-family-members-who-live-far-away"
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /how to share medical information with family members who live far away/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /why long-distance caregiving can be so difficult/i,
      })
    ).toBeInTheDocument();
    expect(document.title).toMatch(/how to share medical information/i);
    expect(
      document.head.querySelector('meta[property="og:type"]')
    ).toHaveAttribute("content", "article");
  });

  test("renders the elderly parent apps article with sections and table", () => {
    renderAt("/blog/best-apps-managing-elderly-parents-medical-care-2026");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /best apps for managing elderly parents' medical care in 2026/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /medication reminder apps/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText(/if your biggest problem is/i)).toBeInTheDocument();
    expect(document.title).toMatch(/best apps for managing elderly parents/i);
  });

  test("unknown slug shows a not-found state", () => {
    renderAt("/blog/does-not-exist");
    expect(
      screen.getByRole("heading", { name: /article not found/i })
    ).toBeInTheDocument();
  });

  test("puts Blog in the site nav between Your Start Guide and About", () => {
    render(
      <MemoryRouter>
        <MarketingHeader scrolled={false} />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: /main/i });
    const links = within(nav)
      .getAllByRole("link")
      .map((el) => el.textContent);

    const startGuide = links.indexOf("Your Start Guide");
    const blog = links.indexOf("Blog");
    const about = links.indexOf("About");
    expect(startGuide).toBeGreaterThanOrEqual(0);
    expect(blog).toBe(startGuide + 1);
    expect(about).toBeGreaterThan(blog);
    expect(links).not.toContain("Use Cases");
  });
});
