import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export type Offer = {
    id: string,
    // ...
};

export const fetchOffer = async (offerId: string, service: string): Promise<Offer> => {
  // Make a GET request to /logic/api/offers/{offerId} endpoint
  return await fetch(
    Config.booklyUrl + '/logic/api/offers/' + service + '/' + offerId,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    },
  ).then(e => {
      if (e.status !== 200) {
          throw Error('Network error');
      }
      return e.json();
  });
};

export const fetchParklyOffers = async (location: string, dateFrom: Date, dateTo: Date, numberOfSpaces: number): Promise<[Offer]> => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/parkly endpoint
  return await fetch(
    Config.booklyUrl +
      '/logic/api/offers/parkly/?location=' + location +
      '&dateFrom=' + Math.floor(dateFrom.getTime() / 1000) +
      '&dateTo=' + Math.floor(dateTo.getTime() / 1000) +
      '&numberOfSpaces=' + numberOfSpaces,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    },
  ).then(e => {
      if (e.status === 404) {
          return [];
      }
      if (e.status !== 200) {
          throw Error('Network error');
      }
      return e.json();
  });
};

export const fetchCarlyOffers = async (location: string, dateFrom: Date, dateTo: Date, carType): Promise<[Offer]> => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/carly endpoint
  return await fetch(
      Config.booklyUrl +
      '/logic/api/offers/carly/?location=' + location +
      '&dateFrom=' + Math.floor(dateFrom.getTime() / 1000) +
      '&dateTo=' + Math.floor(dateTo.getTime() / 1000) +
      '&carType=' + carType,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
  ).then(e => {
      if (e.status === 404) {
          return [];
      }
      if (e.status !== 200) {
          throw Error('Network error');
      }
      return e.json();
  });
};

export const fetchFlatlyOffers = async (location: string, dateFrom: Date, dateTo: Date, numberOfAdults: number, numberOfKids: number): Promise<[Offer]> => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/flatly endpoint
  return await fetch(
      Config.booklyUrl +
      '/logic/api/offers/flatly/?location=' + location +
      '&dateFrom=' + Math.floor(dateFrom.getTime() / 1000) +
      '&dateTo=' + Math.floor(dateTo.getTime() / 1000) +
      '&numberOfAdults=' + numberOfAdults +
      '&numberOfKids=' + numberOfKids,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
  ).then(e => {
      if (e.status === 404) {
          return [];
      }
      if (e.status !== 200) {
          throw Error('Network error');
      }
      return e.json();
  });
};
