describe('modalDialog', () => {
  describe('pdsLoginRegex', () => {
    it('should work', () => {
      expect(modalDialog.pdsLoginRegex).toEqual(/LoginPds/);
    });
  });

  describe('init', () => {
    beforeEach( () => {
      spyOn(modalDialog, 'launchDialogOrRedirect')
    });

    it('should open modal when clicked', () => {
      $('.request-to-click').click();
      expect(modalDialog.launchDialogOrRedirect).toHaveBeenCalled();
    });
  });
});
