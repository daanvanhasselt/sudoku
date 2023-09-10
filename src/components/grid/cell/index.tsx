import React, { FC } from 'react'

import styled, { css } from 'styled-components'

const CellDiv = styled.div`
  ${({ theme }) => css`
    margin: ${theme.border.thin};
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.white};
    font-size: ${theme.font.sizes.cell.large};
    @media (max-width: 650px) {
      font-size: ${theme.font.sizes.cell.medium};
    }
    @media (max-width: 450px) {
      font-size: ${theme.font.sizes.cell.small};
    }
  `}
`

interface CellProps {
  colIndex: number
  rowIndex: number
}

const Cell: FC<CellProps> = ({ colIndex, rowIndex }) => {
  return <CellDiv>{colIndex + 1}</CellDiv>
}

export default Cell
