import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FavProvider } from "./context/FavContext.tsx";
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavProvider>
    <App />
    </FavProvider>
  </StrictMode>,
)
