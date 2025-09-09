"use client";
import React from "react";

type Props = {
  label: string;
  className?: string;
  onClick?: () => void;
};

// Gradient border without glow; thin animated ring only
export function RainbowBorderButton({ label, className = "", onClick }: Props) {
  return (
    <div className={`relative inline-flex rounded-xl p-[2px] ${className}`}>
      <div className="absolute inset-0 rounded-xl" style={{
        background: "linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000)",
        backgroundSize: "400% 400%",
        animation: "rainbow-move 16s linear infinite"
      }} />
      <button
        type="button"
        onClick={onClick}
        className="relative z-[1] h-10 min-w-[120px] px-4 rounded-[10px] bg-black text-white font-semibold cursor-pointer select-none"
      >
        {label}
      </button>
      <style>{`
        @keyframes rainbow-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default RainbowBorderButton;


