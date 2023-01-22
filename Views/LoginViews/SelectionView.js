import React from 'react';
import {
  Button,
  Modal, Platform, PlatformColor,
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
import PresentationContext from '../../Logic/PresentationContext';
import FilledButton from '../Buttons/FilledButton';

const SelectionView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [signInSelected, setSignInSelected] = useState(false);
  const [signUpSelected, setSignUpSelected] = useState(false);

  const containerStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  const titleText = {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 92,
    marginBottom: 62,
    color: isDarkMode ? Colors.white: Colors.black,
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
          <Text style={titleText}>Bookly</Text>
          <FilledButton title="Sign In" width={260} onPress={() => setSignInSelected(true)} />
          <View style={{marginVertical: 15}} />
          <FilledButton title="Sign Up" width={260} color={Platform.OS === 'ios' ? PlatformColor('systemTeal') : '#0af'} onPress={() => setSignUpSelected(true)} />
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
              <></>
            </TouchableWithoutFeedback>
            <PresentationContext.Provider
              value={{
                dismiss: () => {
                  setSignInSelected(false);
                },
              }}>
              <SignInView />
            </PresentationContext.Provider>
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
              <></>
            </TouchableWithoutFeedback>
            <PresentationContext.Provider
              value={{
                dismiss: () => {
                  setSignUpSelected(false);
                },
              }}>
              <SignUpView />
            </PresentationContext.Provider>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default SelectionView;
