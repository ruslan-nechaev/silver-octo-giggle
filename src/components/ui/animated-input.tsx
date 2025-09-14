"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

type ChatInputProps = {
  onSend?: (text: string) => void
}

export const OrbInput = React.memo(function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [boxHeight, setBoxHeight] = useState<number>(44)
  const [maxH, setMaxH] = useState<number>(120)
  const [fontPx, setFontPx] = useState<number>(15)
  const baselineRef = useRef<number>(44)

  const handleAutoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const min = 44
    const max = maxH
    // compute single-line baseline height if unknown
    const cs = window.getComputedStyle(el)
    const lh = parseFloat(cs.lineHeight || "24") || 24
    const pt = parseFloat(cs.paddingTop || "10") || 10
    const pb = parseFloat(cs.paddingBottom || "10") || 10
    const baseline = Math.max(44, lh + pt + pb)
    baselineRef.current = baseline
    let next = Math.min(max, Math.max(min, el.scrollHeight))
    // Rule: do not expand until content exceeds baseline (fits в одну строку)
    if (value.trim().length === 0 || el.scrollHeight <= baseline + 1) {
      next = Math.max(min, baseline)
    }
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden"
    setBoxHeight(next)
    el.scrollTop = el.scrollHeight
  }, [maxH, value])

  useEffect(() => {
    handleAutoResize()
  }, [value, handleAutoResize])

  useEffect(() => {
    const applyResponsive = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 9999
      const small = w < 360
      setMaxH(small ? 100 : 120)
      setFontPx(small ? 14 : 15)
      // re-evaluate height with new constraints
      requestAnimationFrame(handleAutoResize)
    }
    applyResponsive()
    window.addEventListener('resize', applyResponsive)
    return () => window.removeEventListener('resize', applyResponsive)
  }, [handleAutoResize])

  const handleSend = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue("")
    requestAnimationFrame(handleAutoResize)
  }, [onSend, value, handleAutoResize])

  const placeholders = useMemo(
    () => [
      "Привет! Готов к тренировке? 💪",
      "Создай свой фитнес-план ⭐️",
      "Задай вопрос о тренировке",
      "Время прокачки! ⚡️",
      "Твой лучший результат — за ⭐️",
    ],
    []
  )
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    if (isFocused || value.length > 0) return
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length)
    }, 2200)
    return () => clearInterval(id)
  }, [isFocused, value.length, placeholders.length])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  const hasText = value.trim().length > 0

  return (
    <form className="w-full" onSubmit={handleSend}>
      <div
        className="relative w-full rounded-[24px] bg-[#2E2E2E] px-0 py-0"
        style={{
          minHeight: 44,
          height: boxHeight,
          transition: 'height 150ms ease',
        }}
      >
        {/* Right send button: 36x36 circle, 12px from right, 4px top/bottom */}
        <button
          type="submit"
          aria-label="Send"
          aria-disabled={!hasText}
          className={`absolute right-[12px] top-[4px] bottom-[4px] my-auto w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center transition-opacity active:scale-95 ${
            hasText ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{ transition: 'opacity 120ms ease' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black block">
            <path d="M8 12.5V3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 7.5L8 4L11.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
            value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
            spellCheck={false}
          className={`coach-text block w-full resize-none bg-transparent text-white placeholder-[#A0A0A0] outline-none border-none leading-[1.6] pl-4 pr-[60px] py-[10px]`}
          style={{ minHeight: 44, maxHeight: maxH, fontSize: fontPx }}
          aria-label="Input"
        />

        {/* Custom placeholder centered vertically when empty */}
        {value.length === 0 && (
          <div className="pointer-events-none absolute left-4 right-[60px] top-1/2 -translate-y-1/2 text-[15px] leading-[1.6] text-[#A0A0A0] coach-text whitespace-nowrap overflow-hidden text-ellipsis">
            {placeholders[placeholderIndex]}
          </div>
        )}
      </div>
    </form>
  )
})

export default React.memo(OrbInput)


