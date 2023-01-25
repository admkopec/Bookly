import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  PlatformColor,
  SafeAreaView,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import PresentationContext from '../Logic/PresentationContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {
  cancelBooking,
  createBooking,
  BookingContext,
} from '../Logic/BookingLogic';
import FilledButton from './Buttons/FilledButton';
import {fetchOffer} from '../Logic/OfferLogic';

const BookingView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {dismiss} = useContext(PresentationContext);
  const {booking, update} = useContext(BookingContext);
  const [offer, setOffer] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const containerStyle = {
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

  useEffect(() => {
    // Fetch Offer based on offerId
    fetchOffer(booking.offerId, booking.service)
      .then(e => {
        setOffer(e);
        setIsLoading(false);
      })
      .catch(error => console.error(error));
  }, [booking]);

  return (
    <SafeAreaView style={[containerStyle, {marginHorizontal: 0}]}>
      <View style={containerStyle}>
        <View style={groupBoxStyle}>
          {isLoading ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              <Text>{booking.name}</Text>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {booking.id !== null ? (
                  <FilledButton
                    title={'Cancel Booking'}
                    color={
                      Platform.OS === 'ios' ? PlatformColor('systemRed') : '#f00'
                    }
                    onPress={() => cancelBooking(booking.id).then(() => update())}
                  />
                ) : (
                  <FilledButton
                    title={'Book'}
                    onPress={() => createBooking(booking).then(() => dismiss())}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </View>
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
          //headerShadowVisible: true,
          //headerLargeTitleShadowVisible: false,
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
