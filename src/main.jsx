import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext.jsx';
import App from './App.jsx';
import './styles/rebuild.css';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={null}>
          <App />
        </Suspense>
        <ToastContainer position="bottom-right" theme="dark" closeOnClick pauseOnHover />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
