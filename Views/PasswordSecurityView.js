import {
  Modal,
  Platform,
  PlatformColor,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PresentationContext from '../Logic/PresentationContext';
import {cellContainer, tableViewStyle} from './Cells/Styles';
import ChangePasswordView from './ChangePasswordView';

const ButtonCell = ({title, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // TODO: Move font styling somewhere
  const body = {
    fontSize: 16,
    textAlign: 'left',
    color: Platform.OS === 'ios' ? PlatformColor('link') : '#0050ff',
  };
  return (
    <TouchableOpacity
      style={[
        cellContainer(isDarkMode),
        {
          marginTop: 32,
        },
      ]}
      onPress={onPress}>
      <Text style={body}>{title}</Text>
    </TouchableOpacity>
  );
};

const PasswordSecurityView = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isPresented, setIsPresented] = useState(false);

  return (
    <SafeAreaView style={[tableViewStyle(isDarkMode), {marginHorizontal: 0}]}>
      <StatusBar
        barStyle={isDarkMode || isPresented ? 'light-content' : 'dark-content'}
        backgroundColor={tableViewStyle(isDarkMode).backgroundColor}
      />
      <ScrollView style={tableViewStyle(isDarkMode)} contentInsetAdjustmentBehavior="automatic">
        <ButtonCell
          title={'Change Password'}
          onPress={() => setIsPresented(true)}
        />
      </ScrollView>
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
            <ChangePasswordView />
          </PresentationContext.Provider>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PasswordSecurityView;
