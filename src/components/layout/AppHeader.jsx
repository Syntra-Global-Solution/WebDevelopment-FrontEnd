import { UserMenu } from '../auth/UserMenu'

export function AppHeader() {
  return (
    <header className="z-[1000] flex min-h-16 shrink-0 items-center justify-between bg-navy px-4 pt-[env(safe-area-inset-top)] text-cream">
      <div className="flex items-center gap-2.5">
        <img src="/syntra-mark.svg" width="34" height="34" alt="" className="rounded-lg" />
        <div>
          <p className="text-lg font-bold leading-tight">Syntra</p>
          <p className="text-xs text-cream/70">São Paulo</p>
        </div>
      </div>
      <UserMenu />
    </header>
  )
}
