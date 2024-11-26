// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Main from "./components/Main/main.jsx"
import Layout from './components/layout.jsx'
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Main />
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
)