import React from 'react';
import {Text, View} from 'react-native';
import {convertedDataType, data, id} from '../utils/types';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {SharedValue, runOnJS} from 'react-native-reanimated';
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
  setDataToRender: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        timestamp: number;
        title: string;
      }[]
    >
  >;
  dataToRender: {
    id: number;
    timestamp: number;
    title: string;
  }[];
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
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
    setDataToRender,
    dataToRender,
    setTitle,
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
      console.log(activeItem.value);
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

  function getNewTimestamp() {
    if (!activeItemOverCell.value || !activeItem.value) return;
    console.log(getWeekDatesData);
    const newDate = getWeekDatesData[+activeItemOverCell.value.column];

    const newTimeStamp = newDate
      .plus({hours: activeItemOverCell.value.row})
      .toSeconds();

    const newData = dataToRender.map(data => {
      if (data.id !== activeItem.value) {
        return data;
      } else {
        return {
          ...data,
          timestamp: newTimeStamp,
        };
      }
    });

    setDataToRender(newData);

    convertDataToIdsAndCollection(newData).then(({ids, collection}) => {
      setConvertedData({ids, collection});
    });
    activeItem.value = undefined;
  }
};

export default EventCard;
