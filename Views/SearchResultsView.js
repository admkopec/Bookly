import React, {useEffect, useState} from 'react';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import PresentationContext from '../Logic/PresentationContext';
import OfferView from './OfferView';
import {fetchParklyOffers} from '../Logic/OfferLogic';
import type {Offer} from '../Logic/OfferLogic';
import NoItemsCell from './Cells/NoItemsCell';
import {cellContainer, sectionHeader} from './Cells/Styles';

const SectionHeader: ({title: string}) => Node = ({title}) => {
  return <Text style={sectionHeader}>{title}</Text>;
};

const OfferItem: ({offer: Offer, onPress: () => void}) => Node = ({
  offer,
  onPress,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity style={cellContainer(isDarkMode)} onPress={onPress}>
      <Text>{offer}</Text>
    </TouchableOpacity>
  );
};

const OffersView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(endReached);
  const [sections, setSections] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const containerStyle = {
    flex: 1,
    marginHorizontal: 20,
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.lighter,
  };
  // Pagination using infinite scrolling: https://javascript.plainenglish.io/react-native-infinite-scroll-pagination-with-flatlist-e5fe5db6c1cb
  const update = () => {
    // FIXME: Use proper params for the search results fetching
    fetchParklyOffers(page)
      .then(offers => {
        // TODO: Support some additional sorting
        let sectionsDraft = isRefreshing ? [] : sections;
        if (offers.length === 0) {
          setEndReached(true);
        } else {
          if (page === 1) {
            sectionsDraft[0] = {title: 'Recommended', data: offers[0]};
            sectionsDraft[1] = {title: '', data: offers.splice(1, -1)};
          } else {
            if (sectionsDraft.length > 1) {
              sectionsDraft[1].data = [...sectionsDraft[1].data, ...offers];
            }
          }
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
          <OfferItem offer={item} onPress={() => setSelectedOffer(item)} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <SectionHeader title={title} />
        )}
        renderSectionFooter={({section: {title}}) => renderFooter(title)}
        ListEmptyComponent={
          <NoItemsCell
            text={"We couldn't find any offers matching the criteria!"}
          />
        }
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
        visible={selectedOffer !== null}
        animationType="slide"
        presentationStyle={'pageSheet'}>
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback
            onPressOut={e => {
              if (e.nativeEvent.locationY > 150) {
                setSelectedOffer(null);
              }
            }}>
            <></>
          </TouchableWithoutFeedback>
          <PresentationContext.Provider
            value={{
              dismiss: () => {
                setSelectedOffer(null);
              },
            }}>
            <OfferView />
          </PresentationContext.Provider>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OffersView;