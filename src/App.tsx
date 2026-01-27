import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/header'
import CatStack from '@/components/cat-stack'
import SummaryView from '@/components/summary-view'
import { decodeList, decodeName, encodeList, encodeName } from './lib/utils'

export default function App() {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()

  const meowParam = params.get('meow')
  const nameParam = params.get('name')

  const isSummary = !!meowParam

  const summaryImages = useMemo(() => decodeList(meowParam), [meowParam])
  const summaryDisplayName = useMemo(() => decodeName(nameParam), [nameParam])

  const [isOwnerView, setIsOwnerView] = useState(false)
  const [displayName, setDisplayName] = useState(summaryDisplayName)

  useEffect(() => {
    if (isSummary && meowParam) {
      try {
        const key = `owner:${meowParam}`
        setIsOwnerView(sessionStorage.getItem(key) === '1')
      } catch { }
    }
  }, [isSummary, meowParam])

  function ensureShareName() {
    const t = (displayName || '').trim()
    if (t) return t
    const name = `User-${Math.random().toString(36).slice(2, 7)}`
    setDisplayName(name)
    return name
  }

  function getShareUrl(name?: string) {
    if (!isSummary) return ''
    const u = new URL(window.location.href)
    if (meowParam) u.searchParams.set('meow', meowParam)
    if (name && name.trim()) u.searchParams.set('name', encodeName(name.trim()))
    else u.searchParams.delete('name')
    return u.toString()
  }

  const previewShareUrl = useMemo(() => {
    return isSummary ? getShareUrl((displayName || '').trim() || '') : ''
  }, [isSummary, meowParam, displayName])

  function restart() {
    const u = new URL(window.location.href)
    u.searchParams.delete('meow')
    u.searchParams.delete('name')
    window.location.replace(u.toString())
  }

  function onFinish(liked: string[]) {
    const encoded = encodeList(liked)
    try {
      sessionStorage.setItem(`owner:${encoded}`, '1')
    } catch { }
    const u = new URL(window.location.href)
    u.searchParams.set('meow', encoded)
    window.location.replace(u.toString())
  }

  return (
    <main className="app-screen">
      <Header isSummary={isSummary} />

      {!isSummary && (
        <CatStack count={16} onFinish={onFinish} />
      )}

      {isSummary && (
        <SummaryView
          images={summaryImages}
          displayName={displayName}
          setDisplayName={setDisplayName}
          previewShareUrl={previewShareUrl}
          getShareUrl={getShareUrl}
          ensureShareName={ensureShareName}
          restart={restart}
          isOwner={isOwnerView}
        />
      )}

      <div className="py-3 text-center text-xs text-secondary-foreground">
        <span>Images from&nbsp;</span>
        <a href='https://cataas.com'>
          https://cataas.com
        </a>
      </div>
    </main>
  )
}