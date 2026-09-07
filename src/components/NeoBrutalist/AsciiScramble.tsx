"use client";

interface AsciiScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  triggerOnScroll?: boolean;
}

export default function AsciiScramble({
  text,
  className = "",
}: AsciiScrambleProps) {
  return <span className={className}>{text}</span>;
}
