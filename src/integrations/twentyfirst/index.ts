// [ПОДСКАЗКА] 21st интеграция: динамическое добавление элементов через чат.
// - Импортируйте этот модуль в чат-бридже и передавайте массив items в монтёр.
// - Пример: addItems([{ id, label, date, status }])

export type Status = 'planned' | 'active' | 'done'

export interface ChatItemInput {
  id: string
  label: string
  date: string
  status?: Status
  progress?: number
}

export function addItems(items: ChatItemInput[]): void {
  // [ПОДСКАЗКА] Однокликовое добавление:
  //   window.AuraReact.mountOrbitalTimeline(items)
  if (typeof window !== 'undefined' && (window as any).AuraReact?.mountOrbitalTimeline) {
    ;(window as any).AuraReact.mountOrbitalTimeline(items)
  }
}


