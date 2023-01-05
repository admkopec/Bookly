/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchView from "./Views/SearchView";
import BookingsView from "./Views/BookingsView";
import AccountView from "./Views/AccountView";

const Tab = createBottomTabNavigator();

const App: () => Node = () => {
  return (
      <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
              <Tab.Screen name="Search" options={{ headerLargeTitle: true }} component={SearchView}/>
              <Tab.Screen name="Bookings" options={{ headerLargeTitle: true }} component={BookingsView}/>
              <Tab.Screen name="Account" options={{ headerLargeTitle: true }} component={AccountView}/>
          </Tab.Navigator>
      </NavigationContainer>
  );
};

export default App;
