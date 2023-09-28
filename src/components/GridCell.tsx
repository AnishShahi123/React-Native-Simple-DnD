import {View} from 'react-native';
import React from 'react';
import {convertedDataType, id} from '../utils/types';
import EventCard from './EventCard';
import {SharedValue} from 'react-native-reanimated';

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
  scrollViewOffsetValue: SharedValue<number>;
};

export default function GridCell({
  currentCellTasksId,
  convertedData,
  currentGridId,
  activeItem,
  activeItemOverCell,
  activeItemPoistion,
  scrollViewOffsetValue,
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
        // overflow: 'hidden',
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
              scrollViewOffsetValue={scrollViewOffsetValue}
            />
          );
        })}
      </View>
    </View>
  );
}
