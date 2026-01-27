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
      const ids = await Promise.all(
        Array.from({ length: count }).map(async () => {
          const res = await fetch('https://cataas.com/cat?json=true')
          const data = await res.json()
          return data.id
        })
      )

      const items = await Promise.all(
        ids.map(async id => {
          const imgRes = await fetch(`https://cataas.com/cat/${id}`)
          const blob = await imgRes.blob()
          return { id, url: URL.createObjectURL(blob) }
        })
      )

      if (cancelled) return
      setStack(items)
      setLoading(false)
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