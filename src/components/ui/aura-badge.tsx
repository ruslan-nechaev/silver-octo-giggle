import React, { useMemo } from 'react'

type AuraBadgeProps = {
  value: number | string
  className?: string
}

export const AuraBadge: React.FC<AuraBadgeProps> = ({ value, className }) => {
  // Step 1: position and size only. Styling for theme/blur will come in later steps
  const display = useMemo(() => String(value), [value])
  return (
    <div
      className={
        `fixed top-[8px] left-1/2 -translate-x-1/2 h-[32px] inline-flex items-center justify-center rounded-[12px] 
         z-[60] pointer-events-none ${className ?? ''}`
      }
      style={{ minWidth: 'auto', maxWidth: 220 }}
      aria-live="off"
      role="status"
    >
      {/* Step 1: simple text only; icon/padding in step 3 */}
      <span className="px-3 text-[15px] leading-[20px] font-semibold whitespace-nowrap">{display}</span>
    </div>
  )
}

export default AuraBadge


