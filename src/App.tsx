import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/header'
import CatStack from '@/components/cat-stack'
import SummaryView from '@/components/summary-view'
import { decodeList, decodeName, encodeList, encodeName } from './lib/utils'

export default function App() {
  // SSR Check: Ensure window is defined before accessing location
  const params = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search)
    }
    return new URLSearchParams()
  }, [])

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
        // Only run in browser
        if (typeof sessionStorage !== 'undefined') {
          const key = `owner:${meowParam}`
          setIsOwnerView(sessionStorage.getItem(key) === '1')
        }
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
    if (!isSummary || typeof window === 'undefined') return ''
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
    if (typeof window === 'undefined') return
    const u = new URL(window.location.href)
    u.searchParams.delete('meow')
    u.searchParams.delete('name')
    window.location.replace(u.toString())
  }

  function onFinish(liked: string[]) {
    if (typeof window === 'undefined') return
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
      <Helmet>
        <title>Paws & Preferences | Rate Your Favorite Cats</title>
        <meta name="description" content="Swipe through cute cats and save your top preferences. Share your custom cat stack with friends!" />
        <link rel="canonical" href="https://absolute-orez.github.io/paws-and-preferences/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://absolute-orez.github.io/paws-and-preferences/" />
        <meta property="og:title" content="Paws & Preferences | Rate Your Favorite Cats" />
        <meta property="og:description" content="Discover your cat personality by swiping through the best cat photos." />
        <meta property="og:image" content="https://absolute-orez.github.io/paws-and-preferences/og-image.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://absolute-orez.github.io/paws-and-preferences/" />
        <meta property="twitter:title" content="Paws & Preferences" />
        <meta property="twitter:description" content="Swipe through cute cats and save your top preferences." />
        <meta property="twitter:image" content="https://absolute-orez.github.io/paws-and-preferences/og-image.jpg" />
      </Helmet>

      <Header isSummary={isSummary} />

      {!isSummary && (
        <CatStack count={12} onFinish={onFinish} />
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
        <a href='https://cataas.com' target='_blank' rel="noreferrer">
          https://cataas.com
        </a>
      </div>
    </main>
  )
}