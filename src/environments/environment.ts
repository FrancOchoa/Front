// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const domain = 'http://10.19.98.54:8000/';
export const environment = {
  domain: domain,
  api: {
    oauth: domain + 'oauth/',
    url: domain + 'api-web/'
  },
  production: false,
  user: {
    company: localStorage.getItem('company_id'),
    cargo: localStorage.getItem('cargo_id'),
    code: localStorage.getItem('user_id'),
    name: localStorage.getItem('user_name'),
  },
  commercial_manager: Number(localStorage.getItem('cargo_id')) === 26
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
