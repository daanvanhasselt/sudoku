import { ReactNode, FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { selectAll, clearSelection } from 'reducers'

import styled, { css } from 'styled-components'

const WrapperDiv = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: baseline;
  `}
`

interface Props {
  children?: ReactNode
}

const Wrapper: FC<Props> = ({ children }) => {
  const dispatch = useDispatch()

  // useeffect to add keydown listener to root
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e)
      if (e.ctrlKey && e.key === 'a') return dispatch(selectAll())
      if (e.key === 'Escape') return dispatch(clearSelection())
    }

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
