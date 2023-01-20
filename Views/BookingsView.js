import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
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

const BookingsView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(endReached);
  const [sections, setSections] = useState([]);
  const [searchText, setSearchText] = useState('');

  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };
  // Pagination using infinite scrolling: https://javascript.plainenglish.io/react-native-infinite-scroll-pagination-with-flatlist-e5fe5db6c1cb
  const update = () => {
    fetchBookings(page)
      .then(bookings => {
        // TODO: Support some additional sorting
        // Split bookings based on `dateFrom`
        const upcoming = bookings.filter(e => e.dateFrom > Date());
        const previous = bookings.filter(e => e.dateFrom < Date());
        let sectionsDraft = [];
        if (upcoming.length > 0) {
          sectionsDraft.push({title: 'Upcoming', data: upcoming});
        }
        if (previous.length > 0) {
          sectionsDraft.push({title: 'Previous', data: previous});
        }
        if (bookings.length === 0) {
          setEndReached(true);
        }
        setSections(sectionsDraft);
        setIsMoreLoading(false);
        setIsRefreshing(false);
      })
      .catch(error => {
        setIsMoreLoading(false);
        setIsRefreshing(false);
        console.error(error);
      });
  };

  useEffect(() => {
    update();
  }, [page]);

  useEffect(() => {
      navigation.setOptions({
          headerSearchBarOptions: {
              onChangeText: (e) => setSearchText(e.nativeEvent.text),
          }
      });
  }, [navigation]);

  const renderFooter = title => {
    if (isMoreLoading && title === sections[sections.length - 1].title) {
      return <ActivityIndicator />;
    }
  };

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <SectionList
        style={backgroundStyle}
        sections={sections}
        refreshing={isRefreshing}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => <Text>{item}</Text>}
        renderSectionHeader={({section: {title}}) => <Text>{title}</Text>}
        renderSectionFooter={({section: {title}}) => renderFooter(title)}
        ListEmptyComponent={<Text>You haven't made any Bookings yet!</Text>}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (!endReached) {
            setIsMoreLoading(true);
            setPage(page + 1);
          }
        }}
        onRefresh={() => {
          setIsRefreshing(true);
          update();
        }}
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
