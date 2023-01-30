import React, {useContext, useState} from 'react';
import {
  Button,
  Platform, PlatformColor,
  SafeAreaView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {Node} from 'react';
import {AccountContext, register} from '../../Logic/AccountLogic';
import PresentationContext from '../../Logic/PresentationContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FilledButton from '../Buttons/FilledButton';

const SignUpView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {isSignedIn, update} = useContext(AccountContext);
  const {dismiss} = useContext(PresentationContext);

  const containerStyle = {
    flex: 1,
    marginHorizontal: 20,
  };

  const backgroundStyle = {
    backgroundColor: Platform.OS === 'ios' ? PlatformColor('systemBackgroundColor') : (isDarkMode ? Colors.darker : Colors.white),
  };

  const textField = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  const titleText = {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 92,
    marginBottom: 62,
    color: isDarkMode ? Colors.white: Colors.black,
  }

  const textFieldContainer = {
    color: isDarkMode ? Colors.white : Colors.black,
    borderTopWidth: 1,
    borderColor: Platform.OS === 'ios' ? PlatformColor('separatorColor') : '#d0d0d0',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 10,
    paddingVertical: 9,
    //marginVertical: 8,
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle, {marginHorizontal: 0}]}>
      <KeyboardAwareScrollView style={containerStyle}>
        <View style={backgroundStyle}>
          <Text style={titleText}>Bookly</Text>
          <View style={textFieldContainer}>
          <TextInput
              style={textField}
              placeholder="Name"
              autoComplete="name"
              textContentType="name"
              onChangeText={newText => setName(newText)} />
          </View>
          <View style={[textFieldContainer, {borderTopWidth: 0}]}>
          <TextInput
              style={textField}
              placeholder="Email"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="username"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={newText => setEmail(newText)} />
          </View>
          <View style={[textFieldContainer, {borderTopWidth: 0}]}>
          <TextInput
              style={textField}
              placeholder="Password"
              autoComplete="new-password"
              textContentType="newPassword"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={newText => setPassword(newText)} />
          </View>
          <View style={[textFieldContainer, {borderTopWidth: 0}]}>
          <TextInput
              style={textField}
              placeholder="Repeat Password"
              autoComplete="new-password"
              textContentType="newPassword"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={newText => setRepeatPassword(newText)} />
          </View>
          <View style={{marginTop: 32, width: '100%', alignItems: 'center'}}>
          <FilledButton
              title={'Sign Up'}
              width={260}
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
            }}/>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
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
