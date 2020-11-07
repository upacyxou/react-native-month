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
  TouchableOpacity,
  Button,
} from 'react-native';
import { Month, ThemeType } from 'react-native-month';

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
  month: number;
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
    month: new Date().getMonth(),
  };

  aniState = {
    pan: new Animated.ValueXY(),
  };

  emptyDays = () => {
    return;
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
            emptyDays={(emptyDays: any) => {
              this.emptyDays = emptyDays;
            }}
            activeCoordinates={this.state.activeCoordinates}
            month={this.state.month}
            year={this.state.startDate.getFullYear()}
            onPress={this.handlePress}
            theme={THEME}
            showWeekdays
            locale="en"
          />
          <Button
            onPress={() => {
              const replicaDate = this.state.startDate;
              replicaDate.setMonth(replicaDate.getMonth() + 1);
              this.emptyDays();
              this.setState({ month: replicaDate.getMonth() });
            }}
            title={'Next'}
          >
            {' '}
          </Button>
        </View>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.panStyle, styles.circle]}
        ></Animated.View>
        <Text> {this.state.activeDay}</Text>
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
