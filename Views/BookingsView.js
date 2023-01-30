import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  Modal, Platform, PlatformColor,
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
import {Colors} from "react-native/Libraries/NewAppScreen";

const SectionHeader: ({title: string}) => Node = ({title}) => {
  return <Text style={[sectionHeader, {marginTop: 22}]}>{title}</Text>;
};

const BookingItem: ({booking: Booking, onPress: () => void}) => Node = ({booking, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const vStack = {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  };
  const title = {
    fontSize: 15,
    fontWeight: '600',
    color: isDarkMode ? Colors.white : Colors.black,
  };
  const subtitle = {
    fontSize: 13,
    color: Platform.OS === 'ios' ? PlatformColor('secondaryLabel') : '#a0a0a0',
  };
  return (
    <TouchableOpacity style={cellContainer(isDarkMode)} onPress={onPress}>
      <View style={vStack}>
        <Text style={title}>{booking.name}</Text>
        <Text style={subtitle}>{new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BookingsView = ({route, navigation}) => {
  // TODO: WHY `useState` doesn't UPDATE values!!!!!!
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
        let sectionsDraft = isMoreLoading ? sections : [];
        if (searchText.length > 0) {
          // Present search results
          // TODO: Make sure that searching will not preserve previous values when searchTextChanges
          if (sectionsDraft[0] && sectionsDraft[0].title === '' && page > 1) {
            sectionsDraft[0].data = [...sectionsDraft[0].data, ...bookings];
          } else {
            sectionsDraft = [{title: '', data: bookings}];
          }
        } else {
          // Split bookings based on `dateFrom`
          const upcoming = bookings.filter(e => e.dateFrom > (new Date().getTime()/1000));
          const previous = bookings.filter(e => e.dateFrom < (new Date().getTime()/1000));
          if (upcoming.length > 0) {
            if (sectionsDraft[0] && sectionsDraft[0].title === 'upcoming') {
              sectionsDraft[0].data = [...sectionsDraft[0].data, ...upcoming];
            } else {
              sectionsDraft.push({title: 'upcoming', data: upcoming});
            }
          }
          if (previous.length > 0) {
            if (sectionsDraft[0] && sectionsDraft[0].title === 'previous') {
              sectionsDraft[0].data = [...sectionsDraft[0].data, ...previous];
            } else if (sectionsDraft[1].title === 'previous') {
              sectionsDraft[1].data = [...sectionsDraft[1].data, ...previous];
            } else {
              sectionsDraft.push({title: 'previous', data: previous});
            }
          }
        }
        if (bookings.length === 0 || bookings.length < 30) {
          setEndReached(true);
        }
        setSections(sectionsDraft);
        setIsMoreLoading(false);
        setIsRefreshing(false);
        setIsInitialRender(false);
      })
      .catch(error => {
        setIsMoreLoading(false);
        setIsRefreshing(false);
        setIsInitialRender(false);
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
          setIsRefreshing(true);
          setSearchText(e.nativeEvent.text);
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
    <SafeAreaView style={[tableViewStyle(isDarkMode), {marginHorizontal: 0}]}>
      <StatusBar
        barStyle={(isDarkMode || selectedBooking !== null) ? 'light-content' : 'dark-content'}
        backgroundColor={tableViewStyle(isDarkMode).backgroundColor}
      />
      <SectionList
        style={tableViewStyle(isDarkMode)}
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
        ListEmptyComponent={<NoItemsCell text={"You haven't made any Bookings yet!"} isInitialRender={isInitialRender} />}
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
