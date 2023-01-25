import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {updateUser, UserContext} from '../Logic/AccountLogic';
import {cellContainer, sectionHeader, tableViewStyle} from './Cells/Styles';
import {Colors} from "react-native/Libraries/NewAppScreen";

const NameEmailView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, update} = useContext(UserContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const saveClicked = () => {
    updateUser(name, email, null)
      .then(e => {
        update(e);
        navigation.goBack();
      })
      .catch(error => console.error(error));
  };

  navigation.setOptions({
    headerRight: () => <Button title="Save" onPress={() => saveClicked()} />,
  });

  return (
    <SafeAreaView style={[tableViewStyle(isDarkMode), {marginHorizontal: 0}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={tableViewStyle(isDarkMode).backgroundColor}
      />
      <ScrollView style={tableViewStyle(isDarkMode)} contentInsetAdjustmentBehavior="automatic">
        <Text
          style={[
            sectionHeader,
            {
              marginTop: 22,
            },
          ]}>
          name
        </Text>
        <View style={cellContainer(isDarkMode)}>
          <TextInput
            style={{color: isDarkMode ? Colors.white : Colors.black, width: '100%'}}
            placeholder={'Name'}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <Text
          style={[
            sectionHeader,
            {
              marginTop: 12,
            },
          ]}>
          email
        </Text>
        <View style={cellContainer(isDarkMode)}>
          <TextInput
            style={{color: isDarkMode ? Colors.white : Colors.black, width: '100%'}}
            placeholder={'email@example.com'}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NameEmailView;
