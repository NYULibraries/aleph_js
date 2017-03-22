/*
 * Format library account tables
 *
 * Ex.
 *  libraryAccount.init();
 */
const libraryAccount = {
  nyRegex: /^NYU50$/i,
  adRegex: /^NYU51$/i,
  nyLabel: {
    tag: "span",
    attrs: { id: "nyu50-Label" },
    value: "New York"
  },
  adLabel: {
    tag: "span",
    attrs: { id: "nyu51-Label" },
    value: "Abu Dhabi"
  },
  confirmLogout(anchor) {
    const confirmLogoutText = "Are you sure you want to logout of the patron module?";
    if (confirm(logoutConfirmText)) {
      return true;
    } else {
      return false;
    }
  },
  init() {
    const sublibraryHeaders = "#pindex #activities th.td1";
    const confirmLogoutLink = "#nav1endsession > a";
    $(sublibraryHeaders).each( (index, element) => {
      if ($(element).html().match(libraryAccount.nyRegex)) {
        $(element).html(htmlHelpers.render(libraryAccount.nyLabel));
      } else if ($(element).html().match(libraryAccount.adRegex)) {
        $(element).html(htmlHelpers.render(libraryAccount.adLabel));
      }
    });
    $(confirmLogoutLink).on("click", function() {
      libraryAccount.confirmLogout(this);
    });
  }
}
