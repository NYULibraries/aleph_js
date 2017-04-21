describe('search', () => {

  describe('toggleLimits', () => {
    let showlimits, hidelimits, limits;
    beforeEach( () => {
      spyOn($.fn, 'toggle').and.callFake( () => true );
    });
    it('should default to hidden limits', () => {
      expect($('#showlimits').is(":visible")).toBe(true);
      expect($('#hidelimits').is(":hidden")).toBe(true);
    });
    it('should show limits when toggled', () => {
      search.toggleLimits();
      expect($("#showlimits").toggle).toHaveBeenCalled();
      expect($("#hidelimits").toggle).toHaveBeenCalled();
      expect($("#limits").toggle).toHaveBeenCalled();
    });
  });

  describe('submitSearchHistoryAction', () => {
    beforeEach( () => {
      spyOn($.fn, 'submit').and.callFake( () => true );
    });
    it('should change the value of the nav_action input field', () => {
      search.submitSearchHistoryAction('action_delete.x');
      expect($("#nav_action").attr('name')).toEqual('action_delete.x');
      expect($("nav_form").submit).toHaveBeenCalled();
    });
  });

  describe('setFullFormat', () => {
    it('should default to the f999 tab', () => {
      expect($("#f999").is(":visible")).toBe(true);
    });
  });

  describe('bs_history_nav', () => {
    it('should act as an alias to search.submitSearchHistoryAction()', () => {
      spyOn(search, 'submitSearchHistoryAction').and.stub();
      bs_history_nav("action_delete.x");
      expect(search.submitSearchHistoryAction).toHaveBeenCalled();
    });
  });

  describe('bs_toggle_limits', () => {
    it('should act as an alias to search.toggleLimits()', () => {
      spyOn(search, 'toggleLimits').and.stub();
      bs_toggle_limits();
      expect(search.toggleLimits).toHaveBeenCalled();
    });
  });

});
