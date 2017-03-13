/*
 * Instantiate a broken link reporter that calls a server-side script
 * includes the aleph_id and aleph_url so that e-resources can track down
 * the broken link
 *
 * Ex.
 *  brokenLink.init(); => <span><a href="/cgi-bin/broken.pl">[Report Broken Link]</a></span>
 */
const brokenLink = {
  init: function setupLink(holdingsTableRow) {
    const broken_link_script = '/cgi-bin/broken.pl';
    const anchor = {
      tag: 'a',
      attrs: { id: "broken_link_anchor" + index, target: '_blank', href: broken_link_script },
      value: 'Report Broken Link'
    };
    const span = {
      tag: 'span',
      attrs: { id: "broken_link" + index, class: 'broken_link' },
      value: "[" + anchor + "]"
    };
    const $broken_link_span = $(renderHtml(span));
    const $broken_link_anchor = $broken_link_span.find('a');
    // Store url and aleph id for processing later
    $broken_link_anchor.data("aleph_id", $.query.get("doc_number"));
    $broken_link_anchor.data("aleph_url", href);
    $broken_link_anchor.on('click', (e, data) => {
      this.send($broken_link_span);
      return false;
    });
    holdingsTableRow.td856().append($broken_link_span);
  },
  send: function sendEmail($broken_link_span) {
    const sending_html = '<span>[<em>Sending...</em>]</span>';
  	const aleph_id = $broken_link_span.data("aleph_id")
  	const aleph_url = encodeURIComponent($broken_link_span.data("aleph_url"));
    const broken_link_data = "aleph_id=" + aleph_id + "&aleph_url=" + aleph_url;
  	$broken_link_span.html(sending_html);
    $.get($broken_link_span.find('a').href, broken_link_data, (data, text_status, xml_http_request) => {
      $broken_link_span.html("["+data+"]");
    });
  }
};
