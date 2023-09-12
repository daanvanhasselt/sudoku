import { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSettingMode } from 'reducers'
import { Icon } from 'react-icons-kit'
import { ic_build, ic_done } from 'react-icons-kit/md'
import { IReducer } from 'reducers'

import styled, { css } from 'styled-components'

const SettingModeSwitchButton = styled.button`
  ${({ theme }) => css`
    background: transparent;
    color: ${theme.colors.white};
    /* border: none; */
    width: 4em;
    height: 4em;
    margin: 0;
    padding: 0;
    cursor: pointer;
    outline: none;
    position: absolute;
  `}
`

const SettingModeSwitch: FC = () => {
  const dispatch = useDispatch()

  const selector = (state: IReducer) => state.settingMode
  const settingMode = useSelector(selector)

  const toggle = () => dispatch(toggleSettingMode())

  return (
    <SettingModeSwitchButton onClick={toggle}>
      <Icon icon={settingMode ? ic_done : ic_build} />
    </SettingModeSwitchButton>
  )
}

export default SettingModeSwitch
