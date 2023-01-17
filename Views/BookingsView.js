import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {fetchBookings} from '../Logic/BookingLogic';

const BookingsView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [sections, setSections] = useState([
    {title: 'Upcoming', data: ['No upcoming Bookings!']},
  ]);

  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  const update = () => {
    fetchBookings()
      .then(bookings => {
        // Split bookings based on `dateFrom`
        const upcoming = bookings.filter(e => e.dateFrom > Date());
        const previous = bookings.filter(e => e.dateFrom < Date());
        let sectionsDraft = [];
        if (upcoming.length > 0) {
          sectionsDraft.push({title: 'Upcoming', data: upcoming});
        } else {
          sectionsDraft.push({
            title: 'Upcoming',
            data: ['No upcoming Bookings!'],
          });
        }
        if (previous.length > 0) {
          sectionsDraft.push({title: 'Previous', data: previous});
        }
        setSections(sectionsDraft);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <SectionList
        style={backgroundStyle}
        sections={sections}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => <Text>{item}</Text>}
        renderSectionHeader={({section: {title}}) => <Text>{title}</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

const Stack = createNativeStackNavigator();
const BookingsNavigationView: () => Node = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bookings"
        options={{headerLargeTitle: true}}
        component={BookingsView}
      />
    </Stack.Navigator>
  );
};

export default BookingsNavigationView;
