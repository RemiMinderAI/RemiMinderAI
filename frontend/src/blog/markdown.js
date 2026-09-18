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
    .replace(/^>\s?/gm, "")
    .replace(/\|/g, " ")
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

function tableCells(value) {
  return value
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(value) {
  if (!value || !value.trim().startsWith("|")) return false;
  const cells = tableCells(value);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

export function markdownToReact(md, { leadClassName } = {}) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;
  let skippedTitle = false;

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

    if (trimmed.startsWith("# ") && !skippedTitle) {
      skippedTitle = true;
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      const title = trimmed.slice(2).trim();
      blocks.push(
        <h2 key={`h1as2-${key++}`} id={slugify(title)}>
          {renderInline(title, `h1-${key}`)}
        </h2>
      );
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

    if (trimmed.startsWith(">")) {
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push(
        <blockquote key={`bq-${key++}`}>
          {renderInline(quote.join(" "), `bq-${key}`)}
        </blockquote>
      );
      continue;
    }

    if (trimmed.startsWith("|") && isTableDivider(lines[i + 1] || "")) {
      const headers = tableCells(trimmed);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(tableCells(lines[i]));
        i += 1;
      }
      blocks.push(
        <div key={`table-${key++}`} className="blogTableWrap">
          <table>
            <thead>
              <tr>
                {headers.map((header, headerIndex) => (
                  <th key={`${headerIndex}-${header}`}>
                    {renderInline(header, `th-${headerIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {headers.map((_, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>
                      {renderInline(row[cellIndex] || "", `td-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        next.startsWith("- ") ||
        next.startsWith(">") ||
        next.startsWith("|")
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
