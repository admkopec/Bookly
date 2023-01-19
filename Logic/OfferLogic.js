import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export const fetchOffer = async (offerId, service) => {
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
  ).then(e => e.json());
};

export const fetchParklyOffers = async (location, dateFrom, dateTo, numberOfSpaces) => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/parkly endpoint
  return await fetch(
    Config.booklyUrl +
      '/logic/api/offers/parkly/?location=' + location +
      '&dateFrom=' + dateFrom +
      '&dateTo=' + dateTo +
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
  ).then(e => e.json());
};

export const fetchCarlyOffers = async (location, dateFrom, dateTo, carType) => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/carly endpoint
  return await fetch(
      Config.booklyUrl +
      '/logic/api/offers/carly/?location=' + location +
      '&dateFrom=' + dateFrom +
      '&dateTo=' + dateTo +
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
  ).then(e => e.json());
};

export const fetchFlatlyOffers = async (location, dateFrom, dateTo, numberOfAdults, numberOfKids) => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/flatly endpoint
  return await fetch(
      Config.booklyUrl +
      '/logic/api/offers/flatly/?location=' + location +
      '&dateFrom=' + dateFrom +
      '&dateTo=' + dateTo +
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
  ).then(e => e.json());
};
