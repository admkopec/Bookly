import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Platform, PlatformColor} from 'react-native';

export const cellContainer = (isDarkMode: boolean) => {
  return {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Platform.OS === 'ios' ? PlatformColor('secondarySystemGroupedBackgroundColor') : (isDarkMode ? Colors.darker : Colors.white),
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

export const tableViewStyle = (isDarkMode: boolean) => {
  return {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: isDarkMode ? Colors.black : Colors.lighter,
    //backgroundColor: Platform.OS === 'ios' ? PlatformColor('systemGroupedBackgroundColor') : (isDarkMode ? Colors.black : Colors.lighter),
  };
};
