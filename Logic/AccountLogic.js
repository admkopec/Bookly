import Config from '../Configs/Config';

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
    .then(e => e.json())
    .then(response => response.jwttoken);
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
  }).then(_ => login(email, password));
};
