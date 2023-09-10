import styled, { css } from 'styled-components'

export const Cell = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.black};
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`
