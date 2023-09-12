import styled from 'styled-components'

export const Content = styled.div`
  width: 90vw;
  height: 90vw;

  @media (min-aspect-ratio: 1) {
    width: 70vh;
    height: 70vh;
  }
  display: flex;
  flex-direction: column;
`
