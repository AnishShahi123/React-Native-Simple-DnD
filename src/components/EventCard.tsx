import React from 'react';
import {Text, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {convertedDataType, id} from '../utils/types';

type EventCardPropsType = {
  currentIds: id[];
  convertedData: convertedDataType | null;
};

const EventCard = (props: EventCardPropsType) => {
  return (
    <>
      <DataTable.Cell style={{width: 200}}>
        <View style={{gap: 10}}>
          {props?.currentIds?.map(ids => {
            const currentData = props?.convertedData?.collection[ids];
            return (
              <View key={ids} style={{borderWidth: 1, padding: 10}}>
                <Text>{currentData?.title.slice(0, 25)}</Text>
              </View>
            );
          })}
        </View>
      </DataTable.Cell>
    </>
  );
};

export default EventCard;
