import * as React from 'react'

type SwipeOpts = {
 threshold?: number
 onLeft?: () => void
 onRight?: () => void
}

export default function useSwipe<T extends HTMLElement>(
 ref: React.RefObject<T | null>,
 opts: SwipeOpts
) {
 const { onLeft, onRight } = opts
 const computedThreshold = React.useMemo(() => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 768
  const auto = vw * 0.15
  const base = opts.threshold ?? auto
  return Math.min(240, Math.max(90, base))
 }, [opts.threshold])

 const startX = React.useRef(0)
 const startY = React.useRef(0)
 const dx = React.useRef(0)
 const dy = React.useRef(0)
 const dragging = React.useRef(false)
 const pointerIdRef = React.useRef<number | null>(null)
 const didMoveRef = React.useRef(false)
 const lastMoveTime = React.useRef(0)
 const lastMoveX = React.useRef(0)
 const raf = React.useRef<number | null>(null)

 const ROTATION_DIVISOR = 18
 const VERTICAL_SLOP = 24
 const MAX_Y = 60

 React.useEffect(() => {
  const el = ref.current
  if (!el) return

  const preventDrag = (e: Event) => e.preventDefault()
  el.addEventListener('dragstart', preventDrag)
  el.style.userSelect = 'none'
  el.style.touchAction = 'pan-y'
  el.style.cursor = 'grab'

  const like = () => onRight?.()
  const nope = () => onLeft?.()

  const setBadges = (element: HTMLElement, x: number) => {
   const likeBadge = element.querySelector('[data-like]') as HTMLElement | null
   const nopeBadge = element.querySelector('[data-nope]') as HTMLElement | null
   const t = computedThreshold
   const likeOpacity = Math.max(0, Math.min(1, x / t))
   const nopeOpacity = Math.max(0, Math.min(1, -x / t))
   if (likeBadge) likeBadge.style.opacity = String(likeOpacity)
   if (nopeBadge) nopeBadge.style.opacity = String(nopeOpacity)
  }

  const clearBadges = (element: HTMLElement) => {
   const likeBadge = element.querySelector('[data-like]') as HTMLElement | null
   const nopeBadge = element.querySelector('[data-nope]') as HTMLElement | null
   if (likeBadge) likeBadge.style.opacity = '0'
   if (nopeBadge) nopeBadge.style.opacity = '0'
  }

  const applyTransform = (element: HTMLElement, x: number, y: number) => {
   const rot = x / ROTATION_DIVISOR
   const clampedY = Math.max(-MAX_Y, Math.min(MAX_Y, y))
   element.style.transform = `translate(${x}px, ${clampedY}px) rotate(${rot}deg)`
  }

  const resetTransform = (element: HTMLElement) => {
   element.style.transition = 'transform .18s ease'
   element.style.transform = ''
   clearBadges(element)
   if (raf.current) {
    cancelAnimationFrame(raf.current)
    raf.current = null
   }
  }

  const onPointerDown = (e: PointerEvent) => {
   if (e.button !== 0) return
   dragging.current = true
   didMoveRef.current = false
   pointerIdRef.current = e.pointerId
   startX.current = e.clientX
   startY.current = e.clientY
   dx.current = 0
   dy.current = 0
   lastMoveX.current = e.clientX
   lastMoveTime.current = e.timeStamp
   el.setPointerCapture?.(e.pointerId)
   el.style.transition = 'none'
   el.style.cursor = 'grabbing'
  }

  const onPointerMove = (e: PointerEvent) => {
   if (!dragging.current) return
   if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return

   const curDX = e.clientX - startX.current
   const curDY = e.clientY - startY.current

   if (!didMoveRef.current) {
    const absX = Math.abs(curDX)
    const absY = Math.abs(curDY)
    if (absX < 2 && absY < 2) return
    if (absY > absX && absY > VERTICAL_SLOP) {
     dragging.current = false
     el.releasePointerCapture?.(pointerIdRef.current!)
     el.style.cursor = 'grab'
     return
    }
    didMoveRef.current = true
   }

   dx.current = curDX
   dy.current = curDY

   if (raf.current == null) {
    raf.current = requestAnimationFrame(() => {
     applyTransform(el, dx.current, dy.current)
     setBadges(el, dx.current)
     raf.current = null
    })
   }

   const dt = e.timeStamp - lastMoveTime.current
   if (dt > 0) {
    lastMoveTime.current = e.timeStamp
    lastMoveX.current = e.clientX
   }
  }

  const finishSwipe = (direction: 'left' | 'right') => {
   const sign = direction === 'right' ? 1 : -1
   const flyX = sign * (window.innerWidth * 1.2)
   el.style.transition = 'transform .25s ease-out, opacity .25s ease-out'
   el.style.transform = `translate(${flyX}px, -40px) rotate(${sign * 18}deg)`
   el.style.opacity = '0.9'
   clearBadges(el)
   if (sign === 1) like()
   else nope()
  }

  const onPointerUpOrCancel = (e?: PointerEvent) => {
   if (!dragging.current) return
   dragging.current = false
   el.style.cursor = 'grab'

   if (pointerIdRef.current != null) {
    el.releasePointerCapture?.(pointerIdRef.current)
   }
   pointerIdRef.current = null

   const x = dx.current
   const t = computedThreshold

   let v = 0
   if (e) {
    const dt = e.timeStamp - lastMoveTime.current
    if (dt > 0) {
     v = (e.clientX - lastMoveX.current) / dt
    }
   }

   const isFlickRight = v > 0.75
   const isFlickLeft = v < -0.75

   if (x > t || isFlickRight) {
    finishSwipe('right')
   } else if (x < -t || isFlickLeft) {
    finishSwipe('left')
   } else {
    resetTransform(el)
   }
  }

  const onLostCapture = () => onPointerUpOrCancel()

  el.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', onPointerUpOrCancel, { passive: true })
  el.addEventListener('pointercancel', onPointerUpOrCancel)
  el.addEventListener('lostpointercapture', onLostCapture)

  return () => {
   el.removeEventListener('pointerdown', onPointerDown)
   window.removeEventListener('pointermove', onPointerMove)
   window.removeEventListener('pointerup', onPointerUpOrCancel)
   el.removeEventListener('pointercancel', onPointerUpOrCancel)
   el.removeEventListener('lostpointercapture', onLostCapture)
   el.removeEventListener('dragstart', preventDrag)
   el.style.userSelect = ''
   el.style.touchAction = ''
   el.style.cursor = ''
   if (raf.current) {
    cancelAnimationFrame(raf.current)
    raf.current = null
   }
  }
 }, [ref, onLeft, onRight, computedThreshold])
}