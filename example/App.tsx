// import { observable, observe } from 'mobx';
// import { observer } from 'mobx-react';

import React from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
} from 'react-native';
import { Month, ThemeType } from 'react-native-month';
// import { dayStore } from '../src/store/index';
// import Animated from 'react-native-reanimated';

const coodinates = [
  [377.71429443359375, 76.85713958740234, 1],
  [25.14285659790039, 127.14286041259766, 2],
  [84, 127.14286041259766, 3],
  [142.57142639160156, 127.14286041259766, 4],
  [201.42857360839844, 127.14286041259766, 5],
  [260.28570556640625, 127.14286041259766, 6],
  [319.1428527832031, 127.14286041259766, 7],
  [377.71429443359375, 127.14286041259766, 8],
  [25.14285659790039, 177.42857360839844, 9],
  [79.71428680419922, 177.42857360839844, 10],
  [138.2857208251953, 177.42857360839844, 11],
  [197.14285278320312, 177.42857360839844, 12],
  [256, 177.42857360839844, 13],
  [314.8571472167969, 177.42857360839844, 14],
  [373.4285583496094, 177.42857360839844, 15],
  [20.85714340209961, 227.7142791748047, 16],
  [79.71428680419922, 227.7142791748047, 17],
  [138.2857208251953, 227.7142791748047, 18],
  [197.14285278320312, 227.7142791748047, 19],
  [256, 227.7142791748047, 20],
  [314.8571472167969, 227.7142791748047, 21],
  [373.4285583496094, 227.7142791748047, 22],
  [20.85714340209961, 278, 23],
  [79.71428680419922, 278, 24],
  [138.2857208251953, 278, 25],
  [197.14285278320312, 278, 26],
  [256, 278, 27],
  [314.8571472167969, 278, 28],
  [373.4285583496094, 278, 29],
  [20.85714340209961, 328.28570556640625, 30],
];

const BLUE = '#6d95da';

const THEME: ThemeType = {
  weekColumnsContainerStyle: {},
  weekColumnStyle: {
    paddingVertical: 10,
  },
  weekColumnTextStyle: {
    color: '#b6c1cd',
    fontSize: 13,
  },
  nonTouchableDayContainerStyle: {},
  nonTouchableDayTextStyle: {},
  startDateContainerStyle: {},
  endDateContainerStyle: {},
  dayContainerStyle: {},
  dayTextStyle: {
    color: '#2d4150',
    fontWeight: '200',
    fontSize: 15,
  },
  dayOutOfRangeContainerStyle: {},
  dayOutOfRangeTextStyle: {},
  todayContainerStyle: {},
  todayTextStyle: {
    color: BLUE,
  },
  activeDayContainerStyle: {
    backgroundColor: BLUE,
  },
  activeDayTextStyle: {
    color: 'white',
  },
  nonTouchableLastMonthDayTextStyle: {},
};

const truthyValue = true;

const DISABLED_DAYS = {
  '2020-03-20': truthyValue,
  '2020-03-10': truthyValue,
};

type Props = {};

type State = {
  activeCoordinates: any;
  activeDay: number;
  disableRange: boolean;
  offsets: boolean;
  minDate?: Date;
  maxDate?: Date;
  startDate: Date;
  endDate?: Date;
};

export default class App extends React.PureComponent<Props, State> {
  state = {
    activeCoordinates: {},
    activeDay: 0,
    disableRange: false,
    offsets: false,
    startDate: new Date(2020, 2, 11),
    endDate: new Date(2020, 2, 12),
    minDate: new Date(2020, 2, 6),
    maxDate: new Date(2020, 2, 20),
  };

  aniState = {
    pan: new Animated.ValueXY(),
  };

  handlePress = (date: Date) => {
    const { startDate, endDate } = this.state;
    let newStartDate;
    let newEndDate;

    if (this.state.disableRange) {
      newStartDate = date;
      newEndDate = date;
    } else if (startDate) {
      if (endDate) {
        newStartDate = date;
        newEndDate = undefined;
      } else if (date < startDate!) {
        newStartDate = date;
      } else if (date > startDate!) {
        newStartDate = startDate;
        newEndDate = date;
      } else {
        newStartDate = date;
        newEndDate = date;
      }
    } else {
      newStartDate = date;
    }

    const newRange = {
      startDate: newStartDate as Date,
      endDate: newEndDate,
    };

    this.setState(newRange);
  };
  panStyle = {
    transform: this.aniState.pan.getTranslateTransform(),
  };
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => true,
    onPanResponderMove: Animated.event(
      [null, { dx: this.aniState.pan.x, dy: this.aniState.pan.y }],
      {
        listener: ({ nativeEvent }: any) => {
          this.setState({
            activeCoordinates: { x: nativeEvent.pageX, y: nativeEvent.pageY },
          });
          coodinates.forEach((arr) => {
            const date = arr[2];
            const x = arr[0];
            const y = arr[1];
            if (
              Math.abs(y - nativeEvent.pageY) < 30 &&
              Math.abs(x - nativeEvent.pageX) < 30
            ) {
              return true;
            }
          });
        },
      }
    ),
    onPanResponderRelease: (e, gesture) => {
      Animated.spring(this.aniState.pan, {
        toValue: { x: 0, y: 0 },
        friction: 5,
      }).start();
      // adjusting delta value
    },
  });
  render() {
    return (
      <SafeAreaView>
        <View
          style={{
            paddingTop: StatusBar.currentHeight,
          }}
        >
          <Month
            onActiveDayChange={(activeDay: number) =>
              this.setState({ activeDay: activeDay })
            }
            activeCoordinates={this.state.activeCoordinates}
            month={this.state.startDate.getMonth()}
            year={this.state.startDate.getFullYear()}
            onPress={this.handlePress}
            theme={THEME}
            showWeekdays
            locale="en"
          />
          <Text>{this.state.activeDay}</Text>
        </View>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.panStyle, styles.circle]}
        ></Animated.View>
      </SafeAreaView>
    );
  }
}

let CIRCLE_RADIUS = 15;
let styles = StyleSheet.create({
  circle: {
    backgroundColor: 'skyblue',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
});
