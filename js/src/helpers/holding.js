class Holding {
	constructor (element, sharedModalDialog) {
		this.element = element;
		this.sharedModalDialog = sharedModalDialog;

		this.$element = $(element);
		this.$sharedModalDialog = $(sharedModalDialog);
	}

	extractData () {
		this.subLibrary = this.columnData("Location");
		this.collection = this.columnData("Collection");
		this.itemType = this.columnData("Item Type");
		this.availability = this.columnData("Availability");

		this.docNumber = this.paramData('adm_doc_number');
		this.docLibrary = this.paramData('doc_library');
	}

	paramData (paramKey) {
		if (!this.href)
			this.href = this.$element.attr('href');
		var paramRegex = new RegExp('\\&' + paramKey + '=([^&]+)&')
		return paramRegex.exec(this.href)[1];
	}

	columnData (columnTitle) {
		var index = this.columnPositionIndex(columnTitle);
		return this.$element.closest("tr").children().eq(index).text();
	}

	columnPositionIndex (columnTitle) {
		return $.inArray(columnTitle, this.getItemColumnOrder());
	}

	getItemColumnOrder () {
		if (this.itemColumnOrder)
			return this.itemColumnOrder;
		var itemColumnOrder = new Array();
		$("#holdings table#items th").each(function(index, th) {
			itemColumnOrder[index] = $.trim($(th).text());
		});
		return this.itemColumnOrder = itemColumnOrder;
	}

	setData () {
		this.$sharedModalDialog.data("is_available", this.isAvailable());
		this.$sharedModalDialog.data("is_offsite", this.isOffsite());
		if (this.isAvailable() || this.isOffsite()) {
			this.$sharedModalDialog.data("sub_library", this.subLibrary);
		}
    this.$sharedModalDialog.data("is_request_ill", this.isRequestIll());
    if (this.isRequestIll()) {
      this.$sharedModalDialog.data("doc_number", this.docNumber);
      this.$sharedModalDialog.data("doc_library", this.docLibrary);
    }
	}

	isAvailable () {
		return this.itemType == "Available" || this.availability == "On Shelf";
	}

	isOffsite () {
		return this.itemType == "Offsite Available";
	}

	isRequestIll () {
    if (this.collection === "NYU Bobst Avery Fisher Center") { return false; }
    return this.itemType != "Offsite Available" && this.itemType != "Available" && this.availability != "On Shelf" && this.availability != "Reshelving";
	}
}
