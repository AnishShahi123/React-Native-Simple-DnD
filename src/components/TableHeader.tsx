import {DateTime} from 'luxon';
import React from 'react';
import {DataTable} from 'react-native-paper';

const TableHeader = ({
  getWeekDatesData,
}: {
  getWeekDatesData: Array<DateTime>;
}) => {
  return (
    <DataTable.Header>
      <DataTable.Title> </DataTable.Title>
      {getWeekDatesData.map(date => {
        return (
          <DataTable.Title key={date.day}>
            {date.toFormat('MM/dd')}
          </DataTable.Title>
        );
      })}
    </DataTable.Header>
  );
};

export default TableHeader;
