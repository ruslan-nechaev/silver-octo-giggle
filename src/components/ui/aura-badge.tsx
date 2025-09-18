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

  const isFixed = variant === 'fixed'
  return (
    <div
      className={`${isFixed ? 'fixed top-[10px] left-[12px] z-[60] pointer-events-none' : 'relative'} inline-flex items-center ${className ?? ''}`}
      style={{ gap: 8, height: isFixed ? undefined : 44, padding: isFixed ? undefined : '0 10px', borderRadius: isFixed ? undefined : 12 }}
      aria-live="polite"
      role="status"
    >
      {/* Inline blurred container background */}
      {!isFixed && (
        <div
          className="absolute inset-0 rounded-[12px] backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            zIndex: 0
          }}
        />
      )}
      {/* Left label: Aura */}
      <span
        className="select-none"
        style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Aura
      </span>

      {/* Right framed number */}
      <span
        className={`select-none inline-flex items-center justify-center px-2 py-[2px] rounded-[6px] border`}
        style={{
          borderColor: '#FFD700',
          borderWidth: 2,
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '20px',
          boxShadow: pulse ? '0 0 12px rgba(255,215,0,0.55)' : 'none',
          transition: 'box-shadow 200ms ease, transform 200ms ease',
          transform: pulse ? 'scale(1.10)' : 'scale(1)',
          position: 'relative',
          zIndex: 1,
          background: 'transparent'
        }}
      >
        {formatted}
      </span>

      {/* Subtle aura glow on increase */}
      {!isFixed && pulse && (
        <div
          className="pointer-events-none absolute -inset-1 rounded-[14px]"
          style={{ boxShadow: '0 0 18px rgba(255,215,0,0.35)' }}
        />
      )}
    </div>
  )
}

export default AuraBadge


