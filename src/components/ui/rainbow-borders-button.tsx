"use client";
import React from "react";

type Props = {
  label: string;
  className?: string;
  onClick?: () => void;
};

export function RainbowBorderButton({ label, className = "", onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2.5 px-4 h-10 rounded-xl text-white font-semibold cursor-pointer transition-colors duration-150 bg-black border border-white ${className}`}
    >
      {label}
    </button>
  );
}

export default RainbowBorderButton;


