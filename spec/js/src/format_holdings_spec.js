describe('formatHoldings', function() {

  describe('ezProxyPrefix', () => {
    it('should map sublibrary codes to proxy prefixes', () => {
      expect(formatHoldings.ezProxyPrefix["BWEB"]).toEqual("https://ezproxy.library.nyu.edu/login?url=");
      expect(formatHoldings.ezProxyPrefix["NWEB"]).toEqual("https://ezproxy.library.nyu.edu/login?url=");
      expect(formatHoldings.ezProxyPrefix["CU"]).toEqual("http://proxy.library.cooper.edu:2048/login?url=");
      expect(formatHoldings.ezProxyPrefix["TWEB"]).toEqual("https://login.libproxy.newschool.edu/login?url=");
      expect(formatHoldings.ezProxyPrefix["WEB"]).toEqual("");
      expect(formatHoldings.ezProxyPrefix["NYSID"]).toEqual("http://plibrary.nysid.edu/login?url=");
    });
  });

  describe('restrictedSublibraries', () => {
    it('should be an array of restricted sublibrary codes', () => {
      expect(formatHoldings.restrictedSublibraries).toContain("BWEB");
      expect(formatHoldings.restrictedSublibraries).toContain("NWEB");
      expect(formatHoldings.restrictedSublibraries).toContain("CU");
      expect(formatHoldings.restrictedSublibraries).toContain("TWEB");
      expect(formatHoldings.restrictedSublibraries).toContain("NYSID");
    });
  });

});
