import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setValue, setMode, selectNumber, setGrid } from 'reducers'
import { N } from 'typings'
import { IReducer } from 'reducers'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { encodeGrid, decodeGrid } from 'utils'

import styled, { css } from 'styled-components'

const Btn = styled.button<{ $highlight?: N; $select?: Boolean }>`
  ${({ $highlight, $select, theme }) => css`
    min-width: 44px;
    height: 44px;
    border-radius: 10px;
    background-color: ${$highlight !== undefined &&
    theme.colors.highlights[$highlight] !== undefined
      ? theme.colors.highlights[$highlight]
      : theme.colors.white};
    font-size: 1.5em;
    color: ${$highlight ? theme.colors.transparent : theme.colors.black};

    flex-grow: 1;
    flex-shrink: 1;

    @media (max-width: 500px) {
      flex-basis: 33%;
      flex-grow: 0;
      flex-shrink: 0;
    }

    &.active {
      background: ${theme.colors.grid.cell.selected};
    }

    &:active {
      background: ${theme.colors.grid.cell.selected};
    }

    border: ${$select ? '2px dashed #000' : ''};
  `}
`

const ControlsDiv = styled.div<{ $highlight?: N }>`
  ${({ $highlight, theme }) => css`
    user-select: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    margin-top: 10px;
    width: 100%;
  `}
`

const Controls: FC = () => {
  const dispatch = useDispatch()
  // get mode from state
  const modeSelector = (state: IReducer) => state.present.mode
  const mode = useSelector(modeSelector)
  const gridSelector = (state: IReducer) => state.present.grid
  const grid = useSelector(gridSelector)

  const fill = (n?: N) => dispatch(setValue(n))
  const select = (n?: N) => dispatch(selectNumber(n))

  // load #data from url
  useEffect(() => {
    const url = new URL(window.location.href)
    const data = url.searchParams.get('data')
    if (data) {
      console.log(data)
      const grid = decodeGrid(data)
      if (grid) dispatch(setGrid(grid))
    }
  }, [])

  const importGrid = () => {
    navigator.clipboard.readText().then((text) => {
      const grid = decodeGrid(text)
      if (grid) dispatch(setGrid(grid))
    })
  }

  const exportGrid = () => {
    const gridString = encodeGrid(grid)
    navigator.clipboard.writeText(gridString)
    console.log(gridString)
    // alert the user
    alert('Copied to clipboard!')
  }

  const clipboardIsAvailable = () => {
    return navigator.clipboard && navigator.clipboard.writeText
  }

  return (
    <>
      <ControlsDiv data-tag="controls">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Btn
            key={n}
            onClick={() => fill(n as N)}
            $highlight={mode === 'highlight' ? (n as N) : undefined}
          >
            {mode === 'highlight' ? '..' : n}
          </Btn>
        ))}
        <Btn onClick={() => fill(undefined)}> </Btn>
      </ControlsDiv>
      <ControlsDiv data-tag="select">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Btn
            key={n}
            onClick={(event: React.MouseEvent) => {
              select(n as N)
            }}
            $select={true}
          >
            {n}
          </Btn>
        ))}
        <Btn $select={true} onClick={() => select(undefined)}>
          {' '}
        </Btn>
      </ControlsDiv>
      <ControlsDiv data-tag="mode">
        <Btn
          className={mode === 'normal' ? 'active' : ''}
          onClick={() => dispatch(setMode('normal'))}
        >
          Normal
        </Btn>
        <Btn
          className={mode === 'corner' ? 'active' : ''}
          onClick={() => dispatch(setMode('corner'))}
        >
          Corner
        </Btn>
        <Btn
          className={mode === 'center' ? 'active' : ''}
          onClick={() => dispatch(setMode('center'))}
        >
          Center
        </Btn>
        <Btn
          className={mode === 'highlight' ? 'active' : ''}
          onClick={() => dispatch(setMode('highlight'))}
        >
          Color
        </Btn>
      </ControlsDiv>
      <ControlsDiv data-tag="undo">
        <Btn onClick={() => dispatch(UndoActionCreators.undo())}>Undo</Btn>
        <Btn onClick={() => dispatch(UndoActionCreators.redo())}>Redo</Btn>
        <Btn
          style={{ display: clipboardIsAvailable() ? 'block' : 'none' }}
          onClick={() => importGrid()}
        >
          Import
        </Btn>
        <Btn
          style={{ display: clipboardIsAvailable() ? 'block' : 'none' }}
          onClick={() => exportGrid()}
        >
          Export
        </Btn>
      </ControlsDiv>
    </>
  )
}

export default Controls
