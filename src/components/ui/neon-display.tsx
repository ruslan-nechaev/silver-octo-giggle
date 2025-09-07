"use client";
import React from "react";

type NeonDisplayProps = {
  text?: string;
  className?: string;
};

export default function NeonDisplay({ text = "K0001ut UI", className = "" }: NeonDisplayProps) {
  const parts = Array.from(text);
  return (
    <div className={`inline-flex items-baseline gap-1 ${className}`}>
      {parts.map((ch, idx) => {
        const isDigit = /[0-9]/.test(ch);
        return (
          <span
            key={idx}
            className={isDigit ? "font-bold text-[13px] sm:text-[14px] md:text-[15px] text-[#00ff66]" : "font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-white"}
            style={isDigit ? { textShadow: "0 0 6px rgba(0,255,120,0.9), 0 0 12px rgba(0,255,120,0.6)" } : undefined}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}


