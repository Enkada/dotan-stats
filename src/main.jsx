import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from '../node_modules/react-router-dom/dist/index'
import './index.css'
import axios from 'axios'

axios.defaults.baseURL = 'https://dotan.enkada.ru/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
