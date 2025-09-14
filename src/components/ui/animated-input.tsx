"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

type ChatInputProps = {
  onSend?: (text: string) => void
}

export const OrbInput = React.memo(function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleAutoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const min = 44
    const max = 120
    const next = Math.min(max, Math.max(min, el.scrollHeight))
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden"
  }, [])

  useEffect(() => {
    handleAutoResize()
  }, [value, handleAutoResize])

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
        className="relative w-full rounded-[24px] bg-[#2E2E2E] px-4 py-[10px]"
        style={{
          minHeight: 44,
          height: 44,
        }}
      >
        {/* Right send button: 36x36 circle, 12px from right, fades in when text present */}
        <button
          type="submit"
          aria-label="Send"
          aria-disabled={!hasText}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center transition-opacity duration-200 active:scale-95 ${
            hasText ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
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
          className={`coach-text block w-full resize-none bg-transparent text-white placeholder-[#A0A0A0] outline-none border-none text-[15px] leading-[1.6] pl-0 ${hasText ? 'pr-[44px]' : 'pr-4'}`}
          style={{ minHeight: 44, maxHeight: 120 }}
          aria-label="Input"
        />

        {/* Custom placeholder centered vertically when empty */}
        {value.length === 0 && (
          <div className="pointer-events-none absolute left-0 right-4 top-1/2 -translate-y-1/2 text-[15px] leading-[1.6] text-[#A0A0A0] coach-text whitespace-nowrap overflow-hidden text-ellipsis">
            {placeholders[placeholderIndex]}
          </div>
        )}
      </div>
    </form>
  )
})

export default React.memo(OrbInput)


