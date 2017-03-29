describe('formatHoldings', function() {

  describe('formatHoldingsTable', () => {
    it('should hide location row for restricted sublibraries', () => {
      expect($("#holdings table#holdingsTable tr.f99 td:contains('NYU Restricted')").is(":hidden")).toEqual(true);
    });
  });

});
