import React, {createRef, useContext, useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {Node} from 'react';
import {AccountContext, login} from '../../Logic/AccountLogic';
import {PresentationContext} from "./SelectionView";

const SignInView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {isSignedIn, update} = useContext(AccountContext);
  const {dismiss} = useContext(PresentationContext);
  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={containerStyle}>
        <View style={backgroundStyle}>
          <Text>Bookly</Text>
          <TextInput
            placeholder="Email"
            onChangeText={newText => setEmail(newText)}
          />
          <TextInput
            placeholder="Password"
            onChangeText={newText => setPassword(newText)}
          />
          <TouchableOpacity
            onPress={() => {
              login(email, password)
                .then(() => {
                  // Dismiss the view
                  update();
                  dismiss();
                })
                .catch(error => {
                  // TODO: Handle errors
                  console.error(error);
                });
            }}>
            <Text>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const SignInNavigationView: () => Node = () => {
  const {dismiss} = useContext(PresentationContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign In"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => dismiss()} />
          ),
        }}
        component={SignInView}
      />
    </Stack.Navigator>
  );
};

export default SignInNavigationView;
