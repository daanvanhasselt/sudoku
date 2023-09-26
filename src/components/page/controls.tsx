import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setValue, setMode, selectNumber, setSelectionMode } from 'reducers'
import { N } from 'typings'
import { IReducer } from 'reducers'

import styled, { css } from 'styled-components'

const Btn = styled.button<{ highlight?: N }>`
  ${({ highlight, theme }) => css`
    min-width: 44px;
    height: 44px;
    border-radius: 10px;
    background-color: ${highlight !== undefined &&
    theme.colors.highlights[highlight] !== undefined
      ? theme.colors.highlights[highlight]
      : theme.colors.white};
    font-size: 1.5em;

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
  `}
`

const ControlsDiv = styled.div<{ highlight?: N }>`
  ${({ highlight, theme }) => css`
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
  const selector = (state: IReducer) => state.mode
  const mode = useSelector(selector)

  const fill = (n?: N) => dispatch(setValue(n))
  const select = (n?: N) => dispatch(selectNumber(n))

  return (
    <>
      <ControlsDiv data-tag="controls">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Btn
            key={n}
            onClick={() => fill(n as N)}
            highlight={mode === 'highlight' ? (n as N) : undefined}
          >
            {n}
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
            highlight={mode === 'highlight' ? (n as N) : undefined}
          >
            {n}
          </Btn>
        ))}
        <Btn onClick={() => select(undefined)}> </Btn>
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
          Highlight
        </Btn>
        <Btn
          className={mode === 'lines' ? 'active' : ''}
          onClick={() => dispatch(setMode('lines'))}
        >
          Lines
        </Btn>
      </ControlsDiv>
    </>
  )
}

export default Controls
