const AlephInit = {};
// Global constant to check if this JS has already been initialized
window.AlephInit = AlephInit;

import $ from 'jquery';
require('imports-loader?jquery-ui')
require('imports-loader?window.jQuery=jquery!./vendor/jquery.validate.js')

import { formatHoldings } from './lib/format_holdings'
import { search, bs_history_nav, bs_toggle_limits } from './lib/search'
import { libraryAccount } from './lib/library_account'
import { modalDialog } from './lib/modal_dialog'
import { pdsLogin } from './lib/pds_login'
import { bs_request_ill } from './lib/utils'
import { bs_booking_location_hours, bs_booking_submit, bs_process_booking } from './lib/bookings'
import { redirect, cookies, querystring, ill } from './lib/utils'
import { Holding } from './models/holding'
import { HoldingsTableRow } from './models/holdings_table_row'

// Setting all these on the window for tests to run
// need to refactor this with babel/browserify includes for testing
window.$ = window.jQuery = $;
window.modalDialog = modalDialog;
window.Holding = Holding;
window.HoldingsTableRow = HoldingsTableRow;
window.formatHoldings = formatHoldings;
window.pdsLogin = pdsLogin;
window.redirect = redirect;
window.cookies = cookies;
window.querystring = querystring;
window.search = search;
window.ill = ill;
// Set legacy global functions on the window
window.bs_request_ill = bs_request_ill;
window.bs_booking_location_hours = bs_booking_location_hours;
window.bs_booking_submit = bs_booking_submit;
window.bs_process_booking = bs_process_booking;
window.bs_history_nav = bs_history_nav;
window.bs_toggle_limits = bs_toggle_limits;

// Exclude sub-domains from same-origin policy
if (window.location.hostname.match("library.nyu.edu$")) {
  document.domain = 'library.nyu.edu';
}
// Call the init() functions for these objects on document ready
const initObjects = [
  formatHoldings,
  search,
  libraryAccount,
  modalDialog
];

$(document).ready( () => {
  $.each(initObjects, (index, value) => {
    value.init();
  });
  if (!pdsLogin.isLoggedIn()) {
    let $h3 = $('#main').find('h3:contains("Holdings")');
    $h3.css({ float: 'left' })
    $h3.after(pdsLogin.addLoginButton());
  }
  // This function didn't get updated yet
  // because we don't have a user story for it
  bs_process_booking();
});

