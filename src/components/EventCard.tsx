import React from 'react';
import {Text, View} from 'react-native';
import {data, id} from '../utils/types';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {SharedValue, runOnJS} from 'react-native-reanimated';

type EventCardPropsType = {
  currentTask: data | undefined;
  setActiveItem: React.Dispatch<React.SetStateAction<id | undefined>>;
  activeItemPoistion: SharedValue<{
    x: number;
    y: number;
  }>;
  setActiveItemOverCell: React.Dispatch<
    React.SetStateAction<
      | {
          row: number;
          column: number;
        }
      | undefined
    >
  >;
  activeItemOverCellPosition: SharedValue<{
    row: number;
    column: number;
  }>;
};

const EventCard = (props: EventCardPropsType) => {
  const {
    currentTask,
    setActiveItem,
    activeItemPoistion,
    activeItemOverCellPosition,
    setActiveItemOverCell,
  } = props;

  const PanGesture = Gesture.Pan()
    .onBegin(({absoluteX, absoluteY}) => {
      runOnJS(setActiveItem)(currentTask?.id);
      activeItemPoistion.value = {
        x: absoluteX,
        y: absoluteY,
      };
      activeItemOverCellPosition.value = {
        row: 0,
        column: Math.floor(activeItemPoistion.value.x / 150),
      };
      console.log(
        `Current Column: ${Math.floor(activeItemPoistion.value.x / 150)}`,
      );
    })
    .onChange(({absoluteX, absoluteY, changeX, changeY}) => {
      activeItemPoistion.value = {
        x: absoluteX + changeX,
        y: absoluteY + changeY,
      };
      activeItemOverCellPosition.value = {
        row: 0,
        column: Math.floor(activeItemPoistion.value.x / 150),
      };
      console.log(
        `New Column: ${Math.floor(activeItemPoistion.value.x / 150)}`,
      );
    })
    .onFinalize(() => {
      runOnJS(setActiveItem)(undefined);

      const newPosition = activeItemPoistion.value;
      console.log(newPosition);
    });

  return (
    currentTask && (
      <GestureDetector gesture={PanGesture}>
        <View id={currentTask?.id.toString()}>
          <View
            key={currentTask?.id}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              width: 120,
              height: 32,
              alignItems: 'center',
              backgroundColor: 'rgba(126, 136, 146, 1)',
              borderRadius: 18,
              justifyContent: 'center',
            }}>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{color: 'white', fontSize: 12}}>
              {currentTask?.title}
            </Text>
          </View>
        </View>
      </GestureDetector>
    )
  );
};

export default EventCard;
