import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import axios from 'axios'

// Configure API base. Prefer env override; fall back to current origin under /dotan/.
const apiBase = import.meta.env.VITE_API_BASE_URL || (
  window.location.origin + '/dotan/api'
);
axios.defaults.baseURL = apiBase;
axios.defaults.timeout = 30000;

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/dotan">
    <App />
  </BrowserRouter>
)
