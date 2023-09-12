import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { register, configureStore } from 'core'
import { GlobalStyles, theme } from 'styles'
import { ThemeProvider } from 'styled-components'
import { Wrapper, Content, Card, Grid } from 'components'

const store = configureStore({})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Provider store={store}>
        <Wrapper data-tag="wrapper">
          <Content data-tag="content">
            <Card data-tag="card">
              <Grid />
            </Card>
          </Content>
        </Wrapper>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
)

// register service worker
register()
