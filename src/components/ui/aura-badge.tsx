import React, { useEffect, useMemo, useRef, useState } from 'react'

type AuraBadgeProps = {
  value: number
  className?: string
}

function formatAuraNumber(raw: number): string {
  if (raw >= 10000) {
    const k = raw / 1000
    const s = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)
    return `${s}k`
  }
  return raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const AuraBadge: React.FC<AuraBadgeProps> = ({ value, className }) => {
  const display = useMemo(() => formatAuraNumber(value), [value])
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const textColor = prefersDark ? '#FFFFFF' : '#000000'

  return (
    <div
      className={
        `fixed top-[8px] left-1/2 -translate-x-1/2 h-[32px] max-w-[220px] 
         inline-flex items-center justify-center rounded-[12px] z-[60] pointer-events-none 
         px-3 py-1 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(18,18,18,0.6)] 
         backdrop-blur-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${className ?? ''}`
      }
      aria-live="off"
      role="status"
    >
      {/* Icon 16x16 */}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false" className="flex-shrink-0">
        <defs>
          <linearGradient id="auraGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#9AE6B4" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        <circle cx="8" cy="8" r="7" fill="url(#auraGrad)" />
        <circle cx="8" cy="8" r="5" fill="transparent" stroke={textColor} strokeOpacity=".15" />
      </svg>
      <span className="w-[6px]" />
      <span
        className="whitespace-nowrap select-none"
        style={{
          fontSize: 15,
          fontWeight: 600,
          lineHeight: '20px',
          letterSpacing: '0.2px',
          color: textColor,
        }}
      >
        {display}
      </span>
    </div>
  )
}

export default AuraBadge


