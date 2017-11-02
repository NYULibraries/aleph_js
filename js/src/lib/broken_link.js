/*
 * Instantiate a broken link reporter that calls a server-side script
 * includes the aleph_id and aleph_url so that e-resources can track down
 * the broken link
 *
 * Ex.
 *  brokenLink.init(); => <span><a href="/cgi-bin/broken.pl">[Report Broken Link]</a></span>
 */
const brokenLink = {
  init(index, holdingsTableRow) {
    const brokenLinkScript = '/cgi-bin/broken.pl';
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

    // Bind a click event
    $(document).on('click', '#broken_link_anchor' + index, function(e) {
      let span = $(this).closest('span');
      e.preventDefault();
      let sendingHtml = html.render({ tag: 'span', value: '[' + html.render({tag: 'em', value: 'Sending...'}) + ']' });
      let submittedHtml = '[' + html.render({tag: 'em', value: 'Submitted'}) + ']';
      let alephId = querystring.get("doc_number")
      let alephUrl = encodeURIComponent(holdingsTableRow.href856());
      let brokenLinkData = "aleph_id=" + alephId + "&aleph_url=" + alephUrl;
      span.html(sendingHtml);
      $.get(span.find('a').href, brokenLinkData).done(() => { span.html(submittedHtml)});
      return false;
    });
  }
};
