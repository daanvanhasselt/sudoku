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
  $highlight?: N
}

const CellDiv = styled.div<IProps>`
  ${({ selected, $highlight, theme }) => css`
    user-select: none;
    margin: ${theme.border.thin};
    display: flex;
    flex-wrap: wrap;
    flex: 1 0 0;
    align-items: center;
    justify-content: center;
    font-weight: normal;
    &.initial {
      font-weight: bold;
    }
    &.illegal {
      color: ${theme.colors.red};
    }
    background-color: ${selected
      ? $highlight && theme.colors.selectedHighlights[$highlight] !== undefined
        ? theme.colors.selectedHighlights[$highlight]
        : theme.colors.grid.cell.selected
      : // use highlight color if it exists
      $highlight && theme.colors.highlights[$highlight] !== undefined
      ? theme.colors.highlights[$highlight]
      : theme.colors.grid.cell.normal};
    font-size: ${theme.font.sizes.cell.large};
    @media (max-width: 650px), (max-height: 650px) {
      font-size: ${theme.font.sizes.cell.small};
    }

    position: relative;

    &:before {
      content: '';
      float: left;
      padding-top: 100%;
    }

    .corners {
      position: absolute;
      width: 100%;
      height: 100%;
      /* background-color: blue; */
    }

    .corner {
      margin: 0;
      position: absolute;
      width: ${theme.font.sizes.cell.medium};
      font-size: ${theme.font.sizes.cell.small};

      @media (max-width: 650px), (max-height: 650px) {
        font-size: ${theme.font.sizes.cell.extrasmall};
      }
      /* text-align: center; */
      /* background-color: red; */

      &:nth-child(1) {
        top: 5px;
        left: 0;
        @media (max-width: 650px), (max-height: 650px) {
          top: 0px;
          left: -2px;
        }
      }

      &:nth-child(2) {
        top: 5px;
        right: 0;
        @media (max-width: 650px), (max-height: 650px) {
          top: 0px;
          right: -2px;
        }
      }
      &:nth-child(3) {
        bottom: 5px;
        left: 0;
        @media (max-width: 650px), (max-height: 650px) {
          bottom: 0px;
          left: -2px;
        }
      }
      &:nth-child(4) {
        bottom: 5px;
        right: 0;
        @media (max-width: 650px), (max-height: 650px) {
          bottom: 0px;
          right: -2px;
        }
      }

      // hide all the other children
      &:nth-child(n + 5) {
        display: none;
      }
    }

    .center {
      position: absolute;
      font-size: ${theme.font.sizes.cell.medium};

      @media (max-width: 650px), (max-height: 650px) {
        font-size: ${theme.font.sizes.cell.extrasmall};
      }
    }

    .hidden {
      display: none;
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
      state.present.grid ? state.present.grid[colIndex][rowIndex] : undefined,
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
      className={`${cell?.isInitial ? 'initial' : ''} ${
        cell?.illegal ? 'illegal' : ''
      }`}
      $highlight={cell?.highlight}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      tabIndex={0}
      data-tag="cell"
      id={`cell${colIndex}${rowIndex}`}
    >
      {cell?.value}

      {/* render center */}
      <div className={`center ${cell?.value !== undefined ? 'hidden' : ''}`}>
        {cell?.centerValues?.map((n, i) => (
          <React.Fragment key={i}>{n}</React.Fragment>
        ))}
      </div>

      {/* render each corner */}
      <div className={`corners ${cell?.value !== undefined ? 'hidden' : ''}`}>
        {cell?.cornerValues?.map((n, i) => (
          <div className="corner" key={i}>
            {n}
          </div>
        ))}
      </div>
    </CellDiv>
  )
}

export default Cell
