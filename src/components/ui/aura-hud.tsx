import React, { useEffect, useMemo, useRef, useState } from 'react'

type AuraHudProps = {
  value: number
  onPlanClick?: () => void
  className?: string
}

function formatAura(n: number): string {
  if (n >= 10000) {
    const k = n / 1000
    const s = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)
    return `${s}k`
  }
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

type Particle = { id: string; left: number; top: number; dx: number; dy: number; duration: number }

export const AuraHud: React.FC<AuraHudProps> = ({ value, onPlanClick, className }) => {
  const [display, setDisplay] = useState<number>(value)
  const prevRef = useRef<number>(value)
  const [pulse, setPulse] = useState<boolean>(false)
  const [particles, setParticles] = useState<Particle[]>([])

  // Smoothly animate number changes (300ms tween)
  useEffect(() => {
    if (value === display) return
    const startValue = display
    const delta = value - startValue
    let raf = 0
    const start = performance.now()
    const duration = 300
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setDisplay(Math.round(startValue + delta * p))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])

  // Pulse icon + energy particles on increase
  useEffect(() => {
    if (value > prevRef.current) {
      setPulse(true)
      setTimeout(() => setPulse(false), 250)
      // spawn 2-3 small particles
      const count = 2 + Math.floor(Math.random() * 2)
      const now = Date.now()
      const newParts: Particle[] = Array.from({ length: count }).map((_, i) => ({
        id: `${now}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        left: 0,
        top: 0,
        dx: (Math.random() * 24) - 12,
        dy: - (8 + Math.random() * 18),
        duration: 380 + Math.random() * 140,
      }))
      setParticles((p) => [...p, ...newParts])
      // cleanup after animation
      setTimeout(() => {
        setParticles((p) => p.filter((pt) => !newParts.find(n => n.id === pt.id)))
      }, 600)
    }
    prevRef.current = value
  }, [value])

  const formatted = useMemo(() => formatAura(display), [display])

  return (
    <div
      className={`fixed top-[12px] right-[12px] z-[60] flex items-center pointer-events-none ${className ?? ''}`}
      style={{ gap: 8 }}
    >
      {/* HUD core (icon + number) */}
      <div className="flex items-center pointer-events-none" style={{ gap: 8 }}>
        {/* Flat premium icon (spark) */}
        <div className={`relative ${pulse ? 'scale-110' : 'scale-100'}`} style={{ transition: 'transform 220ms ease' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden focusable="false">
            <path d="M12 2l2.2 5.4L20 10l-5.4 2.2L12 18l-2.2-5.8L4 10l5.8-2.6L12 2z" fill="#FFD700" />
          </svg>
          {/* energy particles */}
          <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
            {particles.map((pt) => (
              <span
                key={pt.id}
                className="absolute w-[4px] h-[4px] rounded-full"
                style={{
                  left: 0,
                  top: 0,
                  backgroundColor: '#FFD700',
                  filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))',
                  animation: `auraParticle ${pt.duration}ms ease-out forwards`,
                  transform: `translate(${pt.dx}px, ${pt.dy}px)`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>
        </div>
        <span className="select-none" style={{ color: '#FFFFFF', fontSize: 16, lineHeight: '20px', fontWeight: 600 }}>{formatted}</span>
      </div>

      {/* Plan button */}
      <button
        type="button"
        onClick={onPlanClick}
        className="pointer-events-auto w-[32px] h-[32px] rounded-[10px] bg-[#007AFF] flex items-center justify-center active:scale-95"
        aria-label="Plan"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>
    </div>
  )
}

export default AuraHud


