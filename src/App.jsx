import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

import { TrajetosPage } from './pages/TrajetosPage'
import { LinhasPage } from './pages/LinhasPage'
import { RelatosPage } from './pages/RelatosPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/trajetos" replace />} />

        <Route
          path="/trajetos"
          element={<TrajetosPage />}
        />

        <Route
          path="/linhas"
          element={<LinhasPage />}
        />

        <Route
          path="/relatos"
          element={<RelatosPage />}
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