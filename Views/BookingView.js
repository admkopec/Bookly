import React from 'react';
import {Button, SafeAreaView, Text, useColorScheme, View} from 'react-native';
import PresentationContext from '../Logic/PresentationContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {cancelBooking} from '../Logic/BookingLogic';
import {BookingContext} from './BookingsView';

const BookingView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {booking, removed} = useContext(BookingContext);

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
      <TouchableOpacity
        onPress={() => cancelBooking(booking.id).then(() => removed())}>
        <Text>Cancel Booking</Text>
      </TouchableOpacity>
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
