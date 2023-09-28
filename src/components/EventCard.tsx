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
};

const EventCard = (props: EventCardPropsType) => {
  const {
    currentTask,
    setActiveItem,
    activeItemPoistion,
    setActiveItemOverCell,
  } = props;

  const PanGesture = Gesture.Pan()
    .onBegin(({absoluteX, absoluteY}) => {
      runOnJS(setActiveItem)(currentTask?.id);
      activeItemPoistion.value = {
        x: absoluteX,
        y: absoluteY,
      };

      runOnJS(setActiveItemOverCell)(() => {
        return {
          row: 0,
          column: Math.floor(activeItemPoistion.value.x / 200),
        };
      });
    })
    .onChange(({absoluteX, absoluteY, changeX, changeY}) => {
      activeItemPoistion.value = {
        x: absoluteX + changeX,
        y: absoluteY + changeY,
      };

      runOnJS(setActiveItemOverCell)(() => {
        return {
          row: 0,
          column: Math.floor(activeItemPoistion.value.x / 200),
        };
      });
    })
    .onFinalize(() => {
      runOnJS(setActiveItem)(undefined);
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
