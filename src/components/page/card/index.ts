import styled, { css } from 'styled-components'

export const Card = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border-radius: 5px;
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.05);
    color: ${theme.colors.black};
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 30px;
    @media (max-width: 650px) {
      padding: 15px;
    }
  `}
`
