describe('formatHoldings', () => {

  describe('restrictedSublibraries', () => {
    it('should contain array of restricted sublibraries', () => {
      expect(formatHoldings.restrictedSublibraries).toEqual(["BWEB", "CU", "TWEB", "NWEB", "SWEB", "NYSID"]);
    });
  });

  describe('formatHoldingsTable', () => {
    let f99, getProxyPrefix;
    beforeEach( () => {
      f99 = "#holdings table#holdingsTable tr.f99";
      getProxyPrefix = (sublibrary) => new RegExp("^" + formatHoldings.ezProxyPrefix[sublibrary].replace("?","\\?"));
    });

    it('should hide location row for restricted sublibraries', () => {
      const $restrictedLocation = $(f99).find("td:contains('NYU Restricted')");
      expect($restrictedLocation.is(":hidden")).toEqual(true);
    });

    it('should hide summary holdings', () => {
      const $summaryHoldings = $(f99).filter(".summaryHoldings:visible");
      expect($summaryHoldings.length).toEqual(0);
    });

    it('should add report broken link functionality', () => {
      expect($(f99).find("td span.broken_link").length).toBeGreaterThan(0);
    });

    it('should add appropriate proxy prefixes to restricted resources', () => {
      expect(getProxyPrefix("BWEB").test($('#bweb_link').attr('href'))).toEqual(true);
      expect(getProxyPrefix("TWEB").test($('#tweb_link').attr('href'))).toEqual(true);
      expect(getProxyPrefix("NWEB").test($('#nweb_link').attr('href'))).toEqual(true);
      expect(getProxyPrefix("CU").test($('#cu_link').attr('href'))).toEqual(true);
      expect(getProxyPrefix("NYSID").test($('#nysid_link').attr('href'))).toEqual(true);
    });

    it('should not add proxy prefixes to unrestricted resources', () => {
      expect($('#web_link').attr('href')).toEqual("http://site.ebrary.com/lib/nyulibrary");
    });

    it('should remove sublibrary text from after electronic location line', () => {
      expect($('#bweb_link').closest('td').html()).not.toContain('BWEB');
      expect($('#tweb_link').closest('td').html()).not.toContain('TWEB');
      expect($('#nweb_link').closest('td').html()).not.toContain('NWEB');
      expect($('#cu_link').closest('td').html()).not.toContain('CU');
      expect($('#nysid_link').closest('td').html()).not.toContain('NYSID');
      expect($('#web_link').closest('td').html()).not.toContain('WEB');
    });

  });

  describe('formatHoldingsItems', () => {
    it('should map availability statuses to On Shelf where appropriate', () => {
      const statuses = "#holdings table#items td.due_date";
      expect($(statuses).filter(".mapped_status").html()).toEqual("On Shelf");
      expect($(statuses).filter(".unmapped_status").html()).toEqual("Request ILL");
    });
    it('should clean up whitespace in links text field', () => {
      expect($("#holdings table#items td.links a").html()).toEqual("Request");
    });
  });

  describe('formatBibTable', () => {
    it('should hide empty bib rows', () => {
      expect($(".emptyBibRow .fxxx").is(":hidden")).toBe(true);
    });
  });

});
