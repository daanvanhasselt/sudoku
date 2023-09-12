import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.black};
    user-select: none;
    touch-action: none;

    > :nth-child(3n) {
      margin-bottom: ${theme.border.thick};
      @media (max-width: 650px) {
        margin-bottom: ${theme.border.medium};
      }
    }

    > :nth-child(1) {
      margin-top: ${theme.border.thick};
      @media (max-width: 650px) {
        margin-top: ${theme.border.medium};
      }
    }
  `}
`
