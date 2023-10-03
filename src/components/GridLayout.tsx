import React, {useRef} from 'react';
import {convertDataToIdsAndCollection} from '../utils/convertDataToIdAndCollection';
import MOCK_DATA from '../mockData/MOCK_DATA.json';
import {getStructuredData} from '../utils/getStructuredData';
import {convertedDataType, id, structuredDataType} from '../utils/types';
import {getWeekDates} from '../utils/getWeekDates';
import {DateTime} from 'luxon';
import {ScrollView, Text, View} from 'react-native';
import GridCell from './GridCell';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

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
  const activeItem = useSharedValue<undefined | id>(undefined);

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

  const activeItemOverCell = useSharedValue<
    | undefined
    | {
        row: number;
        column: number;
      }
  >(undefined);

  const scrollViewHorizontalOffsetValue = useSharedValue(0);
  const scrollViewVerticalOffsetValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: activeItemPoistion.value.x},
        {translateY: activeItemPoistion.value.y},
      ],
      position: 'absolute',
    };
  });

  // React.useEffect(() => {
  //   console.log(activeItem.value);
  // }, [activeItem.value]);

  const [title, setTitle] = React.useState<string | undefined>(undefined);

  const horizontalScrolViewRef = useRef<ScrollView | null>(null);
  const verticalScrolViewRef = useRef<ScrollView | null>(null);

  const heightOfScrollView = useSharedValue(0);

  return (
    structuredData && (
      <>
        {title && (
          <Animated.View style={[animatedStyle, {zIndex: 100}]}>
            <View style={{backgroundColor: 'red', width: 150}}>
              <Text>{title}</Text>
            </View>
            {/* <EventCard
              activeItem={activeItem}
              activeItemOverCell={activeItemOverCell}
              currentTask={convertedData?.collection[activeItem.value]}
              activeItemPoistion={activeItemPoistion}
              scrollViewHorizontalOffsetValue={scrollViewHorizontalOffsetValue}
              heightOfEachRow={heightOfEachRow}
              scrollViewVerticalOffsetValue={scrollViewVerticalOffsetValue}
              getWeekDatesData={getWeekDatesData}
              setConvertedData={setConvertedData}
              dataToRender={dataToRender}
              setDataToRender={setDataToRender}
            /> */}
          </Animated.View>
        )}
        <ScrollView
          horizontal
          onScroll={event => {
            scrollViewHorizontalOffsetValue.value =
              event.nativeEvent.contentOffset.x;
          }}
          ref={horizontalScrolViewRef}>
          <ScrollView
            ref={verticalScrolViewRef}
            onLayout={({nativeEvent}) => {
              heightOfScrollView.value = nativeEvent.layout.height;
            }}
            onScroll={event => {
              scrollViewVerticalOffsetValue.value =
                event.nativeEvent.contentOffset.y;
            }}>
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
                        activeItemOverCell={activeItemOverCell}
                        key={currentGridId}
                        currentCellTasksId={currentCellTasksId}
                        convertedData={convertedData}
                        currentGridId={currentGridId}
                        activeItemPoistion={activeItemPoistion}
                        activeItem={activeItem}
                        scrollViewHorizontalOffsetValue={
                          scrollViewHorizontalOffsetValue
                        }
                        heightOfEachRow={heightOfEachRow}
                        scrollViewVerticalOffsetValue={
                          scrollViewVerticalOffsetValue
                        }
                        getWeekDatesData={getWeekDatesData}
                        setConvertedData={setConvertedData}
                        setTitle={setTitle}
                        horizontalScrolViewRef={horizontalScrolViewRef}
                        verticalScrolViewRef={verticalScrolViewRef}
                        heightOfScrollView={heightOfScrollView}
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
