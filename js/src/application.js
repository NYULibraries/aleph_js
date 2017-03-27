// Log the user in before we do anything
pdsLogin.passiveLogin();

// Call the init() functions for these objects on document ready
const initObjects = [
  formatHoldings,
  search,
  libraryAccount,
  bookings
];

$(document).ready( () => {
  $.each(initObjects, (index, value) => {
    value.init();
  });
});
