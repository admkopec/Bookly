import {
  Platform,
  PlatformColor,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import {UserContext} from '../Logic/AccountLogic';
import {cellContainer, sectionHeader, tableViewStyle} from './Cells/Styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const MembershipView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, update} = useContext(UserContext);
  const vStack = {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  };
  const title = {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: isDarkMode ? Colors.white : Colors.black,
  };
  const subtitle = {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    color: Platform.OS === 'ios' ? PlatformColor('secondaryLabel') : '#a0a0a0',
  };
  return (
    <SafeAreaView style={[tableViewStyle(isDarkMode), {marginHorizontal: 0}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={tableViewStyle(isDarkMode).backgroundColor}
      />
      <ScrollView
        style={tableViewStyle(isDarkMode)}
        contentInsetAdjustmentBehavior="automatic">
        <View style={[cellContainer(isDarkMode), vStack, {marginTop: 32}]}>
          <Icon
            name="star"
            size={67}
            color={
              Platform.OS === 'ios'
                ? PlatformColor('secondaryLabel')
                : '#a0a0a0'
            }
          />
          <Text style={title}>Current Level {user.membershipLevel}</Text>
          <Text style={subtitle}>
            Keep making bookings using Bookly to explore special offers and earn
            rewards
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MembershipView;
