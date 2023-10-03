import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {convertedDataType, data, id} from '../utils/types';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {DateTime} from 'luxon';
import MOCK_DATA from '../mockData/MOCK_DATA.json';
import {convertDataToIdsAndCollection} from '../utils/convertDataToIdAndCollection';
import {getWeekDates} from '../utils/getWeekDates';

type EventCardPropsType = {
  currentTask: data | undefined;
  activeItem: SharedValue<id | undefined>;
  activeItemPoistion: SharedValue<{
    x: number;
    y: number;
  }>;
  activeItemOverCell: SharedValue<
    | {
        row: number;
        column: number;
      }
    | undefined
  >;
  scrollViewHorizontalOffsetValue: SharedValue<number>;
  scrollViewVerticalOffsetValue: SharedValue<number>;
  heightOfEachRow: {
    [key: string]: {
      y1: number;
      y2: number;
    };
  };
  getWeekDatesData: DateTime[];
  setConvertedData: React.Dispatch<
    React.SetStateAction<convertedDataType | null>
  >;

  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  convertedData: convertedDataType | null;
  horizontalScrolViewRef: React.MutableRefObject<ScrollView | null>;
  verticalScrolViewRef: React.MutableRefObject<ScrollView | null>;
  heightOfScrollView: SharedValue<number>;
};

const EventCard = (props: EventCardPropsType) => {
  const {
    currentTask,
    activeItem,
    activeItemPoistion,
    activeItemOverCell,
    scrollViewHorizontalOffsetValue,
    heightOfEachRow,
    scrollViewVerticalOffsetValue,
    getWeekDatesData,
    setConvertedData,
    convertedData,
    setTitle,
    horizontalScrolViewRef,
    verticalScrolViewRef,
  } = props;

  const PanGesture = Gesture.Pan()
    .onBegin(({absoluteX, absoluteY}) => {
      activeItem.value = currentTask?.id;
      activeItemPoistion.value = {
        x: absoluteX,
        y: absoluteY,
      };
      runOnJS(setTitle)(currentTask?.title);
      const row =
        Object.keys(heightOfEachRow).find(
          key =>
            heightOfEachRow[key].y1 <
              activeItemPoistion.value.y +
                scrollViewVerticalOffsetValue.value &&
            heightOfEachRow[key].y2 >
              activeItemPoistion.value.y + scrollViewVerticalOffsetValue.value,
        ) || 0;

      activeItemOverCell.value = {
        row: +row,
        column: Math.floor(
          (activeItemPoistion.value.x + scrollViewHorizontalOffsetValue.value) /
            150,
        ),
      };
    })
    .onChange(({absoluteX, absoluteY, changeX, changeY}) => {
      activeItemPoistion.value = {
        x: absoluteX + changeX,
        y: absoluteY + changeY,
      };

      // for horizontal auto scroll
      if (
        activeItemPoistion.value.x > 380 &&
        absoluteX + scrollViewHorizontalOffsetValue.value < 1100
      ) {
        runOnJS(scrollHorizontally)(absoluteX);
      }

      if (
        activeItemPoistion.value.x < 20 &&
        absoluteX + scrollViewHorizontalOffsetValue.value > 0
      ) {
        runOnJS(scrollHorizontallyToLeft)(absoluteX);
      }

      // for vertical auto scroll
      if (activeItemPoistion.value.y > 750) {
        runOnJS(scrollVerticallyToDown)(absoluteY);
      }

      if (
        activeItemPoistion.value.y < 250 &&
        absoluteX + scrollViewVerticalOffsetValue.value > 0
      ) {
        runOnJS(scrollVerticallyToUp)(absoluteY);
      }

      const row =
        Object.keys(heightOfEachRow).find(
          key =>
            heightOfEachRow[key].y1 <
              activeItemPoistion.value.y +
                scrollViewVerticalOffsetValue.value &&
            heightOfEachRow[key].y2 >
              activeItemPoistion.value.y + scrollViewVerticalOffsetValue.value,
        ) || 0;

      activeItemOverCell.value = {
        row: +row,
        column: Math.floor(
          (activeItemPoistion.value.x + scrollViewHorizontalOffsetValue.value) /
            150,
        ),
      };
    })
    .onFinalize(() => {
      runOnJS(getNewTimestamp)();
      runOnJS(setTitle)(undefined);
    });

  return (
    currentTask && (
      <GestureDetector gesture={PanGesture}>
        <Animated.View
          id={currentTask?.id.toString()}
          style={
            currentTask.id === activeItem.value ? {transform: [{scale: 0}]} : {}
          }>
          <View
            key={currentTask?.id}
            style={{
              width: 100,
              alignItems: 'center',
              backgroundColor: 'red',
            }}>
            <Text>{currentTask?.title}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    )
  );

  function getNewTimestamp() {
    if (!activeItemOverCell.value || !activeItem.value) return;

    const newDate = getWeekDatesData[+activeItemOverCell.value.column];

    const newTimeStamp = newDate
      .plus({hours: activeItemOverCell.value.row})
      .toSeconds();

    let tempData = convertedData;
    let tempObj = convertedData?.collection[activeItem.value];
    if (!tempData || !tempObj) return;
    tempObj = {
      ...tempObj,
      timestamp: newTimeStamp,
      containerId: `${DateTime.fromSeconds(newTimeStamp).day}-${
        DateTime.fromSeconds(newTimeStamp).hour
      }`,
    };

    tempData = {
      ids: tempData.ids,
      collection: {
        ...tempData.collection,
        [activeItem.value]: tempObj,
      },
    };

    setConvertedData(tempData);
    activeItem.value = undefined;
  }

  function scrollHorizontally(absoluteX) {
    horizontalScrolViewRef.current?.scrollTo({
      x: absoluteX + scrollViewHorizontalOffsetValue.value + 100,
      y: 0,
      animated: true,
    });
  }

  function scrollHorizontallyToLeft(absoluteX) {
    horizontalScrolViewRef.current?.scrollTo({
      x:
        absoluteX + scrollViewHorizontalOffsetValue.value - 100 < 0
          ? 0
          : absoluteX + scrollViewHorizontalOffsetValue.value - 100,
      y: 0,
      animated: true,
    });
  }

  function scrollVerticallyToUp(absoluteY) {
    verticalScrolViewRef.current?.scrollTo({
      x: 0,
      y:
        absoluteY + scrollViewVerticalOffsetValue.value - 100 < 0
          ? 0
          : absoluteY + scrollViewVerticalOffsetValue.value - 100,
      animated: true,
    });
  }

  function scrollVerticallyToDown(absoluteY) {
    verticalScrolViewRef.current?.scrollTo({
      x: 0,
      y: absoluteY + scrollViewVerticalOffsetValue.value + 100,
      animated: true,
    });
  }
};

export default EventCard;
