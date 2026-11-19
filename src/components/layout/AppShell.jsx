import { Outlet } from 'react-router-dom'
import { LoginModal } from '../auth/LoginModal'
import { AppHeader } from './AppHeader'
import { BottomNavigation } from './BottomNavigation'
import { PhoneSimulator } from './PhoneSimulator'

export function AppShell() {
  return (
    <main className="app-background flex min-h-dvh flex-col items-center justify-start gap-3 pb-4 sm:justify-center sm:p-4">
      <PhoneSimulator>
        <AppHeader />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" id="app-content" tabIndex={-1}>
          <Outlet />
        </div>
        <BottomNavigation />
        <LoginModal />
      </PhoneSimulator>
      <p className="max-w-[410px] px-4 text-center text-[11px] leading-relaxed text-cream/70">
        A Syntra é um protótipo acadêmico. Por limitações técnicas e de acesso aos dados, nem todas as informações exibidas são 100% verdadeiras, completas ou corretas.
      </p>
    </main>
  )
}
