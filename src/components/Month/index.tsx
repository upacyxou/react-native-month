import React, { useEffect } from 'react';
import { View, Text, findNodeHandle } from 'react-native';
import { DayType, MonthProps } from '../../types';
import { getDayNames } from '../../utils/date';
import { getMonthDays, areEqual } from '../utils';
import WeekDays from '../WeekDays';
import Day from '../Day';
import { useState } from 'react';
import { sharedDayStore } from '../../store/DayStore';
import { UIManager } from 'react-native';

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
  } = props;
  const DAY_NAMES =
    Array.isArray(dayNames) && dayNames.length === 7
      ? dayNames
      : getDayNames(locale, firstDayMonday);

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
  );
  const weeks = [];
  while (days.length) {
    weeks.push(days.splice(0, 7));
  }
  if (activeCoordinates) {
    if (!sharedDayStore.allDays) {
    } else {
      sharedDayStore.allDays.forEach((day) => {
        if (!day) {
          return;
        }
        const date = day.actualDate;
        const x = day.xPosition;
        const y = day.yPosition;
        if (
          Math.abs(y - activeCoordinates.y) < 30 &&
          Math.abs(x - activeCoordinates.x) < 30
        ) {
          onActiveDayChange(date.getDate());
        }
      });
    }
  }
  useEffect(() => {
    sharedDayStore.emptyDays();
    setTimeout(() => {
      sharedDayStore.compotedAllDaysRef.forEach((day) => {
        const handle = findNodeHandle(day.ref);
        if (!handle) {
          return;
        }
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          sharedDayStore.addDay({
            xPosition: pageX,
            yPosition: pageY,
            actualDate: day.actualDate,
          });
        });
      });
    }, 1);
  });
  return (
    <View>
      {showWeekdays && <WeekDays days={DAY_NAMES} theme={theme} />}
      {weeks.map((week: DayType[], index: number) => (
        <View key={String(index)} style={{ flexDirection: 'row' }}>
          {week.map((day: DayType) => (
            <Day
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
  );
}, areEqual);
