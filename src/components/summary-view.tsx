import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function SummaryView({
  images,
  displayName,
  setDisplayName,
  previewShareUrl,
  getShareUrl,
  ensureShareName,
  restart,
  isOwner,
}: {
  images: string[]
  displayName: string
  setDisplayName: (v: string) => void
  previewShareUrl: string
  getShareUrl: (name?: string) => string
  ensureShareName: () => string
  restart: () => void
  isOwner: boolean
}) {
  const title = isOwner
    ? 'Your favourites'
    : displayName
      ? `${displayName}'s favourites`
      : 'Favourites'

  const likedText = isOwner
    ? `You liked ${images.length} ${images.length === 1 ? 'cat' : 'cats'}!`
    : `${displayName || 'They'} liked ${images.length} ${images.length === 1 ? 'cat' : 'cats'
    }!`

  const startText = isOwner ? "Start Over" : "Begin my selection";

  function shareSystem(url: string) {
    const n = displayName?.trim() || 'My'
    const payload = { title: 'Paws & Preferences', text: `${n} favourite cats`, url }
    if (navigator.share) navigator.share(payload).catch(() => { })
  }

  const imageUrls = images.map(id => `https://cataas.com/cat/${id}`)

  return (
    <div className="summary-screen">
      <div className='w-full max-w-5xl'>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{likedText}</p>

        <div className="mt-4 max-h-[60vh] overflow-auto">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {imageUrls.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                loading="lazy"
                crossOrigin="anonymous"
                className="h-36 w-full rounded-md object-cover sm:h-40 md:h-44 lg:h-48"
              />
            ))}
          </div>
        </div>

        <div className="summary-cta mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={restart} title="Start a new selection">
            {startText}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Share</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share your favourites</DialogTitle>
                <DialogDescription>Add a display name and share your favourite cats.</DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Display name</label>
                  <Input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. nab"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Share link</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input readOnly value={previewShareUrl} />
                    <Button onClick={() => shareSystem(getShareUrl(ensureShareName()))} title="Share your favourites">
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}