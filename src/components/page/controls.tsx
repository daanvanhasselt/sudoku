import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setValue, setMode } from 'reducers'
import { N } from 'typings'
import { IReducer } from 'reducers'

import styled, { css } from 'styled-components'

const ControlsDiv = styled.div`
  ${({ theme }) => css`
    user-select: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    margin-top: 10px;
    width: 100%;

    button {
      min-width: 44px;
      height: 44px;
      border-radius: 10px;
      background: white;
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
    }
  `}
`

const Controls: FC = () => {
  const dispatch = useDispatch()
  // get mode from state
  const selector = (state: IReducer) => state.mode
  const mode = useSelector(selector)

  const fill = (n?: N) => dispatch(setValue(n))

  return (
    <>
      <ControlsDiv data-tag="controls">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => fill(n as N)}>
            {n}
          </button>
        ))}
        <button onClick={() => fill(undefined)}> </button>
      </ControlsDiv>
      <ControlsDiv data-tag="mode">
        <button
          className={mode === 'normal' ? 'active' : ''}
          onClick={() => dispatch(setMode('normal'))}
        >
          Normal
        </button>
        <button
          className={mode === 'corner' ? 'active' : ''}
          onClick={() => dispatch(setMode('corner'))}
        >
          Corner
        </button>
        <button
          className={mode === 'center' ? 'active' : ''}
          onClick={() => dispatch(setMode('center'))}
        >
          Center
        </button>
        <button
          className={mode === 'highlight' ? 'active' : ''}
          onClick={() => dispatch(setMode('highlight'))}
        >
          Highlight
        </button>
        <button
          className={mode === 'lines' ? 'active' : ''}
          onClick={() => dispatch(setMode('lines'))}
        >
          Lines
        </button>
      </ControlsDiv>
    </>
  )
}

export default Controls
