import React from 'react';
import {DataTable} from 'react-native-paper';
import EventCard from './EventCard';
import {DateTime} from 'luxon';
import {convertedDataType, structuredDataType} from '../utils/types';
import {ScrollView} from 'react-native';

type TableBodyPropsType = {
  getWeekDatesData: DateTime[];
  structuredData: structuredDataType | null;
  convertedData: convertedDataType | null;
};

const TableBody = (props: TableBodyPropsType) => {
  return (
    <ScrollView>
      {Array.from({length: 24}).map((value, index) => {
        return (
          <DataTable.Row key={index}>
            <DataTable.Cell style={{width: 50}}>
              {index.toString().padStart(2, '0').padEnd(5, ':00')}
            </DataTable.Cell>
            {props?.getWeekDatesData?.map(date => {
              const containerId = `${date.day}-${index}`;
              if (!props?.structuredData) return;
              const currentIds = props?.structuredData[containerId];
              return (
                <EventCard
                  key={containerId}
                  currentIds={currentIds}
                  convertedData={props?.convertedData}
                />
              );
            })}
          </DataTable.Row>
        );
      })}
    </ScrollView>
  );
};

export default TableBody;
