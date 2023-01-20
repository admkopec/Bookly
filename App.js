/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useLayoutEffect, useState} from 'react';
import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchView from './Views/SearchView';
import BookingsView from './Views/BookingsView';
import AccountView from './Views/AccountView';
import SelectionView from './Views/LoginViews/SelectionView';
import {AccountContext, getToken} from './Logic/AccountLogic';
import {Platform, Settings, useColorScheme} from 'react-native';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSignedIn, setIsSignedIn] = useState(() => {
    if (Platform.OS === 'ios') {
      const optionalToken = Settings.get('booklyToken');
      return optionalToken !== null && optionalToken !== undefined;
    } else {
      return false;
    }
  });

  const update = async () => {
    const item = await getToken();
    setIsSignedIn(item != null);
  };

  useLayoutEffect(() => {
    update();
  }, []);

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <AccountContext.Provider value={{isSignedIn, update}}>
        {isSignedIn ? (
          <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen
              name="SearchTab"
              options={{
                headerLargeTitle: true,
                tabBarLabel: 'Search',
                tabBarIcon: ({focused, color, size}) => <Icon name="search" size={size} color={color} />,
              }}
              component={SearchView}
            />
            <Tab.Screen
              name="BookingsTab"
              options={{
                headerLargeTitle: true,
                tabBarLabel: 'Bookings',
                tabBarIcon: ({focused, color, size}) => <Icon name="book" size={size} color={color} />,
              }}
              component={BookingsView}
            />
            <Tab.Screen
              name="AccountTab"
              options={{
                headerLargeTitle: true,
                tabBarLabel: 'Account',
                tabBarIcon: ({focused, color, size}) => <Icon name="person-circle" size={size} color={color} />,
              }}
              component={AccountView}
            />
          </Tab.Navigator>
        ) : (
          <SelectionView />
        )}
      </AccountContext.Provider>
    </NavigationContainer>
  );
};

export default App;
