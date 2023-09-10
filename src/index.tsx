import React from 'react'
import ReactDOM from 'react-dom/client'
import { register } from './core/service-worker/serviceWorkerRegistration'
import { GlobalStyles } from './styles'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div>hello world</div>
    </ThemeProvider>
  </React.StrictMode>
)

// register service worker
register()
