// [ПОДСКАЗКА] Точка входа React (режим сборки через Vite).
// - Импортирует Tailwind стили.
// - Рендерит только silk экран загрузки как стартовый экран.

import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { App } from './components/App'
// Удалено: глобальный монтёр таймлайна (не используется на экране загрузки)

// Автомонтирование silk-экрана (если контейнер существует)
const defaultContainer = document.querySelector('#auraBody') as HTMLElement | null
if (defaultContainer) {
  const root = createRoot(defaultContainer)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
// Ничего не монтируем дополнительно


