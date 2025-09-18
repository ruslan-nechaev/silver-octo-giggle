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
  const [isGrowthEnabled, setIsGrowthEnabled] = useState<boolean>(false)
  const hasUserGestureRef = useRef<boolean>(false)
  const heightPx = isGrowthEnabled ? boxHeight : 44
  const heightTransition = isGrowthEnabled ? 'height 150ms ease' : 'none'

  const handleAutoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    // Пока не было реального пользовательского ввода — всегда 44px
    if (!isGrowthEnabled) {
      el.style.height = `44px`
      el.style.overflowY = 'hidden'
      setBoxHeight(44)
      return
    }
    // Строгие константы для стабильности
    const BASELINE = 44
    const LINE = 24
    const PT = 10
    const PB = 10
    const min = BASELINE
    const MAX = 120
    const max = MAX
    // Сначала фиксируем высоту в baseline, чтобы измерение было корректным
    el.style.height = `${BASELINE}px`
    const contentHeight = Math.max(0, el.scrollHeight - (PT + PB))
    // Строгая защита от ложного роста на первой букве: пока контент не превышает
    // высоту одной строки заметно (> LINE + 4px), считаем, что строка одна
    const lines = contentHeight > (LINE + 4) ? Math.max(2, Math.ceil(contentHeight / LINE)) : 1
    const extraLines = Math.max(0, lines - 1)
    const maxExtraLines = Math.max(0, Math.floor((max - BASELINE) / LINE))
    const visibleExtraLines = Math.min(extraLines, maxExtraLines)
    const next = BASELINE + visibleExtraLines * LINE
    el.style.height = `${next}px`
    el.style.overflowY = extraLines > maxExtraLines ? "auto" : "hidden"
    setBoxHeight(next)
    if (el.style.overflowY === 'auto') {
      el.scrollTop = el.scrollHeight
    }
  }, [isGrowthEnabled])

  // Не пересчитываем высоту на монтировании; лишь явно фиксируем baseline 44px
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = `44px`
      el.style.overflowY = 'hidden'
    }
  }, [])

  const handleSend = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue("")
    setIsGrowthEnabled(false)
    const el = textareaRef.current
    if (el) {
      el.style.height = `44px`
      el.style.overflowY = 'hidden'
  }
    setBoxHeight(44)
  }, [onSend, value])

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
          height: heightPx,
          transition: heightTransition,
          overflow: 'hidden',
          contain: 'layout paint size',
        }}
      >
        {/* Right send button: 36x36 circle, 12px from right, 4px top/bottom */}
        <button
          type="submit"
          aria-label="Send"
          aria-disabled={!hasText}
          className={`absolute right-[8px] top-[4px] bottom-[4px] my-auto w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center transition-opacity active:scale-95 ${
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
          onInput={(e) => {
            const el = e.currentTarget
            const nextVal = el.value
            setValue(nextVal)
            const native = e.nativeEvent as InputEvent
            const trusted = native && (native as any).isTrusted === true
            // Рост поля только после явного пользовательского жеста + trusted input
            if (!trusted || !hasUserGestureRef.current) return
            const hasText = nextVal.trim().length > 0
            if (!hasText) {
              setIsGrowthEnabled(false)
              el.style.height = `44px`
              el.style.overflowY = 'hidden'
              setBoxHeight(44)
              return
            }
            if (!isGrowthEnabled) setIsGrowthEnabled(true)
            // Высчитываем высоту только после первого реального ввода и при непустом тексте
            handleAutoResize()
          }}
          onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
          onPointerDown={() => { hasUserGestureRef.current = true }}
          onKeyDownCapture={() => { hasUserGestureRef.current = true }}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          className={`coach-text block w-full resize-none bg-transparent text-white placeholder-[#A0A0A0] outline-none border-none leading-[24px] pl-4 pr-[44px] py-[10px]`}
          rows={1}
          style={{ height: '100%', maxHeight: 120, fontSize: 15, boxSizing: 'border-box' }}
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


