// const baseUrl = 'http://localhost:8000'; //DEVELOPMENT
const baseUrl = 'https://collabpads.herokuapp.com'; //PRODUCTION
export const BASE_ROUTER_URL = '/'; //DEVELOPMENT
// export const BASE_ROUTER_URL = '/dashboard/'; //PRODUCTION

// export const SHARED_LINK_URL = 'http://localhost:8000/lists?l=';
export const SHARED_LINK_URL = 'https://www.collabpads.com/lists?l=';

export const LISTS_URL = baseUrl + '/listr_api/lists/';
export const SHARED_LISTS_URL = baseUrl + '/listr_api/shared_lists/';
export const QUICK_URL = baseUrl + '/listr_api/get_one_off/';

export const ITEMS_URL = baseUrl + '/listr_api/items/';

export const LOGIN_URL = baseUrl + '/listr_api/auth/login/';
export const LOGOUT_URL = baseUrl + '/listr_api/auth/logout/';
export const REGISTER_URL = baseUrl + '/listr_api/auth/register/';

export const USER_AUTH_URL = baseUrl + '/listr_api/auth/user/';
export const USER_PASS_CHANGE_URL = baseUrl + '/listr_api/auth/password/change/';

export const USER_URL = baseUrl + '/listr_api/users/';

export const KEY_URL = baseUrl + '/listr_api/keys/';
