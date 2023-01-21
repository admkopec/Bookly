import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {fetchBookings} from '../Logic/BookingLogic';
import PresentationContext from '../Logic/PresentationContext';
import BookingView from './BookingView';
import type {Booking} from '../Logic/BookingLogic';

const NoItemsItem = () => {
  return <Text>You haven't made any Bookings yet!</Text>;
};

const SectionHeader: ({title: string}) => Node = ({title}) => {
  return <Text>{title}</Text>;
};

const BookingItem: ({booking: Booking, onPress: () => void}) => Node = ({
  booking,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{booking}</Text>
    </TouchableOpacity>
  );
};

const BookingsView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(endReached);
  const [sections, setSections] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

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
        // TODO: Support searching
        // TODO: Support some additional sorting
        // Split bookings based on `dateFrom`
        const upcoming = bookings.filter(e => e.dateFrom > Date());
        const previous = bookings.filter(e => e.dateFrom < Date());
        let sectionsDraft = isRefreshing ? [] : sections;
        if (upcoming.length > 0) {
          if (sectionsDraft[0].title === 'Upcoming') {
            sectionsDraft[0].data = [...sectionsDraft[0].data, ...upcoming];
          } else {
            sectionsDraft.push({title: 'Upcoming', data: upcoming});
          }
        }
        if (previous.length > 0) {
          if (sectionsDraft[0].title === 'Previous') {
            sectionsDraft[0].data = [...sectionsDraft[0].data, ...previous];
          } else if (sectionsDraft[1].title === 'Previous') {
            sectionsDraft[0].data = [...sectionsDraft[1].data, ...previous];
          } else {
            sectionsDraft.push({title: 'Previous', data: previous});
          }
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
        onChangeText: e => setSearchText(e.nativeEvent.text),
      },
    });
  }, [navigation]);

  const removeFromSections = (booking: Booking) => {
    let sectionsDraft = sections;
    for (let i = 0; i < sectionsDraft.length; i++) {
      sectionsDraft[i].data = sectionsDraft[i].data.filter(
        e => e.id !== booking.id,
      );
    }
  };

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
        renderItem={({item}) => (
          <BookingItem
            booking={item}
            onPress={() => setSelectedBooking(item)}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <SectionHeader title={title} />
        )}
        renderSectionFooter={({section: {title}}) => renderFooter(title)}
        ListEmptyComponent={<NoItemsItem />}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (!endReached) {
            setIsMoreLoading(true);
            setPage(page + 1);
          }
        }}
        onRefresh={() => {
          setIsRefreshing(true);
          setPage(1);
          update();
        }}
      />
      <Modal
        visible={selectedBooking !== null}
        animationType="slide"
        presentationStyle={'pageSheet'}>
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback
            onPressOut={e => {
              if (e.nativeEvent.locationY > 150) {
                setSelectedBooking(null);
              }
            }}>
            <></>
          </TouchableWithoutFeedback>
          <PresentationContext.Provider
            value={{
              dismiss: () => {
                setSelectedBooking(null);
              },
            }}>
            <BookingContext.Provider
              value={{
                booking: selectedBooking,
                removed: () => {
                  removeFromSections(selectedBooking);
                  setSelectedBooking(null);
                },
              }}>
              <BookingView />
            </BookingContext.Provider>
          </PresentationContext.Provider>
        </View>
      </Modal>
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

export const BookingContext = React.createContext({
  booking: null,
  removed: () => {},
});

export default BookingsNavigationView;
