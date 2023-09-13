import { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createGrid } from 'reducers'
import { Icon } from 'react-icons-kit'
import { ic_delete } from 'react-icons-kit/md'
import { IReducer } from 'reducers'

import styled, { css } from 'styled-components'

const ResetBtn = styled.button`
  ${({ theme }) => css`
    background: transparent;
    color: ${theme.colors.white};
    border: none;
    width: 4em;
    height: 4em;
    @media (max-width: 650px), (max-height: 650px) {
      width: 2em;
      height: 2em;
    }
    margin: 0;
    padding: 0;
    cursor: pointer;
    outline: none;
    position: fixed;
    right: 50px;
  `}
`

const ResetButton: FC = () => {
  const dispatch = useDispatch()
  const reset = () => {
    // confirm
    if (window.confirm('Are you sure you want to reset the game?') === false)
      return
    dispatch(createGrid())
  }

  return (
    <ResetBtn onClick={reset}>
      <Icon icon={ic_delete} />
    </ResetBtn>
  )
}

export default ResetButton
