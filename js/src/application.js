pdsLogin.passiveLogin();
const initFunctions = [formatHoldings, search, libraryAccount, bookings];

$(document).ready( () => {
  $.each(initFunctions, (index, value) => {
    value.init();
  });
});
