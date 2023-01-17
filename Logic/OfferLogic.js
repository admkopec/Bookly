import Config from '../Configs/Config';
import {getToken} from './AccountLogic';

export const fetchOffer = async offerId => {
  // Make a GET request to /logic/api/offers/{offerId} endpoint
  return await fetch(Config.booklyUrl + '/logic/api/offers' + offerId, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: 'Bearer ' + (await getToken()),
    },
  }).then(e => e.json());
};

export const fetchOffers = () => {
  // TODO: Implement
  return null;
};
