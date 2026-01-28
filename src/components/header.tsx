import { Kbd } from '@/components/ui/kbd'

export default function Header({ isSummary }: { isSummary: boolean }) {
  return (
    <header className="py-4 text-center">
      <div className="inline-flex items-center gap-2">
        <img src='./logo.png' alt='logo' className="w-10 h-10" />
        <h1 className="text-xl font-semibold">
          Paws <span className="text-primary">&</span> Preferences
        </h1>
      </div>
      {!isSummary && (
        <>
          <p className="mt-1 text-xs text-slate-400 text-wrap">
            Swipe right or double-tap to like, left to skip — or use the buttons below.
          </p>
          <div className="hidden lg:flex justify-center gap-2 mt-2 text-xs text-slate-500">
            <span>Use keyboard:</span> <Kbd>←</Kbd> to pass, <Kbd>→</Kbd> for like
          </div>
        </>
      )}
    </header>
  )
}
