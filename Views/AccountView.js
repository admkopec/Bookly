import React, {useContext, useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Platform,
  PlatformColor,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AccountContext,
  fetchUser,
  logout,
  UserContext,
} from '../Logic/AccountLogic';
import Icon from 'react-native-vector-icons/Ionicons';
import NameEmailView from './NameEmailView';
import PasswordSecurityView from './PasswordSecurityView';
import {cellContainer, sectionHeader, tableViewStyle} from './Cells/Styles';

const UserCell = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, update} = useContext(UserContext);
  // TODO: Move font styling somewhere
  const body = {
    fontSize: 15,
    color: isDarkMode ? Colors.white : Colors.black,
  };
  // TODO: Add proper styling
  return user ? (
    <View
      style={[
        cellContainer(isDarkMode),
        {
          marginTop: 22,
          marginBottom: 42,
          padding: 20,
        },
      ]}>
      <Text style={body}>{user.name}</Text>
    </View>
  ) : (
    <ActivityIndicator />
  );
};

const SettingCell = ({title, icon, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // TODO: Move font styling somewhere
  const body = {
    paddingLeft: 10,
    fontSize: 15,
    color: isDarkMode ? Colors.white : Colors.black,
  };
  return (
    <TouchableOpacity
      style={[
        cellContainer(isDarkMode),
        {
          justifyContent: 'space-between',
        },
      ]}
      onPress={onPress}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon name={icon} size={20} color={isDarkMode ? '#fff' : '#000'} />
        <Text style={body}>{title}</Text>
      </View>
      <Icon name={'chevron-forward'} size={20} color={'#a0a0a0'} />
    </TouchableOpacity>
  );
};

const ButtonCell = ({title, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // TODO: Move font styling somewhere
  const body = {
    fontSize: 16,
    textAlign: 'center',
    color: Platform.OS === 'ios' ? PlatformColor('systemRed') : '#f00',
  };
  return (
    <TouchableOpacity
      style={[
        cellContainer(isDarkMode),
        {
          marginTop: 32,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      onPress={onPress}>
      <Text style={body}>{title}</Text>
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

  return (
    <SafeAreaView style={tableViewStyle(isDarkMode)}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={tableViewStyle(isDarkMode).backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <UserCell />
        <Text style={sectionHeader}>settings</Text>
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
        <ButtonCell title={'Sign Out'} onPress={signOutClicked} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const AccountNavigationView: () => Node = () => {
  const [user, setUser] = useState();
  const update = user => {
    setUser(user);
    fetchUser()
      .then(e => setUser(e))
      .catch(error => console.error(error));
  };
  useEffect(() => {
    update();
  }, []);
  return (
    <UserContext.Provider value={{user, update}}>
      <Stack.Navigator>
        <Stack.Screen
          name="Account"
          options={{headerLargeTitle: true}}
          component={AccountView}
        />
        <Stack.Screen
          name="NameEmail"
          options={{headerTitle: 'Name & Email'}}
          component={NameEmailView}
        />
        <Stack.Screen
          name="PasswordSecurity"
          options={{headerTitle: 'Password & Security'}}
          component={PasswordSecurityView}
        />
        <Stack.Screen
          name="Membership"
          options={{headerTitle: 'Membership'}}
          component={View}
        />
      </Stack.Navigator>
    </UserContext.Provider>
  );
};

export default AccountNavigationView;
