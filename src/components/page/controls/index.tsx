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
    align-items: center;
    justify-content: center;
    background-color: transparent;
    margin-top: 10px;

    button {
      flex: 1;
      height: 44px;
      margin-left: 5px;
      margin-right: 5px;
      border-radius: 10px;
      background: white;

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
    <ControlsDiv>
      <button onClick={() => fill(undefined)}>X</button>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button key={n} onClick={() => fill(n as N)}>
          {n}
        </button>
      ))}
    </ControlsDiv>
  )
}

export default Controls
