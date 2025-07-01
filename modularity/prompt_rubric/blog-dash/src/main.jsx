import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Import CSS files to maintain existing styles
import '../tokens.css'
import '../main.css'
import '../components/Header.css'
import '../components/StatsSection.css'
import '../components/SearchBar.css'
import '../components/PostsList.css'
import '../components/CommentsList.css'
import '../components/Footer.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 