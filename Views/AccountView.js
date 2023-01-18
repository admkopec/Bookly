import React, {useContext, useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AccountContext, fetchUser, logout} from '../Logic/AccountLogic';
import Icon from 'react-native-vector-icons/Ionicons';

const UserCell = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    fetchUser()
      .then(u => setUser(u))
      .catch(error => console.error(error));
  }, []);
  // TODO: Add proper styling
  return user ? (
    <View>
      <Text>{user.name}</Text>
    </View>
  ) : (
    <ActivityIndicator />
  );
};

const SettingCell = ({title, icon, onPress}) => {
  // TODO: Add proper styling
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={icon} size={20} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const AccountView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {isSignedIn, update} = useContext(AccountContext);

  const signOutClicked = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Are you sure?',
          message: 'Signing out will remove all your data from this device.',
          options: ['Cancel', 'Sign Out'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: isDarkMode ? 'dark' : 'light',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // Cancel clicked
            // ...
          } else if (buttonIndex === 1) {
            // Sign Out clicked
            logout().then(() => update());
          }
        },
      );
    } else {
      logout().then(() => update());
    }
  };

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
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <UserCell />
      <Text>Settings</Text>
      <SettingCell
        title={'Name & Email'}
        icon={'person'}
        onPress={() => {
          navigation.navigate('NameEmail');
        }}
      />
      <SettingCell
        title={'Password & Security'}
        icon={'lock-closed'}
        onPress={() => {
          navigation.navigate('PasswordSecurity');
        }}
      />
      <SettingCell
        title={'Membership'}
        icon={'star'}
        onPress={() => {
          navigation.navigate('Membership');
        }}
      />
      <Button title={'Sign Out'} onPress={signOutClicked} />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const AccountNavigationView: () => Node = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        options={{headerLargeTitle: true}}
        component={AccountView}
      />
      <Stack.Screen
        name="NameEmail"
        options={{headerTitle: 'Name & Email'}}
        component={View}
      />
      <Stack.Screen
        name="PasswordSecurity"
        options={{headerTitle: 'Password & Security'}}
        component={View}
      />
      <Stack.Screen
        name="Membership"
        options={{headerTitle: 'Membership'}}
        component={View}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigationView;
