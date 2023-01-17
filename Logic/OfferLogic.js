import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export const fetchOffer = offerId => {
  // Make a GET request to /logic/api/offers/{offerId} endpoint
  return fetch(Config.booklyUrl + '/logic/api/offers' + offerId, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
  }).then(e => e.json());
};

export const fetchOffers = () => {
  // TODO: Implement
  return null;
};
