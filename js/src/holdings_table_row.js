/*
 * Representation of a row in the holdings informational table at the top of
 * the holdings page (func=item-global)
 */
class HoldingsTableRow {
  constructor(index, row, previousRow) {
    this.index = index;
    this.row = row;
    this.previousRow = previousRow;
    this.type = this.determineHoldingType();
    this.locationRowLabel = /"nowrap f99label">\s*Location/;
    this.summaryHoldingsRowLabel = /"nowrap f99label">\s*Summary Holding/;
    this.electronicLocationRowLabel = /"nowrap f99label">\s*Electronic Location/;
    this.emptyRowLabel = /"nowrap f99label">\s*<\/td>/i;
    this.locationString = "location";
    this.summaryString = "summary";
    this.electronicLocationString = "electronic_location";
    this.web856RegExp = /(\sBWEB|\sCU|\sTWEB|\sNWEB|\sWEB|\sNYSID)\s*/;
  }

  isLocationRow() {
    return (this.locationRowLabel.test(this.row.innerHTML) || (this.emptyRowLabel.test(this.row.innerHTML) && this.previousRow.isLocationRow()));
  }

  isSummaryRow() {
    return (this.summaryHoldingsRowLabel.test(this.row.innerHTML) || (this.emptyRowLabel.test(this.row.innerHTML) && this.previousRow.isSummaryRow()));
  }

  isElectronicLocation() {
    return (this.electronicLocationRowLabel.test(this.row.innerHTML) || (this.emptyRowLabel.test(this.row.innerHTML) && this.previousRow.isElectronicLocation()));
  }

  isRestrictedResource() {
    // Restricted Internet Location Regular Expressions
    const internetLocationRegExp = /Restricted/g;
    const internetLocation2RegExp = /Internet/gi;
    return (internetLocationRegExp.test(this.row.innerHTML) && internetLocation2RegExp.test(this.row.innerHTML));
  }

  determineHoldingType() {
    let holdingType = null;
    if (this.isLocationRow()) {
      holdingType = this.locationString;
    } else if (this.isSummaryRow()) {
      holdingType = this.summaryString;
    } else if (this.isElectronicLocationRow()) {
      holdingType = this.electronicLocationString;
    }
    return holdingType;
  }

  sublibrary() {
    return $.trim(this.web856RegExp.exec(this.row.innerHTML)[0]);
  }

  td856() {
    return $(this.row).children("td").filter( (index) => $(this).html().match(this.web856RegExp));
  }

  anchor856() {
    return $(td856).children("a").first();
  }

  href856() {
    return $(anchor856).attr("href");
  }
};
