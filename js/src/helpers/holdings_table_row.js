/*
 * Representation of a row in the holdings informational table at the top of
 * the holdings page (func=item-global)
 */
class HoldingsTableRow {
  constructor(row, previousRow) {
    this.row = row;
    this.previousRow = previousRow;
  }

  locationRowMatcher() {
    return /"nowrap f99label">\s*Location/;
  }

  summaryHoldingsRowMatcher() {
    return /"nowrap f99label">\s*Summary Holding/;
  }

  electronicLocationRowMatcher() {
    return /"nowrap f99label">\s*Electronic Location/;
  }

  emptyRowMatcher() {
    return /"nowrap f99label">\s*<\/td>/i;
  }

  web856Matcher() {
    return /(\sBWEB|\sCU|\sTWEB|\sNWEB|\sWEB|\sNYSID)\s*/;
  }

  isLocationRow() {
    return (this.locationRowMatcher().test(this.row.innerHTML) || (this.emptyRowMatcher().test(this.row.innerHTML) && this.locationRowMatcher().test(this.previousRow.innerHTML)));
  }

  isSummaryHoldingRow() {
    return (this.summaryHoldingsRowMatcher().test(this.row.innerHTML) || (this.emptyRowMatcher().test(this.row.innerHTML) && this.summaryHoldingsRowMatcher().test(this.previousRow.innerHTML)));
  }

  isElectronicLocation() {
    return (this.electronicLocationRowMatcher().test(this.row.innerHTML) || (this.emptyRowMatcher().test(this.row.innerHTML) && this.electronicLocationRowMatcher().test(this.previousRow.innerHTML)));
  }

  isRestrictedResource() {
    // Restricted Internet Location Regular Expressions
    const internetLocationRegExp = /Restricted/g;
    const internetLocation2RegExp = /Internet/gi;
    return (internetLocationRegExp.test(this.row.innerHTML) && internetLocation2RegExp.test(this.row.innerHTML));
  }

  sublibrary() {
    const sublibrary = this.web856Matcher().exec(this.row.innerHTML);
    if (sublibrary != null) {
      return $.trim(this.web856Matcher().exec(this.row.innerHTML)[0]);
    } 
  }

  td856() {
    return $(this.row).children("td").filter( (index, element) => { return $(element).html().match(this.web856Matcher()) });
  }

  anchor856() {
    return this.td856().children("a").first();
  }

  href856() {
    return $(this.anchor856()).attr("href");
  }
};
