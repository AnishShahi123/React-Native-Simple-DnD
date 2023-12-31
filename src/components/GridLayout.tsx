import React from 'react';
import {convertDataToIdsAndCollection} from '../utils/convertDataToIdAndCollection';
import MOCK_DATA from '../mockData/MOCK_DATA.json';
import {getStructuredData} from '../utils/getStructuredData';
import {convertedDataType, id, structuredDataType} from '../utils/types';
import {getWeekDates} from '../utils/getWeekDates';
import {DateTime} from 'luxon';
import {ScrollView, View} from 'react-native';
import GridCell from './GridCell';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
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

  //active item contains the id of the task which is being dragged
  const [activeItem, setActiveItem] = React.useState<undefined | id>(undefined);

  const [heightOfEachRow, setHeightOfEachRow] = React.useState<{
    [key: string]: {
      y1: number;
      y2: number;
    };
  }>({});

  const activeItemPoistion = useSharedValue({
    x: 0,
    y: 0,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: activeItemPoistion.value.x},
        {translateY: activeItemPoistion.value.y},
      ],
      position: 'absolute',
    };
  });

  React.useEffect(() => {
    console.log(activeItem);
  }, [activeItem]);

  //For Column
  const [activeItemOverCell, setActiveItemOverCell] = React.useState<
    | undefined
    | {
        row: number;
        column: number;
      }
  >(undefined);

  const activeItemOverCellPosition = useSharedValue({
    row: 0,
    column: 0,
  });

  return (
    structuredData && (
      <>
        {/* {activeItem && (
          <Animated.View style={[animatedStyle, {zIndex: 100}]}>
            <EventCard
              activeItem={activeItem}
              setActiveItemOverCell={setActiveItemOverCell}
              activeItemOverCellPosition={activeItemOverCellPosition}
              currentTask={convertedData?.collection[activeItem]}
              setActiveItem={setActiveItem}
              activeItemPoistion={activeItemPoistion}
            />
          </Animated.View>
        )} */}
        <ScrollView horizontal>
          <ScrollView>
            {Array.from({length: 10}).map((item, index) => {
              return (
                <View
                  style={{flexDirection: 'row'}}
                  key={index}
                  onLayout={({nativeEvent}) => {
                    const y1 = nativeEvent.layout.y;
                    const y2 = nativeEvent.layout.y + nativeEvent.layout.height;
                    setHeightOfEachRow(oldState => {
                      return {
                        ...oldState,
                        [index]: {
                          y1,
                          y2,
                        },
                      };
                    });
                  }}>
                  {getWeekDatesData.map(date => {
                    const currentGridId = `${date.day}-${index}`;
                    const currentCellTasksId = structuredData[currentGridId];
                    return (
                      <GridCell
                        activeItem={activeItem}
                        setActiveItemOverCell={setActiveItemOverCell}
                        activeItemOverCellPosition={activeItemOverCellPosition}
                        setActiveItem={setActiveItem}
                        key={currentGridId}
                        currentCellTasksId={currentCellTasksId}
                        convertedData={convertedData}
                        currentGridId={currentGridId}
                        activeItemPoistion={activeItemPoistion}
                      />
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </ScrollView>
      </>
    )
  );
};

export default GridLayout;
