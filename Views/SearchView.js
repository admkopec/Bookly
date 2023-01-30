import React, {useContext, useState} from 'react';
import type {Node} from 'react';
import {
  ActionSheetIOS,
  Button, Platform, PlatformColor,
  SafeAreaView,
  StatusBar,
  Text, TextInput,
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
import InlineButton from './Buttons/InlineButton';
import StepperButton from "./Buttons/StepperButton";
import {Picker} from '@react-native-picker/picker';
import {logout} from "../Logic/AccountLogic";

const inputLabelStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginHorizontal: 10,
  marginVertical: 8,
};

const labelStyle = isDarkMode => {
  return {
    fontSize: 15,
    fontWeight: '500',
    color: isDarkMode ? Colors.white : Colors.black,
  };
};

const getTomorrow = () => {
  let today = new Date();
  today.setDate(today.getDate() + 1);
  return today;
}

const AdditionalOptions = ({service, carlyState, parklyState, flatlyState}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [carType, setCarType] = carlyState;
  const [numSpots, setNumSpots] = parklyState;
  const [numAdults, setNumAdults, numKids, setNumKids] = flatlyState;

  const secondaryGroupBoxStyle = {
    flex: 1,
    padding: 12,
    backgroundColor: Platform.OS === 'ios' ? PlatformColor('systemFill') : isDarkMode ? Colors.dark : '#909090',
    marginVertical: 10,
    borderRadius: 8,
  };

  const vStack = {
    flex: 1,
    justifyContent: 'flex-end',
  };

  const carTypeActionSheet = () => {
    const options = ['Cancel', 'cabriolet', 'coupé', 'hatchback', 'limousine', 'minivan', 'pickup', 'sedan', 'roadster'];
    ActionSheetIOS.showActionSheetWithOptions(
        {
          options: options,
          cancelButtonIndex: 0,
          userInterfaceStyle: isDarkMode ? 'dark' : 'light',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // Cancel clicked
            // ...
          } else {
            // Car Type clicked
            setCarType(options[buttonIndex]);
          }
        },
    );
  }

  switch (service) {
    case 'flatly':
      return (
        <View style={secondaryGroupBoxStyle}>
          <View style={[inputLabelStyle, {marginVertical: 0}]}>
            <Text style={[labelStyle(isDarkMode), {marginRight: 35}]}>Guests</Text>
            <View style={vStack}>
              <View style={[inputLabelStyle, {marginRight: 0}]}>
                <Text style={labelStyle(isDarkMode)}>Adults</Text>
                {/* TODO: Add a Stepper */}
                <StepperButton value={numAdults} onValueChanged={setNumAdults} minValue={1} />
              </View>
              <View style={[inputLabelStyle, {marginRight: 0}]}>
                <Text style={labelStyle(isDarkMode)}>Kids</Text>
                {/* TODO: Add a Stepper */}
                <StepperButton value={numKids} onValueChanged={setNumKids} minValue={0} />
              </View>
            </View>
          </View>
        </View>
      );
    case 'carly':
      return (
        <View style={inputLabelStyle}>
          <Text style={labelStyle(isDarkMode)}>Type</Text>
          {/* TODO: Add a Picker */}
          <InlineButton title={carType} onPress={() => {
            if (Platform.OS === 'ios') {
              carTypeActionSheet();
            }
          }} />
        </View>
      );
    case 'parkly':
      return (
        <View style={inputLabelStyle}>
          <Text style={labelStyle(isDarkMode)}>Spots</Text>
          {/* TODO: Add a Stepper */}
          <StepperButton value={numSpots} onValueChanged={setNumSpots} minValue={1} />
        </View>
      );
    default:
      return null;
  }
};

const SearchView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {service, searchCriteria, update} = useContext(SearchContext);
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState(getTomorrow());
  const [dateTo, setDateTo] = useState(getTomorrow());
  const [carType, setCarType] = useState('hatchback');
  const [numSpots, setNumSpots] = useState(1);
  const [numAdults, setNumAdults] = useState(1);
  const [numKids, setNumKids] = useState(0);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const backgroundStyle = {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: Platform.OS === 'ios' ? PlatformColor('systemBackgroundColor') : isDarkMode ? Colors.black : Colors.white,
  };

  const groupBoxStyle = {
    flex: 1,
    padding: 20,
    backgroundColor: Platform.OS === 'ios' ? PlatformColor('secondarySystemBackgroundColor') : isDarkMode ? Colors.darker : Colors.lighter,
    marginTop: 32,
    borderRadius: 8,
  };

  const roundedTextFieldStyle = {
    width: 180,
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: isDarkMode ? Colors.dark : Colors.white,
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: isDarkMode ? '#2a2a2a' : Colors.light,
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
    const criteria = {
      location: location,
      dateFrom: dateFrom,
      dateTo: dateTo,
      // Flatly
      numberOfAdults: selectedIndex === 0 ? numAdults : null,
      numberOfKids: selectedIndex === 0 ? numKids : null,
      // Carly
      carType: selectedIndex === 1 ? carType : null,
      // Parkly
      numberOfSpaces: selectedIndex === 2 ? numSpots : null,
    };
    update(serviceFromIndex(), criteria);
    navigation.navigate('Results');
  };

  return (
    <SafeAreaView style={[backgroundStyle, {marginHorizontal: 0}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                 backgroundColor={backgroundStyle.backgroundColor} />
      <KeyboardAwareScrollView style={backgroundStyle}>
        <View style={{marginVertical: 10}} />
        <SegmentedControl
          values={['Flatly', 'Carly', 'Parkly']}
          selectedIndex={selectedIndex}
          onChange={event => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <View style={groupBoxStyle}>
          <View style={inputLabelStyle}>
            <Text style={labelStyle(isDarkMode)}>Location</Text>
            <TextInput style={roundedTextFieldStyle} placeholder="Warsaw" onChangeText={newText => setLocation(newText)} />
          </View>
          <View style={inputLabelStyle}>
            <Text style={labelStyle(isDarkMode)}>Date From</Text>
            <InlineButton title={dateFrom.toLocaleDateString()} onPress={() => setOpenFrom(true)} />
          </View>
          <View style={inputLabelStyle}>
            <Text style={labelStyle(isDarkMode)}>Date To</Text>
            <InlineButton title={dateTo.toLocaleDateString()} onPress={() => setOpenTo(true)} />
          </View>
          <AdditionalOptions service={serviceFromIndex()}
                             carlyState={[carType, setCarType]}
                             parklyState={[numSpots, setNumSpots]}
                             flatlyState={[numAdults, setNumAdults, numKids, setNumKids]} />
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <FilledButton title="Search" icon="search" onPress={searchButtonClicked} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <DatePicker
        modal
        open={openFrom || openTo}
        date={openFrom ? dateFrom : dateTo}
        minimumDate={openFrom ? getTomorrow() : dateFrom}
        mode={'date'}
        onConfirm={date => {
          if (openFrom) {
            setDateFrom(date);
          } else {
            setDateTo(date);
          }
          setOpenFrom(false);
          setOpenTo(false);
        }}
        onCancel={() => {
          setOpenFrom(false);
          setOpenTo(false);
        }}
      />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const SearchNavigationView: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
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
            headerShadowVisible: true,
            headerLargeTitleShadowVisible: isDarkMode,
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
