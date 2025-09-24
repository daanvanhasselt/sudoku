import {
  FC,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setValue, setMode, selectNumber, setGrid } from 'reducers'
import { N } from 'typings'
import { IReducer } from 'reducers'
import { decodeGrid } from 'utils'

import styled, { css } from 'styled-components'

const Btn = styled.button<{
  $highlight?: N
  $small?: Boolean
}>`
  ${({ $highlight, $small, theme }) => css`
    min-width: ${$small ? 'auto' : '44px'};
    height: ${$small ? '36px' : '44px'};
    border-radius: 10px;
    background-color: ${$highlight !== undefined &&
    theme.colors.highlights[$highlight] !== undefined
      ? theme.colors.highlights[$highlight]
      : theme.colors.white};
    font-size: ${$small ? '1em' : '1.5em'};
    color: ${$highlight ? theme.colors.transparent : theme.colors.black};

    flex-grow: ${$small ? 0 : 1};
    flex-shrink: 1;
    padding: ${$small ? '0 12px' : '0'};

    @media (max-width: 500px) {
      ${
        !$small &&
        css`
          flex-basis: 33%;
          flex-grow: 0;
          flex-shrink: 0;
        `
      }
    }

    &.active {
      background: ${theme.colors.grid.cell.selected};
    }

    &:active {
      background: ${theme.colors.grid.cell.selected};
    }
  `}
`

const ControlsDiv = styled.div<{ $highlight?: N }>`
  ${({ $highlight, theme }) => css`
    user-select: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    margin-top: 10px;
    width: 100%;

    &[data-tag='mode'] {
      flex-wrap: nowrap;
      gap: 8px;
    }

    a,
    p {
      color: ${theme.colors.lightBlue};
      font-size: 0.75em;
      user-select: text;
    }
  `}
`

const Controls: FC = () => {
  const dispatch = useDispatch()
  // get mode from state
  const modeSelector = (state: IReducer) => state.present.mode
  const mode = useSelector(modeSelector)

  const fill = (n?: N) => dispatch(setValue(n))
  const select = (n?: N) => dispatch(selectNumber(n))

  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const longPressTriggeredRef = useRef<boolean>(false)
  const suppressClickRef = useRef<boolean>(false)

  const clearLongPressTimeout = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }
  }

  const startLongPressTimer = (value?: N) => {
    clearLongPressTimeout()
    longPressTriggeredRef.current = false
    longPressTimeoutRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true
      longPressTimeoutRef.current = null
      select(value)
    }, 500)
  }

  const handlePointerDown = (value?: N) => (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    suppressClickRef.current = false
    startLongPressTimer(value)
  }

  const handlePointerUp = (value?: N) => (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }
    const wasLongPress = longPressTriggeredRef.current
    clearLongPressTimeout()
    suppressClickRef.current = true
    if (!wasLongPress) {
      fill(value)
    }
  }

  const handlePointerLeave = () => {
    clearLongPressTimeout()
    longPressTriggeredRef.current = false
  }

  const handleClick = (value?: N) => (
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    fill(value)
  }

  const handleContextMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // load #data from url
  useEffect(() => {
    const url = new URL(window.location.href)
    const data = url.searchParams.get('data')
    if (data) {
      const grid = decodeGrid(data)
      if (grid) dispatch(setGrid(grid))
    }
  }, [dispatch])

  return (
    <>
      <ControlsDiv data-tag="controls">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Btn
            key={n}
            onPointerDown={handlePointerDown(n as N)}
            onPointerUp={handlePointerUp(n as N)}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerLeave}
            onClick={handleClick(n as N)}
            onContextMenu={handleContextMenu}
            $highlight={mode === 'highlight' ? (n as N) : undefined}
          >
            {mode === 'highlight' ? '..' : n}
          </Btn>
        ))}
        <Btn
          onPointerDown={handlePointerDown(undefined)}
          onPointerUp={handlePointerUp(undefined)}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
          onClick={handleClick(undefined)}
          onContextMenu={handleContextMenu}
        >
          {' '}
        </Btn>
      </ControlsDiv>
      <ControlsDiv data-tag="mode">
        <Btn
          className={mode === 'normal' ? 'active' : ''}
          onClick={() => dispatch(setMode('normal'))}
          $small={true}
        >
          Normal
        </Btn>
        <Btn
          className={mode === 'corner' ? 'active' : ''}
          onClick={() => dispatch(setMode('corner'))}
          $small={true}
        >
          Corner
        </Btn>
        <Btn
          className={mode === 'center' ? 'active' : ''}
          onClick={() => dispatch(setMode('center'))}
          $small={true}
        >
          Center
        </Btn>
        <Btn
          className={mode === 'highlight' ? 'active' : ''}
          onClick={() => dispatch(setMode('highlight'))}
          $small={true}
        >
          Color
        </Btn>
      </ControlsDiv>
    </>
  )
}

export default Controls
