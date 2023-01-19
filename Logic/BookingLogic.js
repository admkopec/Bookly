import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export const fetchBookings = async () => {
  // TODO: Implement paging
  // Make a GET request to /logic/api/bookings endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings', {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => e.json());
};

export const fetchBooking = async bookingId => {
  // Make a GET request to /logic/api/bookings/{bookingId} endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings/' + bookingId, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => e.json());
};

export const cancelBooking = async bookingId => {
  // Make a DELETE request to /logic/api/bookings/{bookingId} endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings/' + bookingId, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => e.status === 200);
};

export const createBooking = async booking => {
  // Make a PUT/POST request to /logic/api/bookings/{bookingId} endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
    body: JSON.stringify(booking),
  }).then(e => e.json());
};
