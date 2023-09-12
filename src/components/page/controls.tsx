import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { setValue } from 'reducers'
import { N } from 'typings'

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
      border-radius: 25px;
      background: white;
      font-size: 1.5em;

      flex-basis: 10%;
      @media (max-width: 500px) {
        flex-basis: 33%;
      }

      &:active {
        background: ${theme.colors.grid.cell.selected};
      }
    }
  `}
`

const Controls: FC = () => {
  const dispatch = useDispatch()

  const fill = (n?: N) => dispatch(setValue(n))

  return (
    <ControlsDiv data-tag="controls">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button key={n} onClick={() => fill(n as N)}>
          {n}
        </button>
      ))}
      <button onClick={() => fill(undefined)}> </button>
    </ControlsDiv>
  )
}

export default Controls
