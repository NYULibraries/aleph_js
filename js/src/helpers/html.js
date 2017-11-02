/*
 * Helpers for rendering HTML from JS objects
 *
 * Ex.
 *  const linkAsObject = { tag: 'a', attrs: { href: '...' }, value: 'A Link' };
 *  html.render(linkAsObject); ==> <a href="...">A Link</a>
 */
const html = {
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
