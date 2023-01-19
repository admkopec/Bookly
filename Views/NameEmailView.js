import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {updateUser, UserContext} from '../Logic/AccountLogic';

const NameEmailView = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, update} = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const containerStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

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
    <SafeAreaView style={[backgroundStyle, containerStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text>Name</Text>
      <TextInput
        placeholder={'Name'}
        value={name}
        onChangeText={text => setName(text)}
      />
      <Text>Email</Text>
      <TextInput
        placeholder={'email@example.com'}
        value={email}
        onChangeText={text => setEmail(text)}
      />
    </SafeAreaView>
  );
};

export default NameEmailView;
