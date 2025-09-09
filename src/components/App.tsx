// [ПОДСКАЗКА] Основной компонент приложения.
// - Визуальный каркас для ауры, рамок, чата тренера и планов.
// - Подключение shadcn/ui предполагается через будущую установку и стили.

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Component as SilkBackground } from '@/components/ui/silk-background-animation'
import { LavaLamp } from '@/components/ui/fluid-blob'
import { OrbInput } from '@/components/ui/animated-input'
import { PearlButton } from '@/components/ui/pearl-button'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'
import { Calendar, FileText, Code, User, Clock } from 'lucide-react'
import WeatherButton from '@/components/ui/button'
import { Component as TextGlow } from '@/components/ui/text-glow-hover'
import { routeWebhookPayload, mapPlanToTimeline } from '@/lib/plan-router'
import { BlurText } from '@/components/ui/animated-blur-text'
import { motion } from 'framer-motion'

export function App(): JSX.Element {
  const [showMain, setShowMain] = useState(false)
  type ChatMessage = { id: string; role: 'user' | 'bot'; text: string; variant?: 'plain' | 'bubble' }
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // Dynamic timeline data from routed plan
  const [planTimeline, setPlanTimeline] = useState<any[] | null>(null)

  // Webhook for outbound user messages
  const WEBHOOK_URL = 'https://fit-ai-g.app.n8n.cloud/webhook-test/20123bc1-5e8c-429d-8790-f20e6138b0f3'
  const [showTimeline, setShowTimeline] = useState(false)

  const GREETING_TEXT = useMemo(
    () => (
      'Привет! 👋\n\nТы получил персонального AI-тренера, который:\n* Всегда онлайн 🔍\n* Готов помочь 💪\n* Фокус на тебе 🎯'
    ),
    []
  )

  const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const handleSend = useCallback(async (text: string): Promise<void> => {
    const userMsg: ChatMessage = { id: createId(), role: 'user', text, variant: 'bubble' }
    setMessages((m) => [...m, userMsg])
    try {
      const params = new URLSearchParams({
        message: text,
        sentAt: new Date().toISOString(),
        origin: 'AuraProject',
        path: typeof window !== 'undefined' ? window.location.pathname : ''
      })
      const url = `${WEBHOOK_URL}?${params.toString()}`
      const res = await fetch(url, { method: 'GET', mode: 'cors' })
      let payload = ''
      try {
        const json = await res.clone().json()
        payload = typeof json === 'string' ? json : JSON.stringify(json)
      } catch {
        payload = await res.text()
      }
      // Route payload: if it's a plan, show timeline with mapped items
      const routed = routeWebhookPayload(payload)
      if (routed.kind === 'plan') {
        const mapped = mapPlanToTimeline(routed)
        setPlanTimeline(mapped as any)
        setShowTimeline(true)
        // Используем встроенный React-таймлайн через состояние planTimeline
        // Also reflect in chat briefly
        setMessages((m) => [...m, { id: createId(), role: 'bot', text: 'План получен. Отобразил упражнения на орбитах.', variant: 'bubble' }])
      } else if (routed.kind === 'text') {
        // Чистый текст без префиксов/сырого JSON
        const clean = (() => {
          try {
            // если пришла строка вида '[{"output":"..."}]' — вытащим output
            const arr = JSON.parse(routed.text);
            if (Array.isArray(arr) && arr[0] && typeof arr[0].output === 'string') {
              return String(arr[0].output);
            }
          } catch {}
          return routed.text;
        })();
        setMessages((m) => [...m, { id: createId(), role: 'bot', text: clean, variant: 'plain' }])
      } else {
      setMessages((m) => [...m, { id: createId(), role: 'bot', text: payload || 'OK', variant: 'plain' }])
      }
    } catch (err) {
      // swallow network errors to avoid disturbing UI
      console.warn('Webhook send failed', err)
      setMessages((m) => [...m, { id: createId(), role: 'bot', text: 'Network error', variant: 'plain' }])
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowMain(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // Show animated greeting once main screen is visible
  useEffect(() => {
    if (!showMain) return
    setMessages((prev) => (prev.length === 0
      ? [...prev, { id: createId(), role: 'bot', text: GREETING_TEXT, variant: 'plain' }]
      : prev))
  }, [showMain, GREETING_TEXT])

  if (!showMain) return <SilkBackground showCopy />

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black rounded-none border-0 outline-none">
      {/* Lightweight background on main screen for smoothness */}
      <SilkBackground showCopy={false} mode="lite" />
      {/* Награда: чуть ниже верхнего края, чтобы не вылезала за рамку */}
      <div className="absolute inset-x-0 top-[5px] md:top-[8px] z-20 flex justify-center">
        <div className="relative w-[700px] h-[96px] md:w-[900px] md:h-[104px] overflow-visible">
          <TextGlow
            text="Aura"
            backgroundColor="transparent"
            font={{ fontFamily: 'UnifrakturMaguntia, system-ui', fontSize: 60, fontWeight: 600 }}
            shadowColor="#FFFFFF"
            useGradientGlow={false}
            animateGlow={false}
            glowBlur={48}
            glowOpacity={1.5 as unknown as number}
          />
        </div>
      </div>
      {/* Глобальная верхняя линейная рамка и число: фиксированное положение под заголовком */}
      <div className="pointer-events-none absolute inset-x-0 top-[86px] md:top-[92px] h-[48px] flex items-center justify-center z-50">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-[2px] rounded-full bg-white/90" style={{ right: 'calc(50% + 84px)' }} />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 h-[2px] rounded-full bg-white/90" style={{ left: 'calc(50% + 84px)' }} />
        <span className="silk-type text-[#FFD700] text-3xl md:text-4xl font-extrabold leading-none select-none z-10">999</span>
      </div>
      {/* Временная навигация: держим смонтированной, переключаем видимость CSS-классами */}
      <div className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-500 ease-out ${showTimeline ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-full h-full md:scale-100 scale-[0.8] origin-center transition-transform duration-500 ease-out">
          <RadialOrbitalTimeline
            timelineData={
                planTimeline ?? [
                { id:1,title:'Planning',date:'Jan 2024',content:'Project planning and requirements gathering phase.',category:'Planning',icon:Calendar,relatedIds:[2],status:'completed',energy:100},
                { id:2,title:'Design',date:'Feb 2024',content:'UI/UX design and system architecture.',category:'Design',icon:FileText,relatedIds:[1,3],status:'completed',energy:90},
                { id:3,title:'Development',date:'Mar 2024',content:'Core features implementation and testing.',category:'Development',icon:Code,relatedIds:[2,4],status:'in-progress',energy:60},
                { id:4,title:'Testing',date:'Apr 2024',content:'User testing and bug fixes.',category:'Testing',icon:User,relatedIds:[3,5],status:'pending',energy:30},
                { id:5,title:'Release',date:'May 2024',content:'Final deployment and release.',category:'Release',icon:Clock,relatedIds:[4],status:'pending',energy:10},
                ]
            }
          />
        </div>
      </div>

      {/* Чат: всегда смонтирован, переключаем видимость */}
      <div className={`absolute z-20 inset-x-0 top-28 md:top-36 bottom-24 flex justify-center px-4 transition-opacity duration-300 ${showTimeline ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
          <div className="w-full max-w-xl h-full relative">
            {/* Лента сообщений ниже, отступ сохранён под глобальную линию */}
            <div className="h-full overflow-y-auto no-scrollbar touch-pan-y space-y-4 pt-10">
          {messages.map((msg) => {
            const isPlain = msg.variant === 'plain' && msg.role === 'bot';
            return (
              <div key={msg.id} className={`flex ${isPlain ? 'justify-start' : (msg.role === 'user' ? 'justify-end' : 'justify-start')}`}>
                {isPlain ? (
                  <div className="max-w-[96%] md:max-w-[92%] mr-auto">
                    <div className="relative h-5 md:h-6 mb-2">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px md:h-[2px] bg-white/30"></div>
                      <span className="absolute left-1/2 -translate-x-1/2 px-1 text-[#FFD700] text-[12px] md:text-[13px] font-semibold leading-none tracking-wide">
                        Fit Coach
                      </span>
                    </div>
                    <BlurText
                      text={msg.text}
                      delay={60}
                      animateBy="words"
                      direction="top"
                      className="silk-type text-[17px] md:text-[18px] leading-snug tracking-[0.01em] text-white"
                    />
                  </div>
                ) : (
                  <motion.div
                    className={`${msg.role === 'user' ? 'bg-white text-black rounded-2xl rounded-br-none max-w-[52%] md:max-w-[48%] px-3 py-2' : 'bg-white/10 text-white rounded-3xl max-w-[85%] px-4 py-2'} shadow-lg backdrop-blur-sm`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    style={{ overflow: 'hidden' }}
                    {...(msg.role === 'user' ? { 'data-user-msg': 'true' } : {})}
                  >
                    <BlurText
                      text={msg.text}
                      delay={60}
                      animateBy="words"
                      direction="top"
                      className={`silk-type text-[17px] md:text-[18px] leading-snug tracking-[0.01em] ${msg.role === 'user' ? 'text-black' : 'text-white'} m-0`}
                    />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
        {/* Нижний градиент-затемнение, чтобы сообщения мягко уходили под панель */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-28 bg-gradient-to-b from-transparent to-black/90 z-10" />
      </div>
      </div>

      {/* Нижняя панель: всегда видна, при таймлайне чат скрыт */}
      <div className="absolute inset-x-0 bottom-2 z-40 flex flex-col items-center gap-2 px-3 transition-all duration-500 ease-out">
        <PearlButton label="Start Journey" onClick={() => setShowTimeline((v) => !v)} className="w-full max-w-[340px] md:max-w-[560px] contrast-125" />
        <OrbInput onSend={handleSend} />
      </div>
    </div>
  )
}


