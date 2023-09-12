import styled from 'styled-components'

export const Content = styled.div`
  width: 90vw;
  height: 90vw;

  @media (min-aspect-ratio: 1) {
    width: 90vh;
    height: 90vh;
  }

  @media (max-aspect-ratio: 1.4) {
    width: 80vh;
    height: 80vh;
  }

  @media (max-aspect-ratio: 0.9) {
    width: 90vw;
    height: 90vw;
  }

  display: flex;
  flex-direction: column;
  /* justify-content: center; */
`
