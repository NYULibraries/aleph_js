/*
 * Handle passive login to PDS
 *
 * Ex.
 *  pdsLogin.passiveLogin();
 */
const pdsLogin = {
  location() {
    return window.location;
  },
  hostname() {
    return this.location().hostname;
  },
  pdsUrl() {
    const institute = 'NYU';
    const url = '.library.nyu.edu/pds?func=load-login&calling_system=aleph&institute=' + institute + '&url=' + encodeURIComponent(this.location());
    if (this.hostname().match("^alephstage")) return 'https://pdsdev' + url;
    if (this.hostname().match("^aleph")) return 'https://pds' + url;
    return this.hostname();
  },
  isLoggedIn() {
    return cookies.get('_aleph_pds_passive_login');
  },
  redirectToPds() {
    cookies.set('_aleph_pds_passive_login');
    location.replace(this.pdsUrl());
  },
  passiveLogin() {
    if (this.isLoggedIn()) return;
    if (querystring.get('func') == 'item-global') this.redirectToPds();
  }
};
