import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { FeedProvider } from './context/FeedContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <FeedProvider>
          <App />
        </FeedProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
