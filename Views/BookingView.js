import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button, Image,
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
    backgroundColor:
      Platform.OS === 'ios'
        ? PlatformColor('systemBackgroundColor')
        : isDarkMode
        ? Colors.black
        : Colors.white,
  };

  const imageStyle = {
    margin: 0,
    //minHeight: 220,
    width: '100%',
  };

  const groupBoxStyle = {
    //flex: 1,
    padding: 20,
    backgroundColor:
      Platform.OS === 'ios'
        ? PlatformColor('secondarySystemBackgroundColor')
        : isDarkMode
        ? Colors.darker
        : Colors.lighter,
    marginTop: 18,
    borderRadius: 8,
  };

  const buttonWrapper = {marginTop: 20, justifyContent: 'center', alignItems: 'center'};

  const title = {
    marginTop: 32,
    fontSize: 22,
    fontWeight: '600',
    color: isDarkMode ? Colors.white : Colors.black,
  };

  const body = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  useEffect(() => {
    // Fetch Offer based on offerId
    fetchOffer(booking.offerId, booking.service)
      .then(e => {
        setOffer(e);
        setIsLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <SafeAreaView style={[containerStyle, {marginHorizontal: 0}]}>
      <View style={containerStyle}>
        {isLoading ? (
          <View style={[groupBoxStyle, {flex: 1, marginTop: 220}]}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator />
            </View>
          </View>
        ) : (
          <View>
            <Image style={imageStyle} source={offer.imageUrl} />
            <Text style={title}>{booking.name}</Text>
            <View style={groupBoxStyle}>
                <Text style={body}>{offer.description}</Text>
                <View style={buttonWrapper}>
                  {booking.id !== null ? (
                    <FilledButton
                      title={'Cancel Booking'}
                      color={
                        Platform.OS === 'ios'
                          ? PlatformColor('systemRed')
                          : '#f00'
                      }
                      onPress={() =>
                        cancelBooking(booking.id).then(() => update()).catch(error => console.log(error))
                      }
                    />
                  ) : (
                    <FilledButton
                      title={'Book'}
                      onPress={() =>
                        createBooking(booking).then(() => dismiss()).catch(error => console.log(error))
                      }
                    />
                  )}
                </View>
            </View>
          </View>
        )}
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
