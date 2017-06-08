describe('modalDialog', () => {

  describe('pdsLoginRegex', () => {
    it('should work', () => {
      expect(modalDialog.pdsLoginRegex).toEqual(/LoginPds/);
    });
  });
});
