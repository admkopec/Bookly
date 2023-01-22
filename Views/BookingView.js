import React from 'react';
import {Button, Platform, PlatformColor, SafeAreaView, useColorScheme, View} from 'react-native';
import PresentationContext from '../Logic/PresentationContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {cancelBooking, createBooking, BookingContext} from '../Logic/BookingLogic';
import FilledButton from './Buttons/FilledButton';

const BookingView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {dismiss} = useContext(PresentationContext);
  const {booking, update} = useContext(BookingContext);

  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      {booking.id !== null ?
        <FilledButton title={'Cancel Booking'} color={Platform.OS === 'ios' ? PlatformColor('systemRed') : '#f00'}
                      onPress={() => cancelBooking(booking.id).then(() => update())} />
        :
        <FilledButton title={'Book'} onPress={() => createBooking(booking).then(() => dismiss())} />
      }
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const BookingNavigationView: () => Node = () => {
  const {dismiss} = useContext(PresentationContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => dismiss()} />
          ),
        }}
        component={BookingView}
      />
    </Stack.Navigator>
  );
};

export default BookingNavigationView;
