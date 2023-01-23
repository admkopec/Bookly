import {Platform, PlatformColor, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const FilledButton = ({
  title,
  color = Platform.OS === 'ios' ? PlatformColor('link') : '#0050ff',
  width = 260,
  icon,
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
      {icon ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={16} color={'#fff'} />
          <Text style={fontStyle}>&nbsp;{title}</Text>
        </View>
      ) : (
        <Text style={fontStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FilledButton;
