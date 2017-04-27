describe('Holding', function() {
  var holding, element, sharedModalDialog;

  beforeEach(function setupDom() {
    $("#holdings table#items td.links a").filter(function() {
      return $(this).text().match(/^Request$/);
    }).addClass("ajax_window");
  });

  beforeEach(function initializeHolding() {
    element = $("#holdings table#items td.links a.ajax_window");
    sharedModalDialog = $("<div></div>")
      .dialog({autoOpen: false, modal: true, width: "40em", dialogClass: "shared_modal", open: function(event, ui) {
        $("select").first().focus();
      }});
    holding = new Holding(element, sharedModalDialog);
  });

  describe('extractData', () => {
    it('should initialize subLibrary correctly', () => {
      holding.extractData();
      expect(holding.subLibrary).toEqual("NYU Bobst");
    });

    it('should initialize collection correctly', () => {
      holding.extractData();
      expect(holding.collection).toEqual("Main Collection");
    });

    it('should initialize itemType correctly', () => {
      holding.extractData();
      expect(holding.itemType).toEqual("Periodicals");
    });

    it('should initialize availability correctly', () => {
      holding.extractData();
      expect(holding.availability).toEqual("On Shelf");
    });

    it('should initialize docNumber correctly', () => {
      holding.extractData();
      expect(holding.docNumber).toEqual("001816252");
    });

    it('should initialize docLibrary correctly', () => {
      holding.extractData();
      expect(holding.docLibrary).toEqual("NYU50");
    });
  });

  describe('setData', () => {
    it('should set data on sharedModalDialog', () => {
      holding.extractData();
      holding.setData();
      expect($(sharedModalDialog).data()).toEqual(jasmine.objectContaining({
        is_available: true,
        is_offsite: false,
        sub_library: 'NYU Bobst',
        is_request_ill: false,
      }));
    });
  });

  describe('isAvailable', () => {
    it('should be falsy without data', () => {
      expect(holding.isAvailable()).toBeFalsy();
    });

    it('should be truthy with correct itemType', () => {
      holding.itemType = 'Available'
      expect(holding.isAvailable()).toBeTruthy();
    });

    it('should be falsy with incorrect itemType', () => {
      holding.itemType = 'Offsite'
      expect(holding.isAvailable()).toBeFalsy();
    });

    it('should be truthy with correct availability', () => {
      holding.availability = 'On Shelf'
      expect(holding.isAvailable()).toBeTruthy();
    });

    it('should be falsy with incorrect availability', () => {
      holding.availability = 'N/A'
      expect(holding.isAvailable()).toBeFalsy();
    });
  });

  describe('isOffsite', () => {
    it('should be falsy without data', () => {
      expect(holding.isOffsite()).toBeFalsy();
    });

    it('should be truthy with correct itemType', () => {
      holding.itemType = 'Offsite Available'
      expect(holding.isOffsite()).toBeTruthy();
    });

    it('should be falsy with incorrect itemType', () => {
      holding.itemType = 'Available'
      expect(holding.isOffsite()).toBeFalsy();
    });
  });

  describe('isRequestIll', () => {
    it('should be truthy without data', () => {
      expect(holding.isRequestIll()).toBeTruthy();
    });

    it('should be truthy with correct itemType and availability', () => {
      holding.itemType = 'Something';
      holding.availability = 'Something';
      expect(holding.isRequestIll()).toBeTruthy();
    });

    it('should be falsy with correct itemType and incorrect availability', () => {
      holding.itemType = 'Something';
      holding.availability = 'On Shelf';
      expect(holding.isRequestIll()).toBeFalsy();
    });

    it('should be falsy with correct itemType and incorrect availability', () => {
      holding.itemType = 'Something';
      holding.availability = 'Reshelving';
      expect(holding.isRequestIll()).toBeFalsy();
    });

    it('should be falsy with incorrect itemType and correct availability', () => {
      holding.itemType = 'Available';
      holding.availability = 'Something';
      expect(holding.isRequestIll()).toBeFalsy();
    });

    it('should be falsy with incorrect itemType and correct availability', () => {
      holding.itemType = 'Offsite Available';
      holding.availability = 'Something';
      expect(holding.isRequestIll()).toBeFalsy();
    });
  });
});
