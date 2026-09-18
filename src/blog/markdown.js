import React from "react";
import { Link } from "react-router-dom";

function renderInline(text, keyPrefix = "i") {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (!part) return null;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const key = `${keyPrefix}-a-${idx}`;
      if (href.startsWith("/")) {
        return (
          <Link key={key} to={href}>
            {label}
          </Link>
        );
      }
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          key={key}
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {label}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-b-${idx}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={`${keyPrefix}-em-${idx}`}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part}</React.Fragment>;
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Strip markdown markers for previews, descriptions, and word counts. */
export function markdownToPlainText(md) {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^---$/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function firstChars(text, max = 155) {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= max) return collapsed;
  return collapsed.slice(0, max);
}

export function readingMinutes(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function markdownToReact(md, { leadClassName } = {}) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed === "---") {
      blocks.push(<hr key={`hr-${key++}`} />);
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      const title = trimmed.slice(4).trim();
      blocks.push(
        <h3 key={`h3-${key++}`} id={slugify(title)}>
          {renderInline(title, `h3-${key}`)}
        </h3>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      const title = trimmed.slice(3).trim();
      blocks.push(
        <h2 key={`h2-${key++}`} id={slugify(title)}>
          {renderInline(title, `h2-${key}`)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${key++}`}>
          {items.map((item, liIdx) => (
            <li key={`li-${liIdx}`}>{renderInline(item, `li-${liIdx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const para = [];
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        !next ||
        next === "---" ||
        next.startsWith("# ") ||
        next.startsWith("## ") ||
        next.startsWith("### ") ||
        next.startsWith("- ")
      ) {
        break;
      }
      para.push(next);
      i += 1;
    }

    const joined = para.join(" ").trim();
    if (!joined) continue;

    const isLead =
      joined.startsWith("*") && joined.endsWith("*") && !joined.includes("**");
    blocks.push(
      <p
        key={`p-${key++}`}
        className={isLead ? leadClassName : undefined}
      >
        {renderInline(joined, `p-${key}`)}
      </p>
    );
  }

  return blocks;
}
