import React from 'react'
import ReactDOM from 'react-dom/client'
import { register } from './core/service-worker/serviceWorkerRegistration'
import { GlobalStyles } from './styles'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles'
import { Wrapper, Content, Title, Card } from './components'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Wrapper data-tag="wrapper">
        {/* <Title data-tag="title">hello world</Title> */}
        <Content data-tag="content">
          <Card></Card>
        </Content>
      </Wrapper>
    </ThemeProvider>
  </React.StrictMode>
)

// register service worker
register()
