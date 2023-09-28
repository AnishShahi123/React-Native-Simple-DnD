import React from 'react';
import {Text, View} from 'react-native';
import {data, id} from '../utils/types';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';

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
  activeItem: id | undefined;
};

const EventCard = (props: EventCardPropsType) => {
  const {
    currentTask,
    setActiveItem,
    activeItemPoistion,
    activeItemOverCellPosition,
    setActiveItemOverCell,
    activeItem,
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
    });

  const isDragging = currentTask?.id === activeItem;

  //cardStyle for individuals card when dragged
  const cardStyle = useAnimatedStyle(() => {
    if (isDragging) {
      return {
        transform: [
          {translateX: activeItemPoistion.value.x},
          {translateY: activeItemPoistion.value.y},
        ],
        position: 'absolute',
      };
    }
    return {};
  });

  return (
    currentTask && (
      <GestureDetector gesture={PanGesture}>
        <Animated.View id={currentTask?.id.toString()} style={[cardStyle]}>
          <View
            key={currentTask?.id}
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                flexDirection: 'row',
                width: 120,
                height: 32,
                alignItems: 'center',
                backgroundColor: 'rgba(126, 136, 146, 1)',
                borderRadius: 18,
                justifyContent: 'center',
              },
            ]}>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{color: 'white', fontSize: 12}}>
              {currentTask?.title}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    )
  );
};

export default EventCard;
