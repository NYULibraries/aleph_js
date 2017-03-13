class HoldingsTableRow {
  const locationRowLabel = /"nowrap f99label">\s*Location/;
  const summaryHoldingsRowLabel = /"nowrap f99label">\s*Summary Holding/;
  const electronicLocationRowLabel = /"nowrap f99label">\s*Electronic Location/;
  const emptyRowLabel = /"nowrap f99label">\s*<\/td>/i;
  const locationString = "location";
  const summaryString = "summary";
  const electronicLocationString = "electronic_location";
  const web856RegExp = /(\sBWEB|\sCU|\sTWEB|\sNWEB|\sWEB|\sNYSID)\s*/;

  constructor(index, row, previousRow) {
    this.index = index;
    this.row = row;
    this.previousRow = previousRow;
    this.type = this.determineHoldingType();
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
