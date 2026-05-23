import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { storage } from './utils/storage';
import './index.css';
import './styles/animations.css';
import './styles/layout.css';

const initialTheme = storage.getTheme();
document.documentElement.setAttribute('data-theme', initialTheme);
document.documentElement.style.colorScheme = initialTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
