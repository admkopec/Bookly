import React from 'react';
import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export type Booking = {
  id: string,
  name: string,
  dateFrom: number,
  dateTo: number,
  offerId: string,
  service: string,
  // ...
};

export const BookingContext = React.createContext({
  booking: null,
  update: () => {},
});

export const fetchBookings = async (page: number, searchQuery: string): Promise<[Booking]> => {
  // TODO: Implement additional paging parameters
  // Make a GET request to /logic/api/bookings endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings?page=' + page + (searchQuery.length > 0 ? ('&search=' + searchQuery) : ''), {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => {
    if (e.status === 404) {
      return [];
    }
    if (e.status !== 200) {
      throw Error('Network error');
    }
    return e.json();
  });
};

export const fetchBooking = async (bookingId: string): Promise<Booking> => {
  // Make a GET request to /logic/api/bookings/{bookingId} endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings/' + bookingId, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => {
    if (e.status !== 200) {
      throw Error('Network error');
    }
    return e.json();
  });
};

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
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

export const createBooking = async (booking: Booking): Promise<Booking> => {
  // Make a PUT/POST request to /logic/api/bookings/{bookingId} endpoint
  return await fetch(Config.booklyUrl + '/logic/api/bookings?service=' + booking.service, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
    body: JSON.stringify(booking),
  }).then(e => {
    if (e.status !== 200 || e.status !== 201) {
      throw Error('Network error');
    }
    return e.json();
  });
};
