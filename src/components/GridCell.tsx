import {View} from 'react-native';
import React from 'react';
import {convertedDataType, id} from '../utils/types';
import EventCard from './EventCard';
import {SharedValue} from 'react-native-reanimated';

type PropTypes = {
  currentCellTasksId: id[];
  convertedData: convertedDataType | null;
  currentGridId: string;
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

export default function GridCell({
  currentCellTasksId,
  convertedData,
  // currentGridId,
  setActiveItemOverCell,
  setActiveItem,
  activeItemPoistion,
  activeItemOverCellPosition,
  activeItem,
}: PropTypes) {
  return (
    <View
      id={currentCellTasksId?.toString()}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderTopWidth: 1,
        justifyContent: 'center',
        borderRightWidth: 1,
        alignItems: 'center',
        width: 150,
        // overflow: 'hidden',
      }}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{gap: 10, paddingVertical: 10}}>
        {currentCellTasksId?.map(currentTaskId => {
          const currentTask = convertedData?.collection[currentTaskId];
          return (
            <EventCard
              activeItem={activeItem}
              setActiveItemOverCell={setActiveItemOverCell}
              activeItemOverCellPosition={activeItemOverCellPosition}
              currentTask={currentTask}
              key={currentTask?.id}
              setActiveItem={setActiveItem}
              activeItemPoistion={activeItemPoistion}
            />
          );
        })}
      </View>
    </View>
  );
}
