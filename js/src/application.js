const AlephInit = {};
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
