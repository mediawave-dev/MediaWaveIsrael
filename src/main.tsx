import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PreviewProvider } from './sanity/PreviewContext'
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PreviewProvider>
        <App />
      </PreviewProvider>
    </BrowserRouter>
  </StrictMode>,
)
