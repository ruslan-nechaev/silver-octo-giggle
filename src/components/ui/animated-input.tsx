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

  const placeholder = useMemo(() => "Спросите что-нибудь…", [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <form className="w-full" onSubmit={handleSend}>
      <div
        className="relative w-full rounded-[24px] bg-[#2E2E2E] px-4 py-[10px]"
        style={{
          minHeight: 44,
          height: 44,
        }}
      >
        {/* Left icon (paperclip) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/80" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 12.5L15 6C16.657 4.343 19.343 4.343 21 6C22.657 7.657 22.657 10.343 21 12L12 21C9.239 23.761 4.761 23.761 2 21C-0.761 18.239 -0.761 13.761 2 11L11 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Right icon (send) */}
        <button type="submit" aria-label="Send" className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11L21 3L13 21L11 13L3 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
          className="coach-text block w-full resize-none bg-transparent text-white placeholder-[#A0A0A0] outline-none border-none text-[15px] leading-[1.6] pr-[52px] pl-[52px]"
          style={{ minHeight: 44, maxHeight: 120 }}
          aria-label="Input"
        />

        {/* Custom placeholder centered vertically when empty */}
        {value.length === 0 && (
          <div className="pointer-events-none absolute left-[52px] right-[52px] top-1/2 -translate-y-1/2 text-[15px] leading-[1.6] text-[#A0A0A0] coach-text whitespace-nowrap overflow-hidden text-ellipsis">
            {placeholder}
          </div>
        )}
      </div>
    </form>
  )
})

export default React.memo(OrbInput)


