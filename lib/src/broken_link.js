const BrokenLink = {
  init: function setupLink(index) {
    const anchor = {
      tag: 'a',
      attrs: { id: "broken_link_anchor" + index, target: '_blank', href: '/cgi-bin/broken.pl' },
      value: 'Report Broken Link'
    };
    const span = {
      tag: 'span',
      attrs: { id: "broken_link" + index, class: 'broken_link' },
      value: "[" + anchor + "]"
    };
    // '<span id="broken_link' + index + '" class="broken_link">[<a id="broken_link_anchor_'+ index +'" href="/cgi-bin/broken.pl" target="_blank">Report Broken Link</a>]</span>'
    const $broken_link_span = $(renderHtml(span));
    // Store url and aleph id for processing later
    // broken_link_span.data("aleph_id", $.query.get("doc_number"));
    // broken_link_span.data("aleph_url", href856);
    // var broken_link_data = jQuery('<a />').attr({'id': broken_link_span.data('aleph_id'), 'href': broken_link_span.data('aleph_url')}).hide();
    // broken_link_span.append(broken_link_data);
    // jQuery(td856).append(broken_link_span);
    // // Attache broken link Ajax function
    // jQuery('a#broken_link_anchor_'+ index).live("click", function(event) {bs_send_broken_link(this);return false;});
  },
  send: function sendEmail(anchor) {
  	// Grab the saved data
  	// var aleph_id = jQuery(anchor).next("a").attr("id");
  	// var aleph_url = encodeURIComponent(jQuery(anchor).next("a").attr("href"));
  	// // Load text that says we're sending the broken link info
  	// var wrapper = jQuery(anchor).closest("span");
  	// wrapper.html('[<span class="sending"><em>Sending...</em></span>]');
  	// // Make the ajax call
  	// new jQuery.get(
  	// 	"/cgi-bin/broken.pl",
  	// 	"aleph_id=" + aleph_id + "&aleph_url=" + aleph_url,
  	// 	function(data, text_status, xml_http_request) {
  	// 		wrapper.html('['+ data +']');
  	// 	}
  	// );
  }
};
