export const environment = {
  production: true,
  serviceWorker: true,
  /** REVIEW Update our api in production  */
  apiBaseUrl: '/api',
  user: JSON.parse(localStorage.getItem('excel-user'))
};
