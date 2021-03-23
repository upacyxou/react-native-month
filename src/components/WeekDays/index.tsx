import React from 'react'
import { Text, View } from 'react-native'
import { ThemeType } from '../../types'

function areEqual(nextProps: any, prevProps: any) {
  return false
}

const SHOULD_NOT_UPDATE = false

interface WeekColumnProps {
  day: string
  theme: ThemeType
  dark: boolean
}

const WeekColumn = React.memo<WeekColumnProps>(
  (props: WeekColumnProps) => (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          backgroundColor: props.dark ? '#19191A' : '#FCFCFE',
        },
        props.theme.weekColumnStyle,
      ]}
    >
      <Text
        allowFontScaling={false}
        style={{
          ...props.theme.weekColumnTextStyle,
          color: props.dark ? '#f9f9f9' : '#060606',
        }}
      >
        {props.day}
      </Text>
    </View>
  ),
  areEqual
)

interface WeekColumnsProps {
  days: string[]
  theme: ThemeType
  dark: boolean
}

export default React.memo<WeekColumnsProps>(
  (props: WeekColumnsProps) => (
    <View
      style={[{ flexDirection: 'row' }, props.theme.weekColumnsContainerStyle]}
    >
      {props.days.map((day: string) => (
        <WeekColumn key={day} day={day} theme={props.theme} dark={props.dark} />
      ))}
    </View>
  ),
  areEqual
)
