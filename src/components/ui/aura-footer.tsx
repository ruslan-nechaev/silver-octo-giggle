import React, { useEffect, useMemo, useRef, useState } from 'react'

type AuraFooterProps = {
  value: number
  progress?: number | null // unused in minimalist mode
  onPlanClick?: () => void
  className?: string
}

function formatAuraNumber(n: number): string {
  if (n >= 10000) {
    const k = n / 1000
    const s = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)
    return `${s}k`
  }
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const AuraFooter: React.FC<AuraFooterProps> = ({ value, onPlanClick, className }) => {
  // Minimalist: "Aura" + gold framed value on the left, Plan button on the right
  const [pulse, setPulse] = useState(false)
  const prevRef = useRef(value)
  useEffect(() => {
    if (value > prevRef.current) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 240)
      prevRef.current = value
      return () => clearTimeout(t)
    }
    prevRef.current = value
  }, [value])

  const display = useMemo(() => formatAuraNumber(value), [value])

  return (
    <div className={`w-full flex items-center justify-between ${className ?? ''}`}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <span className="select-none" style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, textShadow: '0 0 6px rgba(255,255,255,0.35)' }}>Aura</span>
        <span
          className="select-none inline-flex items-center justify-center px-2 py-[2px] rounded-[6px] border"
          style={{
            borderColor: '#FFD700',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '20px',
            transform: pulse ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 200ms ease, box-shadow 200ms ease',
            boxShadow: pulse ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
          }}
        >
          {display}
        </span>
      </div>

      <button
        type="button"
        onClick={onPlanClick}
        className="ml-3 w-[36px] h-[36px] rounded-[10px] bg-[#007AFF] flex items-center justify-center active:scale-95"
        aria-label="Plan"
        style={{ pointerEvents: 'auto' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>
    </div>
  )
}

export default AuraFooter


