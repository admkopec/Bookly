import {Platform, PlatformColor, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const StepperButton = ({
  color = Platform.OS === 'ios' ? PlatformColor('systemFill') : '#a0a0a0',
  width = 100,
  value,
  minValue = -Infinity,
  maxValue = Infinity,
  onValueChanged,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [number, setNumber] = useState(value);

  const fontStyle = {
    fontSize: 16,
    textAlign: 'center',
    color: isDarkMode ? Colors.white : Colors.black,
  };

  const secondaryLabel = Platform.OS === 'ios' ? PlatformColor('secondaryLabel') : '#202020';

  const buttonWrapperStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: width,
    backgroundColor: color,
    padding: 5,
    borderRadius: 8,
    margin: 'auto',
  };

  const decrease = () => {
    if (number > minValue) {
      setNumber(number - 1);
    }
  };

  const increase = () => {
    if (number < maxValue) {
      setNumber(number + 1);
    }
  };

  return (
    <View style={buttonWrapperStyle}>
      <TouchableOpacity onPress={decrease}>
        <Icon name="remove" size={22} color={secondaryLabel} />
      </TouchableOpacity>
      <Text style={fontStyle}>{number}</Text>
      <TouchableOpacity onPress={increase}>
        <Icon name="add" size={22} color={secondaryLabel} />
      </TouchableOpacity>
    </View>
  );
};

export default StepperButton;
