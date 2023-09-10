import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { IReducer } from 'reducers'
import { CELL } from 'typings'

import styled, { css } from 'styled-components'

const CellDiv = styled.div`
  ${({ theme }) => css`
    margin: ${theme.border.thin};
    display: flex;
    flex: 1 0 0;
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

    &:before {
      content: '';
      float: left;
      padding-top: 100%;
    }
  `}
`

interface CellProps {
  colIndex: number
  rowIndex: number
}

const Cell: FC<CellProps> = ({ colIndex, rowIndex }) => {
  const selector = createSelector(
    ({ grid }: IReducer) => grid && grid[colIndex][rowIndex],
    (cell) => ({ cell })
  )

  const { cell } = useSelector(selector)

  return <CellDiv>{cell?.value}</CellDiv>
}

export default Cell
