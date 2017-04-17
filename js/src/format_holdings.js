/*
 * Format display on holdings page
 * - If this is a restricted resource hide Location information
 * - If there are summary holdings, only show the last one
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
  formatHoldingsTable() {
    const f99s = "#holdings table#holdingsTable tr.f99";

    // Maintain state through the previous row object
    let previousRow = null;
    let holdingsTableRow = null;
    let $tr = null;

    $(f99s).each( (index, tr) => {
      $tr = $(tr);
      previousRow = holdingsTableRow;
      holdingsTableRow = new HoldingsTableRow(tr);

      // If location row shows that this is a restricted resource
      if (holdingsTableRow.isLocationRow() && holdingsTableRow.isRestrictedResource()) {
        // Hide restricted Internet locations
        $tr.hide();
        // If summary row
      } else if (holdingsTableRow.isSummaryHolding()) {
        // Hide summary holdings
        $tr.hide();
      // If electronic location row
      } else if (holdingsTableRow.isElectronicLocation()) {
        // Add broken link functionality
        brokenLink.init(holdingsTableRow);
        // Add EZProxy prefix
        if ($.inArray(restrictedSublibraries, holdingsTableRow.sublibrary())) {
          const restrictedHref856 = ezProxyPrefix[holdingsTableRow.sublibrary()].concat(holdingsTableRow.href856());
          holdingsTableRow.anchor856().attr("href", restrictedHref856);
          holdingsTableRow.anchor856().html(restrictedHref856);
        }
        // Remove Sublibrary
        holdingsTableRow.td856().html(holdingsTableRow.td856().html().replace(sublibrary, ""));
      } else {
        previousRow = null;
      }
    });
  },
  formatHoldingsItems() {
    const holdingsLinks = "#holdings table#items td.links";
    // Clean whitespace from links table data element for prettier presentation
    $(holdingsLinks).each( (index, td) => {
      $td = $(td);
      $td.html($td.html().replace("&nbsp;", ""))
    });
    // Re-write item statuses for items that are 'selected for off-site'; they
    // should all appear as "On Shelf" since they have not been removed from the
    // stacks until they reach 'off-site prep' phase
    const avalabilityColumn = "#holdings table#items td.due_date";
    $(availabilityColumn).each( (index, value) => formatHoldings.replaceAvailabilityWithOnShelf(value) );
  },
  replaceAvailabilityWithOnShelf(element) {
    const mapToText = "On Shelf";
    const $element = $("#holdings table#items td.due_date:first");
    const $html = $element.html();
    $element.html($html.replace(new RegExp("^" + mapAvailabilityStatuses[mapToText].join("|") + "$", "gi"), mapToText));
  },
  formatBibTable() {
    const emptyBibRowRegEx = /<span>\s*&nbsp;<br>\s*<\/span>/i;
    const bibRows = "#holdings table#bib td.fxxx";
    // Hide empty table data elements for prettier presentation
    $(bibRows).filter(function() { return $(this).html().match(emptyBibRowRegEx); }).hide();
  },
  init() {
    this.formatBibTable();
    this.formatHoldingsTable();
    this.formatHoldingsItems();
  }
};
