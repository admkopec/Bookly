import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Platform, PlatformColor} from 'react-native';

export const cellContainer = (isDarkMode: boolean) => {
  return {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    color: isDarkMode ? Colors.white : Colors.black,
  };
};

export const sectionHeader = {
  paddingLeft: 12,
  fontSize: 14,
  fontWeight: '500',
  fontVariant: ['small-caps'],
  color: Platform.OS === 'ios' ? PlatformColor('secondaryLabel') : '#a0a0a0',
};
