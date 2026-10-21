import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@fontsource-variable/rubik'
import '@fontsource/stix-two-text/400.css'
import '@fontsource/stix-two-text/400-italic.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
