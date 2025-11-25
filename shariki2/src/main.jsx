import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/bootstrap.min.css'
import './assets/all.min.css'
import './assets/bootstrap.bundle.min.js'
import './assets/all.min.js'
import "leaflet/dist/leaflet.css";



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
