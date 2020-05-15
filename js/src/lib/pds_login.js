/*
 * Handle passive login to PDS
 *
 * Ex.
 *  pdsLogin.passiveLogin();
 */
export const pdsLogin = {
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
    redirect.windowReplace(this.pdsUrl());
  },
  addLoginButton() {
    // Avoiding using stylesheets so have this ugly css attribute hash
    // From https://library.nyu.edu/style-guide/basic/
    let buttonStyles = {
      'float': 'right',
      'border': '0 none',
      'box-shadow': 'none',
      'background': '#57068c',
      'color': '#fff',
      'font-weight': '400',
      'font-size': '18px',
      'font-family': '"Gotham A","Gotham B",Helvetica,Arial,sans-serif',
      'text-align': 'center',
      'text-decoration': 'none',
      'padding': '15px 30px',
      'border-radius': '3px',
      'display': 'inline-block',
      'margin': '0 3px 10px 0'
    };
    let $wrapper = $('<div />').css({ width: '70%' });
    let $button = $('<a />').css(buttonStyles).attr({ id: 'pds-login-button', href: this.pdsUrl() }).html('Login');
    let $clear = $('<div />').css('clear', 'both');
    return $wrapper.append($button).after($clear);
  },
  passiveLogin() {
    if (this.isLoggedIn()) return;
    if (querystring.get('func') == 'item-global') this.redirectToPds();
  }
};
