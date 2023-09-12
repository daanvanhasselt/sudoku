import styled, { css } from 'styled-components'

export const Title = styled.h1`
  ${({ theme }) => css`
    color: ${theme.colors.white};
    font-size: 50px;
    @media (max-width: 500px), (max-height: 500px) {
      font-size: 25px;
    }
    margin-top: 0;
    margin-bottom: 5px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    user-select: none;
  `}
`
