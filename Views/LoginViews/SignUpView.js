import React, {createRef, useContext, useState} from 'react';
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
import {AccountContext, register} from '../../Logic/AccountLogic';
import {PresentationContext} from './SelectionView';
import {TouchableOpacity} from 'react-native-gesture-handler';

const SignUpView = () => {
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={containerStyle}>
        <View style={backgroundStyle}>
          <Text>Bookly</Text>
          <TextInput placeholder="Name" onChangeText={newText => setName(newText)} />
          <TextInput placeholder="Email" onChangeText={newText => setEmail(newText)} />
          <TextInput placeholder="Password" onChangeText={newText => setPassword(newText)} />
          <TextInput placeholder="Repeat Password" onChangeText={newText => setRepeatPassword(newText)} />
          <TouchableOpacity
            onPress={() => {
              if (password === repeatPassword) {
                register(
                  name,
                  email,
                  password,
                )
                  .then(() => {
                    // Dismiss the view
                    update();
                    dismiss();
                  })
                  .catch(error => {
                    // TODO: Handle errors
                    console.error(error);
                  });
              }
            }}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const SignUpNavigationView: () => Node = () => {
  const {dismiss} = useContext(PresentationContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign Up"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => dismiss()} />
          ),
        }}
        component={SignUpView}
      />
    </Stack.Navigator>
  );
};

export default SignUpNavigationView;
