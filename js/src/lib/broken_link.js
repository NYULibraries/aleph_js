/*
 * Instantiate a broken link reporter that links out to an appropriate place
 *
 * Ex.
 *  brokenLink.init(); => <span><a href="{link}">[Report Broken Link]</a></span>
 */
const brokenLink = {
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
