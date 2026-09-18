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

  test("unknown slug shows a not-found state", () => {
    renderAt("/blog/does-not-exist");
    expect(
      screen.getByRole("heading", { name: /article not found/i })
    ).toBeInTheDocument();
  });

  test("puts Blog in the site nav between Use Cases and About", () => {
    render(
      <MemoryRouter>
        <MarketingHeader scrolled={false} />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: /main/i });
    const links = within(nav)
      .getAllByRole("link")
      .map((el) => el.textContent);

    const useCases = links.indexOf("Use Cases");
    const blog = links.indexOf("Blog");
    const about = links.indexOf("About");
    expect(useCases).toBeGreaterThanOrEqual(0);
    expect(blog).toBe(useCases + 1);
    expect(about).toBeGreaterThan(blog);
  });
});
