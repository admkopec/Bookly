import React, {useContext, useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SearchResultsView from './SearchResultsView';
import FilledButton from './Buttons/FilledButton';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const SearchView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {service, searchCriteria, update} = useContext(SearchContext);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const backgroundStyle = {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  const groupBoxStyle = {
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    marginTop: 32,
    borderRadius: 8,
  };

  const serviceFromIndex = () => {
    switch (selectedIndex) {
      case 0:
        return 'flatly';
      case 1:
        return 'carly';
      case 2:
        return 'parkly';
      default:
        return null;
    }
  };

  const searchButtonClicked = () => {
    // TODO: ¡Implement!
    update(serviceFromIndex(), {
      location: '',
      dateFrom: date,
      dateTo: date,
      // ...
    });
    navigation.navigate('Results');
  };

  return (
    <SafeAreaView style={[backgroundStyle, {marginHorizontal: 0}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <KeyboardAwareScrollView style={backgroundStyle}>
        <View style={{marginVertical: 15}} />
        <SegmentedControl
          values={['Flatly', 'Carly', 'Parkly']}
          selectedIndex={selectedIndex}
          onChange={event => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <View style={groupBoxStyle}>
          <Button title="Open" onPress={() => setOpen(true)} />
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FilledButton
              title="Search"
              icon="search"
              onPress={searchButtonClicked}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const SearchNavigationView: () => Node = () => {
  const [service, setService] = useState('flatly');
  const [searchCriteria, setSearchCriteria] = useState(null);
  const update = (service, searchCriteria) => {
    setService(service);
    setSearchCriteria(searchCriteria);
  };
  return (
    <SearchContext.Provider value={{service, searchCriteria, update}}>
      <Stack.Navigator>
        <Stack.Screen
          name="Bookly"
          options={{
            headerLargeTitle: true,
          }}
          component={SearchView}
        />
        <Stack.Screen
          name="Results"
          options={{
            headerLargeTitle: true,
          }}
          component={SearchResultsView}
        />
      </Stack.Navigator>
    </SearchContext.Provider>
  );
};

export const SearchContext = React.createContext({
  service: 'flatly',
  searchCriteria: null,
  update: () => {},
});

export default SearchNavigationView;
