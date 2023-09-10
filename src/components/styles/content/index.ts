import styled from 'styled-components'

export const Content = styled.div`
  width: 90vw;
  height: 90vw;
  @media (min-aspect-ratio: 1) {
    width: 90vh;
    height: 90vh;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
`
