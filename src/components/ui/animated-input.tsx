"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

type OrbInputProps = {
  onSend?: (text: string) => void
}

export const OrbInput = React.memo(function OrbInput({ onSend }: OrbInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isOrbRight, setIsOrbRight] = useState(true)

  const handleSend = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    if (onSend) onSend(trimmed)
    setValue("")
  }, [onSend, value])

  // Keep the placeholders stable across renders
  const placeholders = useMemo(
    () => [
      "Привет! Готов к тренировке? 💪",
      "Создай свой фитнес-план ⭐️",
      "Спроси про упражнение или технику",
      "Время прокачки! ⚡️",
      "Твой лучший результат — за ⭐️",
    ],
    []
  )

  // Config: tweak the animation to taste
  const CHAR_DELAY = 75 // ms between characters while typing
  const IDLE_DELAY_AFTER_FINISH = 2200 // ms to wait after a full sentence is shown

  // Refs to hold active timers so they can be cleaned up
  const intervalRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  useEffect(() => {
    // clear any stale timers (helps with StrictMode double-invoke in dev)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Pause placeholder animation while user is interacting/typing to prevent jank
    if (isFocused || value.length > 0) {
      setDisplayedText("")
      setIsTyping(false)
      return () => {}
    }

    const current = placeholders[placeholderIndex]
    if (!current) {
      setDisplayedText("")
      setIsTyping(false)
      return
    }

    const chars = Array.from(current)

    // reset state for a new round
    setDisplayedText("")
    setIsTyping(true)

    let charIndex = 0

    // type character-by-character using a derived slice to avoid any chance of appending undefined
    // Throttle typing animation to avoid jank on input
    intervalRef.current = window.setInterval(() => {
      if (charIndex < chars.length) {
        const next = chars.slice(0, charIndex + 1).join("")
        setDisplayedText(next)
        charIndex += 1
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setIsTyping(false)

        // after a brief pause, advance to the next placeholder
        timeoutRef.current = window.setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        }, IDLE_DELAY_AFTER_FINISH)
      }
    }, CHAR_DELAY)

    // Cleanup on unmount or when placeholderIndex changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [placeholderIndex, placeholders, isFocused, value])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)
  }, [])

  return (
    <form className="relative w-full max-w-[340px] md:max-w-[560px]" onSubmit={handleSend}>
      <div
        className={`relative flex items-center px-3 md:px-4 py-[14px] md:py-[28px] bg-black shadow-lg transition-all duration-300 ease-out rounded-full border border-white/30 ${
          isFocused ? "shadow-xl scale-[1.02] border-gray-400/70" : "shadow-lg"
        }`}
      >
        {/* Moving orb */}
        <button
          type="submit"
          aria-label="Animated orb"
          className={`absolute z-20 top-1/2 -translate-y-1/2 transition-transform duration-500 ease-out transform-gpu ${
            isOrbRight ? "right-3 md:right-5" : "left-3"
          }`}
          style={{ willChange: 'transform' }}
        >
          <div
            className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden transform-gpu flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <img
              src="https://media.giphy.com/media/26gsuUjoEBmLrNBxC/giphy.gif"
              alt="Animated orb"
              className="w-full h-full object-cover"
              style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' }}
            />
          </div>
        </button>

        {/* Separator line between text and orb */}
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-14 md:right-20 h-7 md:h-10 w-px bg-gray-600/60" />

        {/* Input with padding to avoid overlapping the orb */}
        <div className="flex-1 min-w-[160px] md:w-[420px]">
          <input
            data-testid="orb-input"
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={`${displayedText}${isTyping ? "|" : ""}`}
            aria-label="Ask a question"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            enterKeyHint="send"
            className={`w-full text-sm md:text-lg text-white placeholder-gray-400 bg-transparent border-none outline-none font-light [font-variant-ligatures:none] ${
              isOrbRight ? "pl-4 pr-16 md:pl-6 md:pr-20" : "pl-16 pr-4 md:pl-20 md:pr-6"
            }`}
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' as any }}
          />
        </div>
      </div>
    </form>
  )
})

export default React.memo(OrbInput)


