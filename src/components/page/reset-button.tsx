import { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createGrid, softReset } from 'reducers'
import { Icon } from 'react-icons-kit'
import { ic_delete, ic_replay } from 'react-icons-kit/md'
import { IReducer } from 'reducers'

import styled, { css } from 'styled-components'

const Container = styled.div`
  ${({ theme }) => css`
    position: fixed;
    right: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `}
`

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
  `}
`

const ResetButton: FC = () => {
  const dispatch = useDispatch()
  const handleResetClick = () => {
    dispatch(createGrid())
  }

  const handleSoftResetClick = () => {
    dispatch(softReset())
  }

  return (
    <>
      <Container>
        <ResetBtn onClick={handleSoftResetClick}>
          <Icon icon={ic_replay} />
        </ResetBtn>
        <ResetBtn onClick={handleResetClick}>
          <Icon icon={ic_delete} />
        </ResetBtn>
      </Container>
    </>
  )
}

export default ResetButton
