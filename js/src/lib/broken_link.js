/*
 * Instantiate a broken link reporter that calls a server-side script
 * includes the aleph_id and aleph_url so that e-resources can track down
 * the broken link
 *
 * Ex.
 *  brokenLink.init(); => <span><a href="{link}">[Report Broken Link]</a></span>
 */
const brokenLink = {
  init(index, holdingsTableRow) {
    const brokenLinkScript = 'https://nyu.qualtrics.com/jfe/form/SV_blQ3OFOew9vl6Pb?Source=NYU';
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
