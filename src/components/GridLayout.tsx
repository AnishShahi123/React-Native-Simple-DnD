import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {convertDataToIdsAndCollection} from '../utils/convertDataToIdAndCollection';
import MOCK_DATA from '../mockData/MOCK_DATA.json';
import {getStructuredData} from '../utils/getStructuredData';
import {convertedDataType, structuredDataType} from '../utils/types';
import {getWeekDates} from '../utils/getWeekDates';
import {DateTime} from 'luxon';
import TableHeader from './TableHeader';
import EventCard from './EventCard';

const GridLayout = () => {
  const [convertedData, setConvertedData] =
    React.useState<null | convertedDataType>(null);
  const [structuredData, setStructuredData] =
    React.useState<null | structuredDataType>(null);
  const [getWeekDatesData, setGetWeekDatesData] = React.useState<
    Array<DateTime>
  >([]);

  React.useEffect(() => {
    async function initialMethods() {
      const {collection, ids} = await convertDataToIdsAndCollection(MOCK_DATA);
      setConvertedData({ids, collection});

      const response = await getStructuredData({ids, collection});
      setStructuredData(response);

      const weekData = await getWeekDates(DateTime.now().toSeconds());
      setGetWeekDatesData(weekData);
    }
    initialMethods();
  }, []);

  React.useEffect(() => {
    async function initialMethods() {
      if (!convertedData) return;
      const response = await getStructuredData(convertedData);
      setStructuredData(response);
    }
    initialMethods();
  }, [convertedData]);
  return (
    <ScrollView>
      <ScrollView horizontal={true}>
        <DataTable>
          <TableHeader getWeekDatesData={getWeekDatesData} />
          {Array.from({length: 24}).map((value, index) => {
            return (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{width: 50}}>
                  {index.toString().padStart(2, '0').padEnd(5, ':00')}
                </DataTable.Cell>
                {getWeekDatesData?.map(date => {
                  const containerId = `${date.day}-${index}`;
                  if (!structuredData) return;
                  const currentIds = structuredData[containerId];
                  return (
                    <EventCard
                      key={containerId}
                      currentIds={currentIds}
                      convertedData={convertedData}
                    />
                  );
                })}
              </DataTable.Row>
            );
          })}
        </DataTable>
      </ScrollView>
    </ScrollView>
  );
};

export default GridLayout;
