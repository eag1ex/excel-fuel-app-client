import { localStorageGetUser } from '@excel/utils';

export const environment = {
  production: true,
  serviceWorker: true,
  /** REVIEW Update our api in production  */
  apiBaseUrl: '/api',
  user: localStorageGetUser('excel-user')
};
