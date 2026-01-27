import { useMemo } from 'react'

export default function ProgressDots({
  total,
  current,
}: {
  total: number
  current: number
}) {
  const maxDots = 5
  const half = Math.floor(maxDots / 2)

  const windowStart = useMemo(() => {
    let s = current - half
    if (s < 1) s = 1
    if (s > total - maxDots + 1) s = total - maxDots + 1
    if (total <= maxDots) s = 1
    return s
  }, [current, total])

  const translate = useMemo(() => {
    if (total <= maxDots) return 0
    const step = 12
    return -(windowStart - 1) * step
  }, [windowStart, total])

  return (
    <div className="mt-4 flex justify-center">
      <div className="relative h-2 w-20 overflow-hidden">
        <div
          className="absolute flex gap-1 transition-transform duration-500"
          style={{ transform: `translateX(${translate}px)` }}
        >
          {Array.from({ length: total }).map((_, nIndex) => {
            const index = nIndex + 1
            const active = index === current
            return (
              <div
                key={index}
                className={
                  active
                    ? 'h-2 w-2 rounded-full bg-primary scale-110'
                    : 'h-2 w-2 rounded-full bg-slate-300 opacity-40'
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}