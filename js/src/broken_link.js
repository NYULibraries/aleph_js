/*
 * Instantiate a broken link reporter that calls a server-side script
 * includes the aleph_id and aleph_url so that e-resources can track down
 * the broken link
 *
 * Ex.
 *  brokenLink.init(); => <span><a href="/cgi-bin/broken.pl">[Report Broken Link]</a></span>
 */
const brokenLink = {
  init(holdingsTableRow) {
    const brokenLinkScript = '/cgi-bin/broken.pl';
    const anchor = {
      tag: 'a',
      attrs: { id: "broken_link_anchor" + index, target: '_blank', href: brokenLinkScript },
      value: 'Report Broken Link'
    };
    const span = {
      tag: 'span',
      attrs: { id: "broken_link" + index, class: 'broken_link' },
      value: "[" + htmlHelpers.render(anchor) + "]"
    };
    const $brokenLinkSpan = $(htmlHelpers.render(span));
    const $brokenLinkAnchor = $brokenLinkSpan.find('a');
    // Store url and aleph id for processing later
    $brokenLinkAnchor.data("aleph_id", $.query.get("doc_number"));
    $brokenLinkAnchor.data("aleph_url", href);
    $brokenLinkAnchor.on('click', (e, data) => {
      this.send($brokenLinkSpan);
      return false;
    });
    holdingsTableRow.td856().append($brokenLinkSpan);
  },
  send($brokenLinkSpan) {
    const sending_html = '<span>[<em>Sending...</em>]</span>';
    const submitted_html = '[<em>Submitted</em>]';
    const alephId = $brokenLinkSpan.data("aleph_id")
    const alephUrl = encodeURIComponent($brokenLinkSpan.data("aleph_url"));
    const brokenLinkData = "aleph_id=" + alephId + "&aleph_url=" + alephUrl;
    $brokenLinkSpan.html(sending_html);
    $.get($brokenLinkSpan.find('a').href, brokenLinkData).done(() => { $brokenLinkSpan.html("["+submitted_html+"]")});
  }
};
