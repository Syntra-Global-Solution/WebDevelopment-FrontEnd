
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import 'leaflet/dist/leaflet.css'
import './styles/index.css'

import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { OccurrencesProvider } from './contexts/OccurrencesContext.jsx'
import { JourneyProvider } from './contexts/JourneyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <OccurrencesProvider>
            <JourneyProvider>
              <App />
            </JourneyProvider>
          </OccurrencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
