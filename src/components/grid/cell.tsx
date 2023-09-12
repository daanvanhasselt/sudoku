import React, { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import {
  IReducer,
  setSelectionMode,
  tickleCell,
  clearSelection,
} from 'reducers'
import { N, INDEX } from 'typings'

import styled, { css } from 'styled-components'

interface IProps {
  selected?: boolean
}

const CellDiv = styled.div<IProps>`
  ${({ selected, theme }) => css`
    user-select: none;
    margin: ${theme.border.thin};
    display: flex;
    flex: 1 0 0;
    align-items: center;
    justify-content: center;
    font-weight: normal;
    &.initial {
      font-weight: bold;
    }
    background-color: ${selected
      ? theme.colors.grid.cell.selected
      : theme.colors.grid.cell.normal};
    font-size: ${theme.font.sizes.cell.large};
    @media (max-width: 500px) {
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
    (state: IReducer) =>
      state.grid ? state.grid[colIndex][rowIndex] : undefined,
    (cell) => ({ cell })
  )
  const { cell } = useSelector(selector)

  const dispatch = useDispatch()

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // prevent pointer capture
    const target = e.target as HTMLDivElement
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }

    // start new selection when shift or ctrl is not pressed
    if (!e.shiftKey && !e.ctrlKey) {
      dispatch(clearSelection())
      dispatch(setSelectionMode(true))
    } else {
      // toggle selection mode when shift or ctrl is pressed
      dispatch(setSelectionMode(cell?.isSelected !== true))
    }
    // tickle cell
    dispatch(tickleCell({ col: colIndex as INDEX, row: rowIndex as INDEX }))
  }

  const handlePointerOver = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.buttons !== 1) return
    dispatch(tickleCell({ col: colIndex as INDEX, row: rowIndex as INDEX }))
  }

  return (
    <CellDiv
      selected={cell?.isSelected}
      className={cell?.isInitial ? 'initial' : ''}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      tabIndex={0}
      data-tag="cell"
    >
      {cell?.value}
    </CellDiv>
  )
}

export default Cell
