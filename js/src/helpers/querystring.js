/*
 * Get querystring values
 *
 * Ex.
 *  http://example.com?func=item-global
 *  querystring.get('func') ==> 'item-global'
 */
const querystring = {
  get(key) {
    // Escape square brackets
    const escapedKey = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const paramMatch = new RegExp("[\\?&]" + escapedKey + "=([^&#]*)");
    const querystringMatches = paramMatch.exec(location.search);
    if (querystringMatches == null) {
      return ""
    } else {
      return decodeURIComponent(querystringMatches[1].replace(/\+/g, " "));
    }
  }
};