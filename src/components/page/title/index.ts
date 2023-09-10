import styled, { css } from 'styled-components'

export const Title = styled.h1`
  ${({ theme }) => css`
    color: ${theme.colors.white};
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  `}
`
