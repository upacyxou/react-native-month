import React, { ComponentType } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { sharedDayStore } from '../../store/DayStore'
// import { dayStore } from '../../store';
import { DayType, ThemeType } from '../../types'

const styles = StyleSheet.create({
  activeDate: {
    backgroundColor: '#3b5998',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    marginVertical: 5,
    paddingVertical: 10,
  },
  endDate: {
    borderBottomRightRadius: 60,
    borderTopRightRadius: 60,
  },
  startDate: {
    borderBottomLeftRadius: 60,
    borderTopLeftRadius: 60,
  },
})

interface NonTouchableDayProps {
  dark: boolean
  date: Date
  isActive: boolean
  isMonthDate: boolean
  isOutOfRange: boolean
  isStartDate: boolean
  isEndDate: boolean
  isVisible: boolean
  isToday: boolean
  theme: ThemeType
}

const NonTouchableDay = React.memo<NonTouchableDayProps>(
  (props: NonTouchableDayProps) => {
    const {
      isMonthDate,
      isActive,
      isOutOfRange,
      isStartDate,
      isEndDate,
      theme,
      date,
      isToday,
      dark,
    } = props

    return (
      <View
        style={[
          styles.container,
          theme.dayContainerStyle,
          theme.nonTouchableDayContainerStyle,
          isToday && !isActive ? theme.todayContainerStyle : {},
          isActive ? styles.activeDate : {},
          isActive ? theme.activeDayContainerStyle : {},
          isOutOfRange ? theme.dayOutOfRangeContainerStyle : {},
          isEndDate ? styles.endDate : {},
          isEndDate ? theme.endDateContainerStyle : {},
          isStartDate ? styles.startDate : {},
          isStartDate ? theme.startDateContainerStyle : {},
          { backgroundColor: dark ? '#19191A' : '#FCFCFE' },
        ]}
      >
        <Text
          style={[
            { color: '#d3d3d3' },
            theme.nonTouchableDayTextStyle,
            isMonthDate ? theme.nonTouchableLastMonthDayTextStyle : {},
            isToday ? theme.todayTextStyle : {},
            isOutOfRange ? theme.dayOutOfRangeTextStyle : {},
          ]}
        >
          {date.getDate()}
        </Text>
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.dark === nextProps.dark &&
      JSON.stringify(prevProps.theme) === JSON.stringify(nextProps.theme) &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.isStartDate === nextProps.isStartDate &&
      prevProps.isEndDate === nextProps.isEndDate
    )
  }
)

interface Props {
  onPress: (date: Date) => void
  item: DayType
  theme: ThemeType
  dark: boolean
  renderDayContent?: (day: DayType) => ComponentType
}

const Day = React.memo<Props>(
  (props: Props) => {
    let {
      item: {
        date,
        isVisible,
        isActive,
        isStartDate,
        isEndDate,
        isMonthDate,
        isToday,
        isHidden,
        isOutOfRange,
      },
      theme,
      dark,
    } = props

    if (!isOutOfRange && date.getTime() < new Date().getTime()) {
      isVisible = false
    }

    if (isHidden) {
      return <View style={[styles.container]} />
    }

    if (!isVisible) {
      return (
        <NonTouchableDay
          dark={dark}
          isActive={isActive}
          date={date}
          theme={theme}
          isMonthDate={isMonthDate}
          isOutOfRange={isOutOfRange}
          isStartDate={isStartDate}
          isEndDate={isEndDate}
          isVisible={isVisible}
          isToday={isToday}
        />
      )
    }
    return (
      <TouchableOpacity
        style={[
          styles.container,
          theme.dayContainerStyle,
          isToday && !isActive ? theme.todayContainerStyle : {},
          isActive ? styles.activeDate : {},
          isActive ? theme.activeDayContainerStyle : {},
          isStartDate ? styles.startDate : {},
          isStartDate ? theme.startDateContainerStyle : {},
          isEndDate ? styles.endDate : {},
          isEndDate ? theme.endDateContainerStyle : {},
          { backgroundColor: dark ? '#19191A' : '#FCFCFE' },
        ]}
        onPress={() => props.onPress(props.item.date)}
      >
        {props.renderDayContent ? (
          props.renderDayContent(props.item)
        ) : (
          <Text
            ref={(ref) => {
              sharedDayStore.addDayRef({
                ref: ref,
                actualDate: date,
              })
            }}
            style={[
              theme.dayTextStyle,
              isToday ? theme.todayTextStyle : {},
              isActive ? theme.activeDayTextStyle : {},
              theme.dayTextStyle,
              isToday ? theme.todayTextStyle : {},
              isActive ? theme.activeDayTextStyle : {},
              { color: dark ? '#f9f9f9' : '#060606' },
            ]}
          >
            {date.getDate()}
          </Text>
        )}
      </TouchableOpacity>
    )
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.theme) === JSON.stringify(nextProps.theme) &&
      prevProps.dark === nextProps.dark &&
      prevProps.item.isActive === nextProps.item.isActive &&
      prevProps.item.isVisible === nextProps.item.isVisible &&
      prevProps.item.isStartDate === nextProps.item.isStartDate &&
      prevProps.item.isEndDate === nextProps.item.isEndDate &&
      prevProps.renderDayContent === nextProps.renderDayContent
    )
  }
)

export default Day
