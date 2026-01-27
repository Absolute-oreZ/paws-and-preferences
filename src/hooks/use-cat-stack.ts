import { useEffect, useRef, useState } from 'react'

export function useCatStack(count: number) {
  const [stack, setStack] = useState<{ id: string; url: string }[]>([])
  const [liked, setLiked] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    let cancelled = false

    async function load() {
      try {
        const initialIds = await Promise.all(
          Array.from({ length: Math.min(3, count) }).map(async () => {
            const res = await fetch('https://cataas.com/cat?json=true')
            const data = await res.json()
            return data.id
          })
        )

        if (cancelled) return

        const initialItems = await Promise.all(
          initialIds.map(async id => {
            const imgRes = await fetch(`https://cataas.com/cat/${id}`)
            const blob = await imgRes.blob()
            return { id, url: URL.createObjectURL(blob) }
          })
        )

        if (cancelled) return

        setStack(initialItems)
        setLoading(false)

        const remainingCount = count - initialIds.length
        if (remainingCount > 0) {
          const remainingIds = await Promise.all(
            Array.from({ length: remainingCount }).map(async () => {
              const res = await fetch('https://cataas.com/cat?json=true')
              const data = await res.json()
              return data.id
            })
          )

          if (cancelled) return

          const batchSize = 3
          for (let i = 0; i < remainingIds.length; i += batchSize) {
            if (cancelled) break

            const batchIds = remainingIds.slice(i, i + batchSize)
            const batchItems = await Promise.all(
              batchIds.map(async id => {
                const imgRes = await fetch(`https://cataas.com/cat/${id}`)
                const blob = await imgRes.blob()
                return { id, url: URL.createObjectURL(blob) }
              })
            )

            if (cancelled) break

            setStack(prev => [...batchItems, ...prev])
          }
        }
      } catch (error) {
        console.error('Failed to load cats:', error)
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [count])

  function swipe(like: boolean) {
    setStack(prev => {
      if (prev.length === 0) return prev
      const next = prev.slice(0, -1)
      const top = prev[prev.length - 1]
      if (like) setLiked(prevLiked => [...prevLiked, top.id])
      return next
    })
  }

  return { stack, liked, loading, swipe }
}