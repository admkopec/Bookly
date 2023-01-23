import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {fetchBookings, BookingContext} from '../Logic/BookingLogic';
import PresentationContext from '../Logic/PresentationContext';
import BookingView from './BookingView';
import type {Booking} from '../Logic/BookingLogic';
import NoItemsCell from './Cells/NoItemsCell';
import {cellContainer, sectionHeader, tableViewStyle} from './Cells/Styles';

const SectionHeader: ({title: string}) => Node = ({title}) => {
  return <Text style={sectionHeader}>{title}</Text>;
};

const BookingItem: ({booking: Booking, onPress: () => void}) => Node = ({booking, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // TODO: ¡Implement!
  return (
    <TouchableOpacity style={cellContainer(isDarkMode)} onPress={onPress}>
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

  // Pagination using infinite scrolling: https://javascript.plainenglish.io/react-native-infinite-scroll-pagination-with-flatlist-e5fe5db6c1cb
  const update = () => {
    fetchBookings(page, searchText)
      .then(bookings => {
        // TODO: Support some additional sorting
        let sectionsDraft = isRefreshing ? [] : sections;
        if (searchText.length > 0) {
          // Present search results
          // TODO: Make sure that searching will not preserve previous values when searchTextChanges
          if (sectionsDraft[0].title === '' && page > 1) {
            sectionsDraft[0].data = [...sectionsDraft[0].data, ...bookings];
          } else {
            sectionsDraft = [{title: '', data: bookings}];
          }
        } else {
          // Split bookings based on `dateFrom`
          const upcoming = bookings.filter(e => e.dateFrom > Date());
          const previous = bookings.filter(e => e.dateFrom < Date());
          if (upcoming.length > 0) {
            if (sectionsDraft[0].title === 'upcoming') {
              sectionsDraft[0].data = [...sectionsDraft[0].data, ...upcoming];
            } else {
              sectionsDraft.push({title: 'upcoming', data: upcoming});
            }
          }
          if (previous.length > 0) {
            if (sectionsDraft[0].title === 'previous') {
              sectionsDraft[0].data = [...sectionsDraft[0].data, ...previous];
            } else if (sectionsDraft[1].title === 'previous') {
              sectionsDraft[1].data = [...sectionsDraft[1].data, ...previous];
            } else {
              sectionsDraft.push({title: 'previous', data: previous});
            }
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
        onChangeText: e => {
          setSearchText(e.nativeEvent.text);
          setIsRefreshing(true);
          update();
        },
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
    <SafeAreaView style={tableViewStyle(isDarkMode)}>
      <StatusBar
        barStyle={isDarkMode || selectedBooking !== null ? 'light-content' : 'dark-content'}
        backgroundColor={tableViewStyle(isDarkMode).backgroundColor}
      />
      <SectionList
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
        ListEmptyComponent={<NoItemsCell text={"You haven't made any Bookings yet!"} />}
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
                update: () => {
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

export default BookingsNavigationView;
