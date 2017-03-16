/*
 *
 * Ex.
 *  fomatHoldings.init();
 */
const formatHoldings = {
  init: function setupFormattedHoldings() {
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
        // Show only last summary holdings
        if ($tr == $("tr.f99").last()) {
          $tr.show();
          // Hide all others
        } else {
          $tr.hide();
        }
      // If electronic location row
      } else if (holdingsTableRow.isElectronicLocation()) {
        // Add broken link functionality
        brokenLink.init(holdingsTableRow);
        // Add EZProxy prefix
        if ($.inArray(restrictedSublibraries, holdingsTableRow.sublibrary())) {
          const restrictedHref856 = ezProxyPrefix[holdingsTableRow.sublibrary()].concat(holdingsTableRow.href856();
          holdingsTableRow.anchor856().attr("href", restrictedHref856);
          holdingsTableRow.anchor856().html(restrictedHref856);
        }
        // Remove Sublibrary
        holdingsTableRow.td856().html(holdingsTableRow.td856().html().replace(sublibrary, ""));
      } else {
        previousRow = null;
      }
    }
  );
}
