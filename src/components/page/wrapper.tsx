import { ReactNode, FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  selectAll,
  clearSelection,
  setValue,
  moveSelection,
  expandSelection,
} from 'reducers'
import { N } from 'typings'

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

  // useeffect to add event listeners to root
  useEffect(() => {
    // handle keydown
    const handleKeyDown = (e: KeyboardEvent) => {
      // select all, clear selection
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A'))
        return dispatch(selectAll())
      if (e.key === 'Escape') return dispatch(clearSelection())

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

  return <WrapperDiv data-tag="wrapper">{children}</WrapperDiv>
}

export default Wrapper
