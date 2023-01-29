import React from 'react';
import {ActivityIndicator, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {cellContainer} from './Styles';

const NoItemsCell = ({text, isInitialRender = false}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // TODO: Move font styling somewhere
  const title = {
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    color: isDarkMode ? Colors.white : Colors.black,
  };

  return (
    <View
      style={[
        cellContainer(isDarkMode),
        {
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 42,
          padding: 20,
        },
      ]}>
      {isInitialRender ? (
        <ActivityIndicator />
      ) : (
        <Text style={title}>{text}</Text>
      )}
    </View>
  );
};

export default NoItemsCell;
