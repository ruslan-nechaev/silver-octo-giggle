## AuraProject

Кросс-режимный каркас (статическое HTML-превью + сборка Vite) с React, TailwindCSS и глобальным API монтирования RadialOrbitalTimeline.

### Быстрый старт (без сборки)
1. Откройте `index.html` напрямую в браузере.
2. В консоли доступно:
   - `window.AuraReact.mountOrbitalTimeline(items)`
   - `window.AuraReact.mountOrbitalTimeline(container, items)`
3. Контейнер по умолчанию: `#auraBody`.

Пример:
```js
window.AuraReact.mountOrbitalTimeline([
  { id: '1', label: 'Demo', date: '2025-01-01', status: 'active' },
  { id: '2', label: 'Plan', date: '2025-02-10', status: 'planned' },
])
```

### Режим сборки (Vite)
```bash
npm i
npm run dev
```
Отключите UMD подключение и раскомментируйте `<script type="module" src="/src/main.tsx"></script>` в `index.html` при необходимости.

### Интеграции
- 21st (чат): `src/integrations/twentyfirst`
- Telegram WebApp: `src/integrations/telegram`
- Оплата звёздами: `src/integrations/stars`

### Подсказки
- Все пути Reg.ru-safe (относительные), статик — в `public/`.
- Стили Tailwind — в `src/styles/index.css`; для превью — `public/preview.css`.


