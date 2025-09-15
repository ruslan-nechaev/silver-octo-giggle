import React, { useEffect, useMemo, useRef, useState } from 'react'

type AuraFooterProps = {
  value: number
  progress?: number | null // 0..1, null => indeterminate shimmer
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

export const AuraFooter: React.FC<AuraFooterProps> = ({ value, progress = 0, onPlanClick, className }) => {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  // Bump animation on value increase
  const [bump, setBump] = useState(false)
  const [bumpGlow, setBumpGlow] = useState(false)
  const prevValueRef = useRef(value)
  useEffect(() => {
    if (value > prevValueRef.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 200)
      setBumpGlow(true)
      const g = setTimeout(() => setBumpGlow(false), 300)
      return () => clearTimeout(t)
    }
    prevValueRef.current = value
  }, [value])

  // Smooth progress width + glow on full
  const [internalProgress, setInternalProgress] = useState(() => Math.max(0, Math.min(1, progress ?? 0)))
  const [glow, setGlow] = useState(false)
  useEffect(() => {
    if (progress == null) return
    const p = Math.max(0, Math.min(1, progress))
    if (p >= 1) {
      setInternalProgress(1)
      setGlow(true)
      const t = setTimeout(() => {
        setGlow(false)
        setInternalProgress(0)
      }, 500)
      return () => clearTimeout(t)
    }
    setInternalProgress(p)
  }, [progress])

  const display = useMemo(() => formatAuraNumber(value), [value])

  return (
    <div className={`w-full flex items-center justify-between ${className ?? ''}`}>
      {/* Aura block */}
      <div
        className={
          `flex items-center gap-3 rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.3)]
           bg-[rgba(0,0,0,0.6)] backdrop-blur-[12px]`
        }
        style={{ pointerEvents: 'none', padding: '8px 10px', boxShadow: bumpGlow ? '0 0 20px rgba(255,215,0,0.45), 0 4px 10px rgba(0,0,0,0.3)' : undefined }}
      >
        {/* Left: icon */}
        <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden focusable="false" className="flex-shrink-0 aura-icon-glow">
          <defs>
            <linearGradient id="afGrad" x1="0" y1="0" x2="16" y2="16">
              <stop offset="0" stopColor="#9AE6B4" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          <circle cx="8" cy="8" r="7" fill="url(#afGrad)" />
          <circle cx="8" cy="8" r="5" fill="transparent" stroke={prefersDark ? '#FFFFFF' : '#000000'} strokeOpacity={0.15} />
        </svg>

        {/* Center: title + number stacked vertically */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium leading-[18px] text-white">Aura</span>
            <span className={`text-[15px] font-semibold leading-[20px] text-white ${bump ? 'scale-110' : 'scale-100'}`} style={{ transition: 'transform 200ms ease' }}>{display}</span>
          </div>
          <div className="mt-1 h-[8px] rounded-[4px] bg-[rgba(255,255,255,0.2)] overflow-hidden relative" style={{ width: 'clamp(96px,40vw,120px)' }}>
            {progress == null ? (
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, rgba(255,215,0,0.0) 0%, rgba(255,215,0,0.6) 50%, rgba(255,215,0,0.0) 100%)',
                backgroundSize: '200% 100%',
                animation: 'auraShimmer 1.2s linear infinite'
              }} />
            ) : (
              <div
                className={`h-full bg-[#FFD700] ${glow ? 'shadow-[0_0_12px_2px_rgba(255,215,0,0.8)]' : ''}`}
                style={{ width: `${internalProgress * 100}%`, transition: 'width 250ms ease' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Plan button */}
      <button
        type="button"
        onClick={onPlanClick}
        className="ml-3 w-[36px] h-[36px] rounded-[10px] bg-[#007AFF] flex items-center justify-center active:scale-95"
        aria-label="Plan"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Simple plan icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>
    </div>
  )
}

export default AuraFooter


