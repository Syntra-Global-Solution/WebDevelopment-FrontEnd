import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LoadingState } from './components/ui/LoadingState'

const TrajetosPage = lazy(() => import('./pages/TrajetosPage').then((module) => ({ default: module.TrajetosPage })))
const LinhasPage = lazy(() => import('./pages/LinhasPage').then((module) => ({ default: module.LinhasPage })))
const RelatosPage = lazy(() => import('./pages/RelatosPage').then((module) => ({ default: module.RelatosPage })))
const MapaPage = lazy(() => import('./pages/MapaPage').then((module) => ({ default: module.MapaPage })))

function PageFallback() {
  return <div className="page-section"><LoadingState label="Carregando página…" /></div>
}

function lazyPage(Page) {
  return <Suspense fallback={<PageFallback />}><Page /></Suspense>
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/trajetos" replace />} />

        <Route
          path="/trajetos"
          element={lazyPage(TrajetosPage)}
        />

        <Route
          path="/linhas"
          element={lazyPage(LinhasPage)}
        />

        <Route
          path="/relatos"
          element={lazyPage(RelatosPage)}
        />

        <Route
          path="/mapa"
          element={lazyPage(MapaPage)}
        />

        <Route
          path="*"
          element={<Navigate to="/trajetos" replace />}
        />
      </Route>
    </Routes>
  )
}

export default App
