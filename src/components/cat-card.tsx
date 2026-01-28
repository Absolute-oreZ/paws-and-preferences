import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import useSwipe from '@/hooks/use-swipe'
import { cn } from '@/lib/utils'

export type CatCardProps = {
  src: string
  onSwiped: (liked: boolean) => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

type HeartAnimation = { id: number; x: number; y: number }

const CatCard = forwardRef(({ src, onSwiped, className, ...props }: CatCardProps, ref) => {
  const elRef = useRef<HTMLDivElement>(null)
  const sent = useRef(false)
  const lastTap = useRef(0)
  const [hearts, setHearts] = useState<HeartAnimation[]>([])
  const heartIdCounter = useRef(0)

  useSwipe(elRef, {
    threshold: 110,
    onLeft: () => animateOut(-1, false),
    onRight: () => animateOut(1, false),
  })

  function animateOut(dir: 1 | -1, isDoubleTap: boolean) {
    if (sent.current) return
    sent.current = true
    const el = elRef.current
    if (!el) {
      onSwiped(dir === 1)
      return
    }

    if (dir === 1) el.style.boxShadow = '0 0 50px 14px rgba(236, 72, 153, 0.9)'
    else el.style.boxShadow = '0 0 40px 12px rgba(100, 116, 139, 0.8)'

    setTimeout(() => {
      if (isDoubleTap) {
        el.style.transition = 'opacity .3s ease-out, box-shadow .3s ease-out'
        el.style.opacity = '0'
        setTimeout(() => onSwiped(dir === 1), 300)
      } else {
        const flyX = dir * (window.innerWidth * 1.2)
        el.style.transition = 'transform .6s ease-out, opacity .6s ease-out, box-shadow .6s ease-out'
        el.style.transform = `translate(${flyX}px, -40px) rotate(${dir * 18}deg)`
        el.style.opacity = '1'
        setTimeout(() => onSwiped(dir === 1), 220)
      }
    }, 120)
  }

  function handleDoubleTap(e: React.MouseEvent | React.TouchEvent) {
    const now = Date.now()
    const timeSince = now - lastTap.current
    if (timeSince < 300 && timeSince > 0) {
      e.preventDefault()
      const rect = elRef.current?.getBoundingClientRect()
      if (!rect) return
      let clientX: number, clientY: number
      if ('touches' in e.nativeEvent) {
        clientX = e.nativeEvent.changedTouches[0].clientX
        clientY = e.nativeEvent.changedTouches[0].clientY
      } else {
        clientX = e.nativeEvent.clientX
        clientY = e.nativeEvent.clientY
      }
      const x = clientX - rect.left
      const y = clientY - rect.top
      const id = heartIdCounter.current++
      setHearts(prev => [...prev, { id, x, y }])
      setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000)
      setTimeout(() => animateOut(1, true), 600)
    }
    lastTap.current = now
  }

  useImperativeHandle(ref, () => ({
    like: () => animateOut(1, false),
    nope: () => animateOut(-1, false),
  }))

  return (
    <div ref={elRef} className={cn('cat-card', className)} onMouseDown={handleDoubleTap} onTouchEnd={handleDoubleTap} {...props}>
      <img src={src} alt="cute cat" className="h-full w-full object-cover" crossOrigin="anonymous" />
      {hearts.map(h => (
        <div key={h.id} className="heart-animation pointer-events-none absolute" style={{ left: h.x, top: h.y }}>
          <img src="./logo.png" alt="love" className="heart-logo" />
        </div>
      ))}
    </div>
  )
})

export default CatCard
