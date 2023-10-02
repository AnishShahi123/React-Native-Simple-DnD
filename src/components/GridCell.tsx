import {View} from 'react-native';
import React from 'react';
import {convertedDataType, id} from '../utils/types';
import EventCard from './EventCard';
import {SharedValue} from 'react-native-reanimated';
import {DateTime} from 'luxon';

type PropTypes = {
  currentCellTasksId: id[];
  convertedData: convertedDataType | null;
  currentGridId: string;
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

export default function GridCell({
  currentCellTasksId,
  convertedData,
  // currentGridId,
  activeItem,
  activeItemOverCell,
  activeItemPoistion,
  scrollViewHorizontalOffsetValue,
  heightOfEachRow,
  scrollViewVerticalOffsetValue,
  getWeekDatesData,
  setConvertedData,
  setDataToRender,
  dataToRender,
  setTitle,
}: PropTypes) {
  return (
    <View
      id={currentCellTasksId?.toString()}
      style={{
        borderTopWidth: 1,
        justifyContent: 'center',
        borderRightWidth: 1,
        alignItems: 'center',
        width: 150,
      }}>
      <View style={{gap: 10, paddingVertical: 10}}>
        {currentCellTasksId?.map(currentTaskId => {
          const currentTask = convertedData?.collection[currentTaskId];
          return (
            <EventCard
              activeItemOverCell={activeItemOverCell}
              currentTask={currentTask}
              key={currentTask?.id}
              activeItem={activeItem}
              activeItemPoistion={activeItemPoistion}
              scrollViewHorizontalOffsetValue={scrollViewHorizontalOffsetValue}
              heightOfEachRow={heightOfEachRow}
              scrollViewVerticalOffsetValue={scrollViewVerticalOffsetValue}
              getWeekDatesData={getWeekDatesData}
              setConvertedData={setConvertedData}
              dataToRender={dataToRender}
              setDataToRender={setDataToRender}
              setTitle={setTitle}
            />
          );
        })}
      </View>
    </View>
  );
}
