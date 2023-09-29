import { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSettingMode } from 'reducers'
import { Icon } from 'react-icons-kit'
import { ic_edit, ic_edit_off } from 'react-icons-kit/md'
import { IReducer } from 'reducers'

import styled, { css } from 'styled-components'

const SettingModeSwitchButton = styled.button`
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
    position: absolute;
  `}
`

const SettingModeSwitch: FC = () => {
  const dispatch = useDispatch()

  const selector = (state: IReducer) => state.present.settingMode
  const settingMode = useSelector(selector)

  const toggle = () => dispatch(toggleSettingMode())

  return (
    <SettingModeSwitchButton onClick={toggle}>
      <Icon icon={settingMode ? ic_edit_off : ic_edit} />
    </SettingModeSwitchButton>
  )
}

export default SettingModeSwitch
