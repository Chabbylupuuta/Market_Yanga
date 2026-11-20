import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthController from './AuthController'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <AuthController />
    </>
  </StrictMode>,
)
