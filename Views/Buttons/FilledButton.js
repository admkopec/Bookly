import {Platform, PlatformColor, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React from 'react';

const FilledButton = ({
  title,
  color = Platform.OS === 'ios' ? PlatformColor('link') : '#0050ff',
  width = 260,
  onPress,
}) => {
  const fontStyle = {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.white,
  };

  const buttonStyle = {
    width: width,
    backgroundColor: color,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 'auto',
  };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={fontStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default FilledButton