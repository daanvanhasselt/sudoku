import { ReactNode, FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IReducer } from 'reducers'
import {
  selectAll,
  clearSelection,
  setValue,
  moveSelection,
  expandSelection,
  setMode,
} from 'reducers'
import { N } from 'typings'
import { ActionCreators as UndoActionCreators } from 'redux-undo'

import ConfettiExplosion from 'react-confetti-explosion'
import { isCompleted } from 'utils'

import styled, { css } from 'styled-components'

const WrapperDiv = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: baseline;
    align-items: center;
  `}
`

interface Props {
  children?: ReactNode
}

const Wrapper: FC<Props> = ({ children }) => {
  const dispatch = useDispatch()

  const grid = useSelector((state: IReducer) => state.present.grid)
  useEffect(() => {
    // if grid is solved, set confetti to true
    setConfetti(isCompleted(grid))
  }, [grid])

  const [confetti, setConfetti] = useState(false)

  // useeffect to add event listeners to root
  useEffect(() => {
    // handle keydown
    const handleKeyDown = (e: KeyboardEvent) => {
      // select all, clear selection
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A'))
        return dispatch(selectAll())
      if (e.key === 'Escape') return dispatch(clearSelection())

      // undo redo
      if (e.ctrlKey && e.key === 'z') return dispatch(UndoActionCreators.undo())
      if (e.ctrlKey && (e.key === 'Z' || e.key === 'y' || e.key === 'Y'))
        return dispatch(UndoActionCreators.redo())

      // remove or set value for cell
      if (e.key === 'Backspace' || e.key === 'Delete') {
        dispatch(setValue(undefined))
      } else if (e.keyCode >= 49 && e.keyCode <= 57) {
        dispatch(setValue((e.keyCode - 48) as N))
      }
      // do the same for numpad
      else if (e.keyCode >= 97 && e.keyCode <= 105) {
        dispatch(setValue((e.keyCode - 96) as N))
      }

      // handle arrow keys
      if (e.key === 'ArrowUp') {
        if (e.ctrlKey || e.shiftKey) return dispatch(expandSelection('up'))
        else dispatch(moveSelection('up'))
      } else if (e.key === 'ArrowDown') {
        if (e.ctrlKey || e.shiftKey) return dispatch(expandSelection('down'))
        else dispatch(moveSelection('down'))
      } else if (e.key === 'ArrowLeft') {
        if (e.ctrlKey || e.shiftKey) return dispatch(expandSelection('left'))
        else dispatch(moveSelection('left'))
      } else if (e.key === 'ArrowRight') {
        if (e.ctrlKey || e.shiftKey) return dispatch(expandSelection('right'))
        else dispatch(moveSelection('right'))
      }

      // set mode with z, x, c, v, b
      if (e.key === 'z') return dispatch(setMode('normal'))
      if (e.key === 'x') return dispatch(setMode('corner'))
      if (e.key === 'c') return dispatch(setMode('center'))
      if (e.key === 'v') return dispatch(setMode('highlight'))
      if (e.key === 'b') return dispatch(setMode('lines'))
    }

    // handle click outside of grid
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLDivElement) {
        if (
          e.target.dataset.tag === 'wrapper' ||
          e.target.dataset.tag === 'card' ||
          e.target.id === 'root'
        ) {
          return dispatch(clearSelection())
        }
      }
    }

    // get #root element
    const root = document.getElementById('root') as HTMLElement
    root.addEventListener('keydown', handleKeyDown)
    root.addEventListener('click', handleClick)

    return () => {
      root.removeEventListener('keydown', handleKeyDown)
      root.removeEventListener('click', handleClick)
    }
  }, [dispatch])

  return (
    <>
      <WrapperDiv data-tag="wrapper">
        {confetti && (
          <ConfettiExplosion
            force={0.1}
            duration={2000}
            particleCount={100}
            particleSize={25}
          />
        )}
        {children}
      </WrapperDiv>
    </>
  )
}

export default Wrapper
