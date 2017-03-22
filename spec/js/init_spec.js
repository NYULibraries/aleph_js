describe('Init', function() {

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath="base/spec/javascripts/fixtures"
    loadFixtures("revue_des_etudes_islamiques.html");
  });

  it('should return array of restricted sub libraries', function() {
    expect(restrictedSublibraries).toEqual(["BWEB", "CU", "TWEB", "NWEB", "NYSID"]);
  });

});
