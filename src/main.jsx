import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from './router';
import App from './App';
import './styles.css';
import './refinement.css';

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
