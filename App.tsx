import React from 'react';
import GridLayout from './src/components/GridLayout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <GridLayout />
    </GestureHandlerRootView>
  );
};

export default App;
