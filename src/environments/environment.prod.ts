const domain = 'http://35.243.138.228:8000/';
export const environment = {
  domain: domain,
  api: {
    oauth: domain + 'oauth/',
    url: domain + 'api-web/'
  },
  production: true,
  user: {
    company: localStorage.getItem('company_id'),
    cargo: localStorage.getItem('cargo_id'),
    code: localStorage.getItem('user_id'),
    name: localStorage.getItem('user_name'),
  },
  commercial_manager: Number(localStorage.getItem('cargo_id')) === 26
};
