import { ViteSSG } from 'vite-ssg/single-page'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

export const createApp = ViteSSG(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)