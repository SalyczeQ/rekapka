"use client";

const URL_REGEX = /https?:\/\/[^\s<>()]+(?:\([^\s<>()]*\))*[^\s<>().,;:!?"'\])}]*/g;

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

export function LinkifiedText({ text, className }: LinkifiedTextProps) {
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;

  const regex = new RegExp(URL_REGEX);
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    // Block javascript: protocol for XSS safety
    if (!url.toLowerCase().startsWith("javascript:")) {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>
      );
    } else {
      parts.push(url);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
