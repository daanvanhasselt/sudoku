import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { Icon } from 'react-icons-kit'
import { ic_undo } from 'react-icons-kit/md/ic_undo'
import { ic_redo } from 'react-icons-kit/md/ic_redo'

import styled, { css } from 'styled-components'

const Container = styled.div`
  ${({ theme }) => css`
    position: fixed;
    left: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
  `}
`

const UndoBtn = styled.button`
  ${({ theme }) => css`
    background: transparent;
    color: ${theme.colors.white};
    border: none;
    width: 4em;
    height: 4em;
    margin: 0;
    padding: 0;
    cursor: pointer;
    outline: none;

    @media (max-width: 650px), (max-height: 650px) {
      width: 2em;
      height: 2em;
    }
  `}
`

const UndoButtons: FC = () => {
  const dispatch = useDispatch()

  return (
    <Container>
      <UndoBtn onClick={() => dispatch(UndoActionCreators.undo())}>
        <Icon icon={ic_undo} />
      </UndoBtn>
      <UndoBtn onClick={() => dispatch(UndoActionCreators.redo())}>
        <Icon icon={ic_redo} />
      </UndoBtn>
    </Container>
  )
}

export default UndoButtons
