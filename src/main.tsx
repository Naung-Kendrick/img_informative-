import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from './store'
import './index.css'
import './i18n'
import { ModalProvider } from './context/ModalContext'
import App from './App.tsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

// Hide the native HTML splash screen after 4 seconds (minimum display time)
const splash = document.getElementById('splash');
if (splash) {
  setTimeout(() => {
    splash.classList.add('hidden');
    // Remove from DOM after the CSS fade-out transition (0.6s)
    setTimeout(() => splash.remove(), 700);
  }, 4000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ModalProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </ModalProvider>
    </Provider>
  </StrictMode>,
);
