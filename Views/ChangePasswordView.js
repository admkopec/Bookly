import React, {useContext, useState} from 'react';
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
import {updateUser, UserContext} from '../Logic/AccountLogic';
import PresentationContext from '../Logic/PresentationContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const ChangePasswordView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, update} = useContext(UserContext);
  const {dismiss} = useContext(PresentationContext);
  const [password, setPassword] = useState();
  const [repeatPassword, setRepeatPassword] = useState();

  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
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
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={containerStyle}>
        <View style={backgroundStyle}>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={newText => setPassword(newText)}
          />
          <TextInput
            placeholder="Repeat Password"
            secureTextEntry={true}
            onChangeText={newText => setRepeatPassword(newText)}
          />
          <TouchableOpacity onPress={() => save()}>
            <Text>Change</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
