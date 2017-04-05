describe('formatHoldings', function() {

  describe('restrictedSublibraries', () => {
    it('should contain array of restricted sublibraries', () => {
      expect(formatHoldings.restrictedSublibraries).toEqual(["BWEB", "CU", "TWEB", "NWEB", "NYSID"]);
    });
  });

  describe('formatHoldingsTable', () => {
    let f99, getProxyPrefix, brokenLink;
    beforeEach( () => {
      f99 = "#holdings table#holdingsTable tr.f99";
      getProxyPrefix = (sublibrary) => new RegExp("^" + formatHoldings.ezProxyPrefix[sublibrary].replace("?","\\?"));
      brokenLink = $(f99).find("td span.broken_link");
    });

    it('should hide location row for restricted sublibraries', () => {
      const $restrictedLocation = $(f99).find("td:contains('NYU Restricted')");
      expect($restrictedLocation.is(":hidden")).toEqual(true);
    });

    it('should add report broken link functionality', () => {
      expect($(brokenLink).length).toBeGreaterThan(0);
      expect($(brokenLink).children("a").first().attr("href")).toEqual("/cgi-bin/broken.pl");
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
    it('should', () => {
      expect($("#holdings table#items td.due_date:first").html()).toEqual("On Shelf");
    });
  });

  describe('formatBibTable', () => {

  });

});
