import {
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {updateUser, UserContext} from '../Logic/AccountLogic';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PresentationContext from '../Logic/PresentationContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const PasswordSecurityView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isPresented, setIsPresented] = useState(false);

  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  return (
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Button title={'Change Password'} onPress={() => setIsPresented(true)} />
      <Modal
        visible={isPresented}
        animationType="slide"
        presentationStyle={'pageSheet'}>
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback
            onPressOut={e => {
              if (e.nativeEvent.locationY > 150) {
                setIsPresented(false);
              }
            }}>
            <></>
          </TouchableWithoutFeedback>
          <PresentationContext.Provider
            value={{
              dismiss: () => {
                setIsPresented(false);
              },
            }}>
            <ChangePasswordNavigationView />
          </PresentationContext.Provider>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
            onChangeText={newText => setPassword(newText)}
          />
          <TextInput
            placeholder="Repeat Password"
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

export default PasswordSecurityView;
