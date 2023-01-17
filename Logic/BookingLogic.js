import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export const fetchBookings = () => {
  // Make a GET request to /logic/api/bookings endpoint
  return fetch(Config.booklyUrl + '/logic/api/bookings', {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
  }).then(e => e.json());
};

export const fetchBooking = bookingId => {
  // Make a GET request to /logic/api/bookings/{bookingId} endpoint
  return fetch(Config.booklyUrl + '/logic/api/bookings' + bookingId, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
  }).then(e => e.json());
};

export const cancelBooking = bookingId => {
  // Make a DELETE request to /logic/api/bookings/{bookingId} endpoint
  return fetch(Config.booklyUrl + '/logic/api/bookings' + bookingId, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
  }).then(e => e.status === 200);
};

export const createBooking = booking => {
  // Make a PUT/POST request to /logic/api/bookings/{bookingId} endpoint
  return fetch(Config.booklyUrl + '/logic/api/bookings', {
    method: 'PUT', // 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
    body: JSON.stringify(booking),
  }).then(e => e.json());
};
