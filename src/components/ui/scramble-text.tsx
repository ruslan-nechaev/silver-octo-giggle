"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type ScrambleTextProps = {
  texts: string[];
  className?: string;
  intervalMs?: number; // time to hold final text before switching
  frameMs?: number; // update speed during scrambling
  cycleChars?: string; // pool of characters for scrambling
};

const DEFAULT_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>!@#$%^&*_+-=|;:,.";

export default function ScrambleText({
  texts,
  className = "",
  intervalMs = 1600,
  frameMs = 28,
  cycleChars = DEFAULT_POOL,
}: ScrambleTextProps) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const target = texts[index] ?? "";
  const maxLen = useMemo(() => Math.max(...texts.map((t) => t.length)), [texts]);

  useEffect(() => {
    // Scramble from empty to target
    const start = performance.now();
    const revealDuration = Math.min(1000, Math.max(400, target.length * 40));

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / revealDuration);
      const revealCount = Math.floor(t * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (i < revealCount) {
          out += target[i];
        } else {
          const rnd = cycleChars[(Math.random() * cycleChars.length) | 0] || "";
          out += rnd;
        }
      }
      setDisplay(out);
      if (t < 1) {
        rafRef.current = window.setTimeout(() => {
          rafRef.current = requestAnimationFrame(step);
        }, frameMs) as unknown as number;
      } else {
        setDisplay(target);
        // hold, then advance
        timerRef.current = window.setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
        }, intervalMs) as unknown as number;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [target, texts.length, intervalMs, frameMs, cycleChars]);

  // Preserve width to avoid layout shift between texts of different length
  const widthPad = useMemo(() => Array(Math.max(0, maxLen - display.length)).fill(" ").join(""), [maxLen, display.length]);

  return (
    <span className={`font-mono tracking-wide ${className}`} aria-live="polite">
      {display}
      <span className="opacity-0 select-none">{widthPad}</span>
    </span>
  );
}


