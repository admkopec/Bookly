import React from 'react';
import {
  Button,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useState} from 'react';
import SignUpView from './SignUpView';
import SignInView from './SignInView';

const SelectionView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [signInSelected, setSignInSelected] = useState(false);
  const [signUpSelected, setSignUpSelected] = useState(false);

  const containerStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar
        barStyle={
          isDarkMode || signInSelected || signUpSelected
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>Bookly</Text>
          <Button title="Sign In" onPress={() => setSignInSelected(true)} />
          <Button title="Sign Up" onPress={() => setSignUpSelected(true)} />
        </View>
        <Modal
          visible={signInSelected}
          animationType="slide"
          onDismiss={() => console.log('on dismiss')}
          onRequestClose={() => console.log('on dismiss')}
          presentationStyle={'pageSheet'}>
          <View style={{flex: 1}}>
            <TouchableWithoutFeedback
              onPressOut={e => {
                if (e.nativeEvent.locationY > 150) {
                  setSignInSelected(false);
                }
              }}>
              <SignInView onDismiss={() => setSignInSelected(false)} />
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        <Modal
          visible={signUpSelected}
          animationType="slide"
          onDismiss={() => console.log('on dismiss')}
          onRequestClose={() => console.log('on dismiss')}
          presentationStyle={'pageSheet'}>
          <View style={{flex: 1}}>
            <TouchableWithoutFeedback
              onPressOut={e => {
                if (e.nativeEvent.locationY > 150) {
                  setSignUpSelected(false);
                }
              }}>
              <SignUpView onDismiss={() => setSignUpSelected(false)} />
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default SelectionView;
