/*
 * Helpers for rendering HTML from JS objects
 *
 * Ex.
 *  const linkAsObject = { tag: 'a', attrs: { href: '...' }, value: 'A Link' };
 *  htmlHelpers.render(linkAsObject); ==> <a href="...">A Link</a>
 */
const htmlHelpers = {
  render(tag) {
    let html = "";
    html += "<" + tag.tag;
    $.each(tag.attrs, (key, value) => {
      html += " " + key + "=\"" + value + "\"";
    });
    html += ">";
    html += tag.value;
    html += "</" + tag.tag + ">";
    return html;
  }
};
