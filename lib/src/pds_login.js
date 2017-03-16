/*
 * Handle passive login to PDS
 *
 * Ex.
 *  pdsLogin.passiveLogin();
 */
const pdsLogin = {
  pdsUrl: function pdsUrl() {
    const institute = 'NYU';
    const url = '.library.nyu.edu/pds?func=load-login&calling_system=aleph&institute=' + institute + '&url=' + encodeURIComponent(window.location);
    if (window.location.hostname.match("^alephstage")) return 'https://pdsdev' + url;
    if (window.location.hostname.match("^aleph")) return 'https://pds' + url;
    return window.location.hostname;
  },
  isLoggedIn: function isLoggedIn() {
    return cookies.get('_aleph_pds_passive_login');
  },
  redirectToPds: function redirectToPds() {
    cookies.set('_aleph_pds_passive_login');
    location.replace(this.pdsUrl());
  },
  passiveLogin: () => {
    if (pdsLogin.isLoggedIn()) return;
    const $firstAnchorTag = jQuery("#holdings table#items td.links a").first();
    pdsLogin.redirectToPds();
  }
};

pdsLogin.passiveLogin();
