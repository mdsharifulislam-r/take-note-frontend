import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from '@/app/store';
import { rehydrateAuth } from '@/features/auth/authSlice';
import App from './App';
import './index.css';

function AppWithRehydration() {
  useEffect(() => {
    store.dispatch(rehydrateAuth());
  }, []);

  return (
    <>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppWithRehydration />
    </Provider>
  </StrictMode>,
);
