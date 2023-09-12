import styled, { css } from 'styled-components'

export const Title = styled.h1`
  ${({ theme }) => css`
    color: ${theme.colors.black};
    font-size: 35px;
    margin-top: 0;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  `}
`
