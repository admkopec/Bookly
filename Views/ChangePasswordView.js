import React, {useContext, useState} from 'react';
import {
  Button,
  Platform,
  PlatformColor,
  SafeAreaView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {updateUser, UserContext} from '../Logic/AccountLogic';
import PresentationContext from '../Logic/PresentationContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FilledButton from './Buttons/FilledButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const ChangePasswordView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, update} = useContext(UserContext);
  const {dismiss} = useContext(PresentationContext);
  const [password, setPassword] = useState();
  const [repeatPassword, setRepeatPassword] = useState();

  const containerStyle = {
    flex: 1,
    marginHorizontal: 20,
  };

  const backgroundStyle = {
    backgroundColor: Platform.OS === 'ios' ? PlatformColor('systemBackgroundColor') : (isDarkMode ? Colors.darker : Colors.white),
  };

  const textFieldContainer = {
    borderTopWidth: 1,
    borderColor:
      Platform.OS === 'ios' ? PlatformColor('separatorColor') : '#d0d0d0',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginVertical: 8,
  };

  const save = () => {
    if (password !== repeatPassword || !password) {
      return;
    }
    updateUser(null, null, password)
      .then(e => {
        update(e);
        dismiss();
      })
      .catch(error => console.error(error));
  };

  return (
    <SafeAreaView
      style={[backgroundStyle, containerStyle, {marginHorizontal: 0}]}>
      <KeyboardAwareScrollView>
        <View style={{marginTop: 62}}>
          <View style={textFieldContainer}>
            <TextInput
              style={{width: '100%'}}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={newText => setPassword(newText)}
            />
          </View>
          <View style={textFieldContainer}>
            <TextInput
              style={{width: '100%'}}
              placeholder="Repeat Password"
              secureTextEntry={true}
              onChangeText={newText => setRepeatPassword(newText)}
            />
          </View>
          <View style={{marginTop: 23, width: '100%', alignItems: 'center'}}>
            <FilledButton title={'Change'} width={260} onPress={() => save()} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const ChangePasswordNavigationView: () => Node = () => {
  const {dismiss} = useContext(PresentationContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Change Password"
        options={{
          headerRight: () => (
            <Button title="Cancel" onPress={() => dismiss()} />
          ),
        }}
        component={ChangePasswordView}
      />
    </Stack.Navigator>
  );
};

export default ChangePasswordNavigationView;
