import React from 'react';
import {Text, View} from 'react-native';
import {data, id} from '../utils/types';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {SharedValue} from 'react-native-reanimated';

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
  } = props;

  const PanGesture = Gesture.Pan()
    .onBegin(({absoluteX, absoluteY}) => {
      activeItem.value = currentTask?.id;
      activeItemPoistion.value = {
        x: absoluteX,
        y: absoluteY,
      };

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

      const row =
        Object.keys(heightOfEachRow).find(
          key =>
            heightOfEachRow[key].y1 <
              activeItemPoistion.value.y +
                scrollViewVerticalOffsetValue.value &&
            heightOfEachRow[key].y2 >
              activeItemPoistion.value.y + scrollViewVerticalOffsetValue.value,
        ) || 0;

      console.log(row);
      activeItemOverCell.value = {
        row: +row,
        column: Math.floor(
          (activeItemPoistion.value.x + scrollViewHorizontalOffsetValue.value) /
            150,
        ),
      };
    })

    .onFinalize(() => {
      activeItem.value = undefined;
      console.log(activeItemOverCell.value);
    });

  return (
    currentTask && (
      <GestureDetector gesture={PanGesture}>
        <View id={currentTask?.id.toString()}>
          <View
            key={currentTask?.id}
            style={{
              width: 100,
              alignItems: 'center',
              backgroundColor: 'red',
            }}>
            <Text>{currentTask?.title}</Text>
          </View>
        </View>
      </GestureDetector>
    )
  );
};

export default EventCard;
