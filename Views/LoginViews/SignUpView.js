import React, {createRef} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {Node} from 'react';
import {register} from '../../Logic/AccountLogic';

const SignUpView = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const containerStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };

  const name = createRef();
  const email = createRef();
  const password = createRef();
  const repeatPassword = createRef();

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={containerStyle}>
        <View style={backgroundStyle}>
          <Text>Bookly</Text>
          <TextInput placeholder="Name" />
          <TextInput placeholder="Email" />
          <TextInput placeholder="Password" />
          <TextInput placeholder="Repeat Password" />
          <Button
            title="Sign Up"
            onPress={() => {
              if (password.current.text === repeatPassword.current.text) {
                register(
                  name.current.text,
                  email.current.text,
                  password.current.text,
                ).then(token => {
                  // TODO: Store the received JWT
                });
              }
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const SignUpNavigationView: () => Node = ({onDismiss}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign Up"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => onDismiss()} />
          ),
        }}
        component={SignUpView}
      />
    </Stack.Navigator>
  );
};

export default SignUpNavigationView;
