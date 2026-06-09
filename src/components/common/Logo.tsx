import React from "react";

interface LogoProps {
  /** Optional text to display below the logo */
  text?: string;
  /** Show the text if true; defaults to true when `text` is provided */
  showText?: boolean;
}

/**
 * Simple logo component.
 * Renders an inline SVG (gradient teal‑purple) and optionally a text label.
 * The component can be used with or without the text by toggling `showText`.
 */
const Logo: React.FC<LogoProps> = ({ text, showText }) => {
  const displayText = showText ?? !!text;
  return (
    <div className="flex flex-col items-center gap-2">
      {/* SVG logo – scalable and works in dark / light themes */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#logoGrad)" />
        <text
          x="32"
          y="37"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="28"
          fill="white"
        >
          📚
        </text>
      </svg>
      {displayText && text && (
        <span className="text-base font-medium text-foreground">{text}</span>
      )}
    </div>
  );
};

export default Logo;
