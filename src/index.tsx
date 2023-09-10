import React from 'react'
import ReactDOM from 'react-dom/client'
import { register } from './core/service-worker/serviceWorkerRegistration'
import { GlobalStyles } from './styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <div>hello world</div>
  </React.StrictMode>
)

// register service worker
register()
