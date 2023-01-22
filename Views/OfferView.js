import React from 'react';
import {Button, View} from 'react-native';
import PresentationContext from '../Logic/PresentationContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';

// TODO: Maybe merge BookingView and OfferView into a single dual purpose view?
//       As most of the elements will be duplicated…

const Stack = createNativeStackNavigator();
const OfferNavigationView: () => Node = () => {
  const {dismiss} = useContext(PresentationContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => dismiss()} />
          ),
        }}
        component={View}
      />
    </Stack.Navigator>
  );
};

export default OfferNavigationView;
