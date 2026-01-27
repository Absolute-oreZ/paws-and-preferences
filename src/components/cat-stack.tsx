import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CatCard from '@/components/cat-card'
import { useCatStack } from '@/hooks/use-cat-stack'
import ProgressDots from '@/components/progress-dots'
import RotatingText from '@/components/rotating-text'

export default function CatStack({ count, onFinish }: { count: number; onFinish: (list: string[]) => void }) {
  const { stack, liked, loading, swipe } = useCatStack(count)

  const currentIndex = count - stack.length + 1

  function likeTop() {
    swipe(true)
  }

  function nopeTop() {
    swipe(false)
  }

  useEffect(() => {
    if (!loading && stack.length === 0) onFinish(liked)
  }, [loading, stack.length, liked, onFinish])

  if (loading && stack.length === 0) {
    return (
      <div className="flex h-full items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-primary" />
        <div className='w-52'>
          <p className="font-semibold">
            <RotatingText
              texts={[
                'Finding purr-fect matches…',
                'Loading adorable felines…',
                'Gathering cat photos…',
                'Preparing the cuteness…'
              ]}
              rotationInterval={3000}
              staggerDuration={0.03}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
          </p>
          <p className="text-xs text-slate-400">Powered by Cataas</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="stack relative">
        {stack.map((item, idx) => (
          <Card
            key={item.url}
            className="cat-card animate-enter"
            style={{ zIndex: idx + 1 }}
          >
            <CatCard src={item.url} onSwiped={swipe} />
          </Card>
        ))}
      </div>

      <ProgressDots total={count} current={currentIndex} />

      <footer className="actions">
        <Button variant="outline" onClick={nopeTop} title='Nah, pass'>🙈</Button>
        <Button onClick={likeTop} title='I love this!'>❤️</Button>
      </footer>
    </>
  )
}