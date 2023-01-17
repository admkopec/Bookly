import React from 'react';
import Config from '../Configs/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AccountContext = React.createContext({
  isSignedIn: null,
  update: () => {},
});

export const getToken = () => {
  return AsyncStorage.getItem('@booklyToken');
};

export const login = (username, password) => {
  // Make a POST request to /authenticate endpoint
  return fetch(Config.booklyUrl + '/authenticate', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then(e => {
      if (e.status !== 200) {
        throw Error('Server Error');
      }
      return e;
    })
    .then(e => e.json())
    .then(response => {
      return response.jwttoken;
    })
    .then(token => AsyncStorage.setItem('@booklyToken', token));
};

export const register = (name, email, password) => {
  // Make a POST request to /logic/api/users endpoint to create a new User
  return fetch(Config.booklyUrl + '/logic/api/users', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  })
    .then(e => {
      if (e.status !== 200) {
        throw Error('Server Error');
      }
      return e;
    })
    .then(_ => login(email, password));
};

export const logout = () => {
  return AsyncStorage.removeItem('@booklyToken');
};

export const fetchUser = async () => {
  // Make a GET request to /logic/api/users endpoint
  return await fetch(Config.booklyUrl + '/logic/api/users', {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => e.json());
};
