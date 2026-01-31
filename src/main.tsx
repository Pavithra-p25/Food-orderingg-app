import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartFavProvider } from "./context/CartFavContext";
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartFavProvider>
    <App />
    </CartFavProvider>
  </StrictMode>,
)
