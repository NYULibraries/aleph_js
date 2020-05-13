/*
 * Format library account tables
 *
 * Ex.
 *  libraryAccount.init();
 */
import { html } from '../lib/utils';

export const libraryAccount = {
  nyRegex: /^NYU50$/i,
  adRegex: /^NYU51$/i,
  nyLabel: {
    tag: "span",
    attrs: { id: "nyu50-label" },
    value: "New York"
  },
  adLabel: {
    tag: "span",
    attrs: { id: "nyu51-label" },
    value: "Abu Dhabi"
  },
  init() {
    const sublibraryHeaders = "#pindex #activities .td1";
    $(sublibraryHeaders).each( (index, element) => {
      if ($(element).html().match(libraryAccount.nyRegex)) {
        $(element).html(html.render(libraryAccount.nyLabel));
      } else if ($(element).html().match(libraryAccount.adRegex)) {
        $(element).html(html.render(libraryAccount.adLabel));
      }
    });
  }
}
