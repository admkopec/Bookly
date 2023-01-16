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
import {login} from '../../Logic/AccountLogic';

const SignInView = ({route, _}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const onSubmit = route.params;
  const containerStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };

  const email = createRef();
  const password = createRef();

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={containerStyle}>
        <View style={backgroundStyle}>
          <Text>Bookly</Text>
          <TextInput ref={email} placeholder="Email" />
          <TextInput ref={password} placeholder="Password" />
          <Button
            title="Sign In"
            onPress={() => {
              login(email.current.text, password.current.text).then(() => {
                // Dismiss the view
                onSubmit();
              });
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const SignInNavigationView: () => Node = ({onDismiss, onSubmit}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign In"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => onDismiss()} />
          ),
        }}
        component={SignInView}
        initialParams={onSubmit}
      />
    </Stack.Navigator>
  );
};

export default SignInNavigationView;
