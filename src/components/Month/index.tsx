import React, { useEffect } from 'react'
import { findNodeHandle, UIManager, View } from 'react-native'
import { sharedDayStore } from '../../store/DayStore'
import { DayType, MonthProps } from '../../types'
import { getDayNames } from '../../utils/date'
import Day from '../Day'
import { areEqual, getMonthDays } from '../utils'
import WeekDays from '../WeekDays'

export default React.memo<MonthProps>((props: MonthProps, nextProps) => {
  const {
    month,
    year,
    onPress,
    locale = 'en',
    dayNames,
    showWeekdays,
    disabledDays = {},
    disableRange = false,
    disableOffsetDays = false,
    firstDayMonday = true,
    startDate,
    endDate,
    minDate,
    maxDate,
    theme = {},
    renderDayContent,
    activeCoordinates,
    onActiveDayChange,
    emptyDays,
    dark,
  } = props
  const DAY_NAMES =
    Array.isArray(dayNames) && dayNames.length === 7
      ? dayNames
      : getDayNames(locale, firstDayMonday)

  const days = getMonthDays(
    month,
    year,
    firstDayMonday,
    disableRange,
    disabledDays,
    disableOffsetDays,
    startDate,
    endDate,
    minDate,
    maxDate
  )
  const weeks = []
  while (days.length) {
    weeks.push(days.splice(0, 7))
  }
  if (activeCoordinates) {
    if (sharedDayStore.allDays) {
      if (!sharedDayStore.previousX || !sharedDayStore.previousY) {
        sharedDayStore.previousX = activeCoordinates.x
        sharedDayStore.previousY = activeCoordinates.y
      } else {
        if (
          Math.abs(sharedDayStore.previousX - activeCoordinates.y) < 25 ||
          Math.abs(sharedDayStore.previousY - activeCoordinates.x) < 25
        ) {
        } else {
          sharedDayStore.allDays.forEach((day) => {
            if (!day) {
              return
            }
            const date = day.actualDate
            const x = day.xPosition
            const y = day.yPosition
            if (
              Math.abs(y - activeCoordinates.y) < 30 &&
              Math.abs(x - activeCoordinates.x) < 30
            ) {
              sharedDayStore.previousX = activeCoordinates.x
              sharedDayStore.previousY = activeCoordinates.y
              onActiveDayChange(date)
            }
          })
        }
      }
    }
  }
  useEffect(() => {
    sharedDayStore.emptyDays()
    setTimeout(() => {
      sharedDayStore.compotedAllDaysRef.forEach((day) => {
        const handle = findNodeHandle(day.ref)
        if (!handle) {
          return
        }
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          sharedDayStore.addDay({
            xPosition: pageX,
            yPosition: pageY,
            actualDate: day.actualDate,
          })
        })
      })
    }, 1)
  })
  return (
    <View>
      {showWeekdays && <WeekDays days={DAY_NAMES} theme={theme} dark={dark} />}
      {weeks.map((week: DayType[], index: number) => (
        <View key={String(index)} style={{ flexDirection: 'row' }}>
          {week.map((day: DayType) => (
            <Day
              dark={dark}
              key={day.id}
              item={day}
              onPress={onPress}
              theme={theme}
              renderDayContent={renderDayContent}
            />
          ))}
        </View>
      ))}
    </View>
  )
}, areEqual)
