import React, { useEffect, useMemo, useRef, useState } from 'react'

type AuraBadgeProps = {
  value: number
  className?: string
  variant?: 'fixed' | 'inline'
}

function formatAuraNumber(raw: number): string {
  if (raw >= 10000) {
    const k = raw / 1000
    const s = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)
    return `${s}k`
  }
  return raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const AuraBadge: React.FC<AuraBadgeProps> = ({ value, className, variant = 'fixed' }) => {
  // Track increases to pulse the frame
  const [display, setDisplay] = useState<number>(value)
  const prevRef = useRef<number>(value)
  const [pulse, setPulse] = useState<boolean>(false)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (value !== display) setDisplay(value)
    if (!reducedMotion && value > prevRef.current) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 280)
      prevRef.current = value
      return () => clearTimeout(t)
    }
    prevRef.current = value
  }, [value, display, reducedMotion])

  const formatted = useMemo(() => formatAuraNumber(display), [display])

  return (
    <div
      className={`${variant === 'fixed' ? 'fixed top-[10px] left-[12px] z-[60]' : ''} inline-flex items-center ${variant === 'fixed' ? 'pointer-events-none' : ''} ${className ?? ''}`}
      style={{ gap: 8 }}
      aria-live="polite"
      role="status"
    >
      {/* Left label: Aura */}
      <span
        className="select-none"
        style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '20px',
          textShadow: '0 0 6px rgba(255,255,255,0.35)',
        }}
      >
        Aura
      </span>

      {/* Right framed number */}
      <span
        className={`select-none inline-flex items-center justify-center px-2 py-[2px] rounded-[6px] border`}
        style={{
          borderColor: '#FFD700',
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '20px',
          boxShadow: pulse ? '0 0 10px rgba(255,215,0,0.55)' : 'none',
          transition: 'box-shadow 220ms ease, transform 220ms ease',
          transform: pulse ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {formatted}
      </span>
    </div>
  )
}

export default AuraBadge


