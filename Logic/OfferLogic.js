import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export type OfferSearchCriteria = {
    // Base criteria
    location: string,
    dateFrom: Date,
    dateTo: Date,
    // Additional parameters
    carType: string | null,
    numberOfAdults: number | null,
    numberOfKids: number | null,
    numberOfSpaces: number | null,
}

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

export const fetchOffers = async (service: string, searchCriteria: OfferSearchCriteria, page: number): Promise<[Offer]> => {
  // TODO: Implement search criteria and paging
  // Make a GET request to /logic/api/offers/{service} endpoint
  return await fetch(
    Config.booklyUrl + '/logic/api/offers/' + service + '/' + searchCriteriaToQuery(searchCriteria) + '&page=' + page, {
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

const searchCriteriaToQuery = (searchCriteria: OfferSearchCriteria) => {
    let queryString = '?location=' + searchCriteria.location +
        '&dateFrom=' + Math.floor(searchCriteria.dateFrom.getTime() / 1000) +
        '&dateTo=' + Math.floor(searchCriteria.dateTo.getTime() / 1000);
    if (searchCriteria.numberOfSpaces !== null) {
        queryString += '&numberOfSpaces=' + searchCriteria.numberOfSpaces;
    }
    if (searchCriteria.numberOfAdults !== null) {
        queryString += '&numberOfAdults=' + searchCriteria.numberOfAdults;
    }
    if (searchCriteria.numberOfKids !== null) {
        queryString += '&numberOfKids=' + searchCriteria.numberOfKids;
    }
    if (searchCriteria.carType !== null) {
        queryString += '&carType=' + searchCriteria.carType;
    }
    return queryString;
};
