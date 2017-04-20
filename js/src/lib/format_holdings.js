/*
 * Format display on holdings page
 * - If this is a restricted resource hide Location information
 * - If there are summary holdings, hide em
 * - If resource has an electronic location:
 *    - Display "Report Broken Link" functionality
 *    - If sublibrary is restricted, prepend appropriate proxy link
 *    - Hide sublibrary text
 *
 * Ex.
 *  formatHoldings.init();
 */
const formatHoldings = {
  ezProxyPrefix: {
    "BWEB": "https://ezproxy.library.nyu.edu/login?url=",
    "NWEB": "https://ezproxy.library.nyu.edu/login?url=",
    "CU": "http://proxy.library.cooper.edu:2048/login?url=",
    "TWEB": "https://login.libproxy.newschool.edu/login?url=",
    "WEB": "",
    "NYSID": "http://plibrary.nysid.edu/login?url="
  },
  restrictedSublibraries: ["BWEB", "CU", "TWEB", "NWEB", "NYSID"],
  mapAvailabilityStatus(element, mapTo) {
    // const mapToText = "On Shelf";
    // const $element = $("#holdings table#items td.due_date:first");
    const $element = $(element);
    const mappedStatus = $element.html().replace(new RegExp("^" + availabilityStatusesMap[mapTo].join("|") + "$", "gi"), mapTo);
    $element.html(mappedStatus);
  },
  formatHoldingsTable() {
    const f99s = "#holdings table#holdingsTable tr.f99";

    // Maintain state through the previous row object
    let previousRow = null;
    let holdingsTableRow = null;
    let $tr = null;

    $(f99s).each( (index, tr) => {
      $tr = $(tr);
      holdingsTableRow = new HoldingsTableRow(tr, previousRow);

      // Hide restricted Internet locations
      if (holdingsTableRow.isLocationRow() && holdingsTableRow.isRestrictedResource()) {
        $tr.hide();
      }
      // Hide summary holdings
      else if (holdingsTableRow.isSummaryHoldingRow()) {
        $tr.hide();
      }
      // If electronic location row
      else if (holdingsTableRow.isElectronicLocation()) {
        // Add broken link functionality
        brokenLink.init(index, holdingsTableRow);
        // Add proxy prefix
        if ($.inArray(this.restrictedSublibraries, holdingsTableRow.sublibrary())) {
          const restrictedHref856 = this.ezProxyPrefix[holdingsTableRow.sublibrary()].concat(holdingsTableRow.href856());
          holdingsTableRow.anchor856().attr("href", restrictedHref856);
          holdingsTableRow.anchor856().html(restrictedHref856);
        }
        // Remove sublibrary text from the end of the link
        const tdWithoutSublibrary = holdingsTableRow.td856().html().replace(holdingsTableRow.sublibrary(), "");
        holdingsTableRow.td856().html(tdWithoutSublibrary);
      }
      previousRow = tr;
    });
  },
  formatHoldingsItems() {
    const holdingsLinks = "#holdings table#items td.links";
    $(holdingsLinks).each( (i, td) => { html.cleanWhitespace(td) });

    // Re-write item statuses for items that are 'selected for off-site'; they
    // should all appear as "On Shelf" since they have not been removed from the
    // stacks until they reach 'off-site prep' phase
    const availabilityColumn = "#holdings table#items td.due_date";
    $(availabilityColumn).each( (index, value) => formatHoldings.mapAvailabilityStatus(value, "On Shelf") );
  },
  formatBibTable() {
    const emptyBibRowRegEx = /<span>\s*&nbsp;<br>\s*<\/span>/i;
    const bibRows = "#holdings table#bib td.fxxx";
    // Hide empty table data elements for prettier presentation
    $(bibRows).filter((i, td) => $(td).html().match(emptyBibRowRegEx) ).hide();
  },
  init() {
    this.formatBibTable();
    this.formatHoldingsTable();
    this.formatHoldingsItems();
  }
};
