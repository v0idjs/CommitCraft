import React from "react";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  // Simple regex-based markdown parser that converts PR descriptions to structured React elements
  const lines = content.split("\n");

  let inList = false;
  let inCodeBlock = false;
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let codeLines: string[] = [];

  const flushList = (key: number) => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul id={`md-ul-${key}`} key={`list-${key}`} className="list-disc pl-5 my-3 space-y-1.5 text-gray-300">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
    inList = false;
  };

  const parseInlineStyles = (text: string) => {
    // Basic bold (**text**) and code (`code`) parser
    const parts: React.ReactNode[] = [];
    let tempText = text;
    let index = 0;

    // Bold pattern: **something**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;

    while ((match = boldRegex.exec(tempText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(tempText.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`b-${index++}`} className="font-semibold text-white">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < tempText.length) {
      parts.push(tempText.substring(lastIndex));
    }

    // Secondary parsing for inline code: `code`
    return parts.map((part) => {
      if (typeof part === "string") {
        const subParts: React.ReactNode[] = [];
        const codeRegex = /`(.*?)`/g;
        let subMatch;
        let subLastIndex = 0;
        let subIdx = 0;

        while ((subMatch = codeRegex.exec(part)) !== null) {
          if (subMatch.index > subLastIndex) {
            subParts.push(part.substring(subLastIndex, subMatch.index));
          }
          subParts.push(
            <code key={`code-${subIdx++}`} className="px-1.5 py-0.5 bg-gray-800 text-teal-400 font-mono text-xs rounded border border-gray-700/60">
              {subMatch[1]}
            </code>
          );
          subLastIndex = codeRegex.lastIndex;
        }

        if (subLastIndex < part.length) {
          subParts.push(part.substring(subLastIndex));
        }

        return subParts.length > 0 ? <React.Fragment key={`frag-${subIdx}`}>{subParts}</React.Fragment> : part;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code block
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // flush code block
        elements.push(
          <pre key={`codeblock-${i}`} className="p-4 bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto my-3 font-mono text-xs text-teal-300">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushList(i);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Handle Headers
    if (line.trim().startsWith("### ")) {
      flushList(i);
      const title = line.replace("### ", "").trim();
      elements.push(
        <h4 key={`h3-${i}`} className="text-sm font-bold text-gray-200 mt-5 mb-2 flex items-center gap-2 tracking-wide uppercase border-b border-gray-800/60 pb-1">
          {parseInlineStyles(title)}
        </h4>
      );
      continue;
    }

    if (line.trim().startsWith("## ")) {
      flushList(i);
      const title = line.replace("## ", "").trim();
      elements.push(
        <h3 key={`h2-${i}`} className="text-base font-bold text-teal-400 mt-6 mb-3 tracking-wide">
          {parseInlineStyles(title)}
        </h3>
      );
      continue;
    }

    if (line.trim().startsWith("# ")) {
      flushList(i);
      const title = line.replace("# ", "").trim();
      elements.push(
        <h2 key={`h1-${i}`} className="text-lg font-extrabold text-white mt-6 mb-3">
          {parseInlineStyles(title)}
        </h2>
      );
      continue;
    }

    // Handle bullet list item
    const listMatch = line.match(/^[\s\s]*[-*+]\s+(.*)/);
    if (listMatch) {
      inList = true;
      const itemContent = listMatch[1];
      currentListItems.push(
        <li key={`li-${i}-${currentListItems.length}`} className="leading-relaxed">
          {parseInlineStyles(itemContent)}
        </li>
      );
      continue;
    }

    // If we were in a list but the line is empty or does not start with bullet, flush
    if (line.trim() === "" && inList) {
      flushList(i);
      continue;
    }

    // Plain line description
    if (line.trim() !== "") {
      if (inList) {
        // Multiline list item support or append
        const lastIdx = currentListItems.length - 1;
        if (lastIdx >= 0) {
          // Append as plain line next to list item
          // Or we just close the list and treat it as a paragraph
          flushList(i);
          elements.push(
            <p key={`p-${i}`} className="text-sm text-gray-300 leading-relaxed my-2">
              {parseInlineStyles(line)}
            </p>
          );
        } else {
          flushList(i);
          elements.push(
            <p key={`p-${i}`} className="text-sm text-gray-300 leading-relaxed my-2">
              {parseInlineStyles(line)}
            </p>
          );
        }
      } else {
        elements.push(
          <p key={`p-${i}`} className="text-sm text-gray-300 leading-relaxed my-2">
            {parseInlineStyles(line)}
          </p>
        );
      }
    } else {
      flushList(i);
    }
  }

  // Flush any final list if line end is reached
  flushList(999);

  return (
    <div className="space-y-2 text-sm text-gray-300 antialiased selection:bg-teal-500 selection:text-black">
      {elements}
    </div>
  );
}
