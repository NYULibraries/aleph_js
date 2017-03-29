/*
 * Handle passive login to PDS
 *
 * Ex.
 *  pdsLogin.passiveLogin();
 */
const pdsLogin = {
  location: () => {
    return window.location;
  },
  hostname: () => {
    return pdsLogin.location().hostname;
  },
  pdsUrl: () => {
    const institute = 'NYU';
    const url = '.library.nyu.edu/pds?func=load-login&calling_system=aleph&institute=' + institute + '&url=' + encodeURIComponent(pdsLogin.location());
    if (pdsLogin.hostname().match("^alephstage")) return 'https://pdsdev' + url;
    if (pdsLogin.hostname().match("^aleph")) return 'https://pds' + url;
    return pdsLogin.hostname();
  },
  isLoggedIn: () => {
    return cookies.get('_aleph_pds_passive_login');
  },
  redirectToPds: () => {
    cookies.set('_aleph_pds_passive_login');
    location.replace(pdsLogin.pdsUrl());
  },
  passiveLogin: () => {
    if (pdsLogin.isLoggedIn()) return;
    if ($.query.get('func') == 'item-global') pdsLogin.redirectToPds();
  }
};
