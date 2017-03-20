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
  init() {
    const sublibrary_headers = "#pindex #activities th.td1";
    $(sublibrary_headers).each( (index, element) => {
      if ($(element).html().match(libraryAccount.nyRegex)) {
        $(element).html(htmlHelpers.render(libraryAccount.nyLabel));
      } else if ($(element).html().match(libraryAccount.adRegex)) {
        $(element).html(htmlHelpers.render(libraryAccount.adLabel));
      }
    });
  }
}
