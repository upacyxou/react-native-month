import { throttle } from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { findNodeHandle, UIManager, View } from 'react-native';
import { sharedDayStore } from '../../store/DayStore';
import { DayType, MonthProps } from '../../types';
import { getDayNames } from '../../utils/date';
import Day from '../Day';
import { areEqual, getMonthDays } from '../utils';
import WeekDays from '../WeekDays';

@observer
export default class extends React.Component<MonthProps> {
  month = this.props.month;
  year = this.props.year;
  onPress = this.props.year;
  locale = this.props.locale ?? 'en';
  dayNames = this.props.dayNames;
  showWeekdays = this.props.showWeekdays;
  disabledDays = this.props.disabledDays ?? {};
  disableRange = this.props.disableRange ?? false;
  disableOffsetDays = this.props.disableOffsetDays ?? false;
  firstDayMonday = this.props.firstDayMonday ?? true;
  startDate = this.props.startDate;
  endDate = this.props.endDate;
  minDate = this.props.minDate;
  maxDate = this.props.maxDate;
  theme = this.props.theme ?? {};
  renderDayContent = this.props.renderDayContent;
  activeCoordinates = this.props.activeCoordinates;
  onActiveDayChange = this.props.onActiveDayChange;
  emptyDays = this.props.emptyDays;
  dark = this.props.dark;
  DAY_NAMES =
    Array.isArray(this.dayNames) && this.dayNames.length === 7
      ? this.dayNames
      : getDayNames(this.locale);

  @observable currentDay: number | undefined;

  throtltedFunc = () => {
    if (Object.keys(sharedDayStore.twoDimensionalMap).length) {
      const closestY = this.findClosest(
        Object.keys(sharedDayStore.twoDimensionalMap),
        this.props.activeCoordinates.y
      );
      const closestX = this.findClosest(
        Object.keys(sharedDayStore.twoDimensionalMap[closestY]),
        this.props.activeCoordinates.x
      );
      this.onActiveDayChange(
        sharedDayStore.twoDimensionalMap[closestY][closestX]
      );
      sharedDayStore.currentDate = sharedDayStore.twoDimensionalMap[closestY][
        closestX
      ].getDate();
      this.currentDay = sharedDayStore.twoDimensionalMap[closestY][
        closestX
      ].getDate();
    }
  };

  findClosest(arr: number[], toFind: number): number {
    if (arr.length <= 3) {
      return arr.reduce((acc, currentValue) => {
        const absCurrValue = Math.abs(currentValue - toFind);
        if (!acc) return currentValue;
        const absAccValue = Math.abs(acc - toFind);
        return absCurrValue < absAccValue ? currentValue : acc;
      });
    }
    const middleIndex = Math.round(arr.length / 2);
    const middleElement = arr[middleIndex];
    return middleElement < toFind
      ? this.findClosest(arr.splice(middleIndex, arr.length - 1), toFind)
      : this.findClosest(arr.splice(0, middleIndex), toFind);
  }

  days = getMonthDays(
    this.month,
    this.year,
    this.firstDayMonday,
    this.disableRange,
    this.disabledDays,
    this.disableOffsetDays,
    this.startDate,
    this.endDate,
    this.minDate,
    this.maxDate
  );
  weeks = [];
  componentWillMount() {
    while (this.days.length) {
      this.weeks.push(this.days.splice(0, 7));
    }
  }
  componentDidUpdate() {
    if (this.activeCoordinates) {
      this.throtltedFunc();
    }
  }
  render() {
    return (
      <View>
        {this.showWeekdays && (
          <WeekDays days={this.DAY_NAMES} theme={this.theme} dark={this.dark} />
        )}
        {this.weeks.map((week: DayType[], index: number) => (
          <View key={String(index)} style={{ flexDirection: 'row' }}>
            {week.map((day: DayType) => (
              <Day
                currentDay={this.currentDay}
                dark={this.dark}
                key={day.id}
                item={day}
                onPress={this.onPress}
                theme={this.theme}
                renderDayContent={this.renderDayContent}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }
}
