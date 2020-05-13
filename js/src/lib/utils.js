/*
 * Helpers for getting and setting cookies
 *
 * Ex.
 *  cookies.set('myCookie', 'is this value');
 *  cookies.get('myCookie'); ==> "is this value"
 */
export const cookies = {
  set: (key, value = 1) => {
    document.cookie = key + '=' + value ;
  },
  get: (key) => {
    const keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  }
};

/*
 * Helpers for rendering HTML from JS objects
 *
 * Ex.
 *  const linkAsObject = { tag: 'a', attrs: { href: '...' }, value: 'A Link' };
 *  html.render(linkAsObject); ==> <a href="...">A Link</a>
 */
export const html = {
  render(tag) {
    let html = "";
    html += "<" + tag.tag;
    if (typeof(tag.attrs) != 'undefined') {
      $.each(tag.attrs, (key, value) => {
        html += " " + key + "=\"" + value + "\"";
      });
    }
    html += ">";
    html += tag.value;
    html += "</" + tag.tag + ">";
    return html;
  },
  cleanWhitespace(dirty) {
    // Clean whitespace for prettier presentation
    let $dirty = $(dirty);
    $dirty.html($dirty.html().replace(/&nbsp;/g, ""))
  }
};

/*
 * Get querystring values
 *
 * Ex.
 *  http://example.com?func=item-global
 *  querystring.get('func') ==> 'item-global'
 */
export const querystring = {
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

export const redirect = {
  windowReplace(url) {
    location.replace(url);
  }
};

/*
 * Instantiate a broken link reporter that links out to an appropriate place
 *
 * Ex.
 *  brokenLink.init(); => <span><a href="{link}">[Report Broken Link]</a></span>
 */
export const brokenLink = {
  init(index, holdingsTableRow) {
    const brokenLinkScript = 'https://nyu.qualtrics.com/jfe/form/SV_a30SvEFe8f1yXQh';
    const anchor = {
      tag: 'a',
      attrs: { id: "broken_link_anchor" + index, target: '_blank', href: brokenLinkScript },
      value: 'Report Broken Link'
    };
    const span = {
      tag: 'span',
      attrs: { id: "broken_link" + index, class: 'broken_link' },
      value: "[" + html.render(anchor) + "]"
    };
    let $brokenLinkSpan = $(html.render(span));

    holdingsTableRow.td856().append($brokenLinkSpan);
  }
};

/*
 * Handle Interlibrary Loan (ILL) requests
 */
export const ill = {
  url(docLibrary, docNumber) {
    return "/F/?func=item-sfx&doc_library=" + docLibrary + "&doc_number=" + docNumber + "&local_base=PRIMOCOMMON";
  },
  redirectToIll(docLibrary, docNumber) {
    redirect.windowReplace(this.url(docLibrary, docNumber));
  }
};
// Alias old function name
export const bs_request_ill = (docLibrary, docNumber) => { ill.redirectToIll(docLibrary, docNumber); };

