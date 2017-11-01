// Log the user in before we do anything
// 2017-06: Disabling this for now because there are complications with users
// that don't login, but let's keep the functionality around
// pdsLogin.passiveLogin();

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
  // This function didn't get updated yet
  // because we don't have a user story for it
  bs_process_booking();
});
