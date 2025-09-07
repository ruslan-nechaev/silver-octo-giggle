// [ПОДСКАЗКА] Telegram WebApp интеграция.
// - Используйте этот модуль в Telegram ботах для отображения проекта.
// - Подключайте index.html как статический корень. Внутри монтируйте через window.AuraReact.

export function mountFromTelegram(items: any[], container?: string): void {
  if (typeof window !== 'undefined' && (window as any).AuraReact?.mountOrbitalTimeline) {
    ;(window as any).AuraReact.mountOrbitalTimeline(container || '#auraBody', items)
  }
}


