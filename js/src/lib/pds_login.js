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
    // Use the PDS_HANDLE cookie to try and determine if a user is already
    // logged in to PDS. The worst that could happen with this approach
    // is that an already logged in user would get redirected to login when clicking "Request"
    return cookies.get('PDS_HANDLE') && cookies.get('PDS_HANDLE') != 'GUEST';
  },
  redirectToPds() {
    location.replace(this.pdsUrl());
  },
  passiveLogin() {
    if (this.isLoggedIn()) return;
    if (querystring.get('func') == 'item-global') this.redirectToPds();
  }
};
