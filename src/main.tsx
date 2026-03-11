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
