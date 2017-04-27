class Holding {
	constructor (element, sharedModalDialog) {
		this.element = element;
		this.sharedModalDialog = sharedModalDialog;

		this.$element = $(element);
		this.$sharedModalDialog = $(sharedModalDialog);

		// this.subLibrary = this.$element.data("sub_library");
		// this.itemType = this.$element.data("item_type");
		// this.availability = this.$element.data("availability");
    // this.collection = this.$element.data("collection");
	}

	extractData () {
		var itemColumnOrder = new Array();
		$("#holdings table#items th").each(function(index, th) {
			itemColumnOrder[index] = $.trim($(th).text());
		});
		var subLibraryIndex = $.inArray("Location", itemColumnOrder);
		var collectionIndex = $.inArray("Collection", itemColumnOrder);
		var itemTypeIndex = $.inArray("Item Type", itemColumnOrder);
		var availabilityIndex = $.inArray("Availability", itemColumnOrder);

		this.subLibrary = this.$element.closest("tr").children().eq(subLibraryIndex).text();
		this.collection = this.$element.closest("tr").children().eq(collectionIndex).text();
		this.itemType = this.$element.closest("tr").children().eq(itemTypeIndex).text();
		this.availability = this.$element.closest("tr").children().eq(availabilityIndex).text();

		this.href = this.$element.attr('href');
		var docNumberRegex = /\&adm_doc_number=([^&]+)&/;
		var docLibraryRegex = /\&doc_library=([^&]+)&/;
		this.docNumber = docNumberRegex.exec(this.href)[1];
		this.docLibrary = docLibraryRegex.exec(this.href)[1];
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
