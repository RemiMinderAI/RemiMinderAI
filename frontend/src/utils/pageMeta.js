import { useEffect } from "react";

const SITE_ORIGIN = "https://remiminderai.com";

function upsertMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute("content");
  el.setAttribute("content", content);
  return { el, created, previous };
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  const created = !el;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  const previous = el.getAttribute("href");
  el.setAttribute("href", href);
  return { el, created, previous };
}

export function absoluteUrl(path) {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Sets document title, description, Open Graph, and canonical tags for a route.
 * Restores the previous values on unmount so the homepage tags return.
 */
export function usePageMeta({ title, description, path, type = "website" }) {
  const url = absoluteUrl(path);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descriptionMeta = upsertMeta("name", "description", description);
    const ogTitle = upsertMeta("property", "og:title", title);
    const ogDescription = upsertMeta("property", "og:description", description);
    const ogType = upsertMeta("property", "og:type", type);
    const ogUrl = upsertMeta("property", "og:url", url);
    const canonical = upsertCanonical(url);

    return () => {
      document.title = previousTitle;
      const restore = (record, attr) => {
        if (record.created) {
          record.el.remove();
          return;
        }
        if (record.previous == null) {
          record.el.removeAttribute(attr);
        } else {
          record.el.setAttribute(attr, record.previous);
        }
      };
      restore(descriptionMeta, "content");
      restore(ogTitle, "content");
      restore(ogDescription, "content");
      restore(ogType, "content");
      restore(ogUrl, "content");
      restore(canonical, "href");
    };
  }, [title, description, url, type]);
}

export { SITE_ORIGIN };
