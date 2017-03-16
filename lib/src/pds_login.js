/*
 * Handle passive login to PDS
 *
 * Ex.
 *  pdsLogin.passiveLogin();
 */
const pdsLogin = {
  pdsUrl: () => {
    const institute = 'NYU';
    const url = '.library.nyu.edu/pds?func=load-login&calling_system=aleph&institute=' + institute + '&url=' + encodeURIComponent(window.location);
    if (window.location.hostname.match("^alephstage")) return 'https://pdsdev' + url;
    if (window.location.hostname.match("^aleph")) return 'https://pds' + url;
    return window.location.hostname;
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
    pdsLogin.redirectToPds();
  }
};

pdsLogin.passiveLogin();
