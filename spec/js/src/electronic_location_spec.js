describe('formatHoldings', function() {
  let f99, getProxyPrefix;

  describe('formatHoldingsTable', () => {
    beforeEach( () => {
      f99 = "#holdings table#holdingsTable tr.f99";
      getProxyPrefix = (sublibrary) => {
        return new RegExp("^" + formatHoldings.ezProxyPrefix[sublibrary].replace("?","\\?"));
      };
    });
    it('should hide location row for restricted sublibraries', () => {
      const $restrictedLocation = $(f99).find("td:contains('NYU Restricted')");
      expect($restrictedLocation.is(":hidden")).toEqual(true);
    });
    describe('report broken link functionality', () => {
      let brokenLink;
      beforeEach( () => {
        brokenLink = $(f99).find("td span#broken_link1");
      });
      it('should add "Report Broken Link"', () => {
        expect($(brokenLink).length).toBeGreaterThan(0);
      });
      it('should link "Report Broken Link" to a local cgi-script', () => {
        expect($(brokenLink).children("a").first().attr("href")).toEqual("/cgi-bin/broken.pl");
      });
    });
    describe('add proxy prefix to restricted resources', () => {
      it('should prefix NYU proxy for BWEB sublibrary', () => {
        expect(getProxyPrefix("BWEB").test($('#bweb_link').attr('href'))).toEqual(true);
      });
      it('should prefix NYU proxy for TWEB sublibrary', () => {
        expect(getProxyPrefix("TWEB").test($('#tweb_link').attr('href'))).toEqual(true);
      });
      it('should prefix NYU proxy for NWEB sublibrary', () => {
        expect(getProxyPrefix("NWEB").test($('#nweb_link').attr('href'))).toEqual(true);
      });
      it('should prefix NYU proxy for CU sublibrary', () => {
        expect(getProxyPrefix("CU").test($('#cu_link').attr('href'))).toEqual(true);
      });
      it('should prefix NYU proxy for NYSID sublibrary', () => {
        expect(getProxyPrefix("NYSID").test($('#nysid_link').attr('href'))).toEqual(true);
      });
    });
  });

});
