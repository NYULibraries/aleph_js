describe('ill', () => {
  let docLibrary, docNumber;

  beforeEach( () => {
    spyOn(location, 'replace').and.stub();
  });

  describe('url', () => {
    it('should give the internal url to redirect to illiad', () => {
      expect(ill.url("BOBST", "1234")).toEqual('/F/?func=item-sfx&doc_library=BOBST&doc_number=1234&local_base=PRIMOCOMMON');
    });
  });

  describe('redirectToIll', () => {
    it('should give the internal url to redirect to illiad', () => {
      ill.redirectToIll("BOBST", "1234");
      expect(location.replace).toHaveBeenCalled();
    });
  });

  describe('bs_request_ill', () => {
    it('should act as an alias to ill.redirectToIll()', () => {
      spyOn(ill, 'redirectToIll').and.stub();
      bs_request_ill("BOBST", "1234");
      expect(ill.redirectToIll).toHaveBeenCalled();
    });
  });
});
