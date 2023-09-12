import styled, { css } from 'styled-components'

export const Row = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    flex: 1;

    :nth-child(3n) {
      margin-right: ${theme.border.thick};
      @media (max-width: 500px) {
        margin-right: ${theme.border.medium};
      }
    }

    :nth-child(1) {
      margin-left: ${theme.border.thick};
      @media (max-width: 500px) {
        margin-left: ${theme.border.medium};
      }
    }
  `}
`
