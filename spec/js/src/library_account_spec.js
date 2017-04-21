describe('libraryAccount', () => {

  it('should replace sublibrary codes with the location names', () => {
    expect($("#nyu50-header").html()).toEqual('<span id="nyu50-label">New York</span>');
    expect($("#nyu51-header").html()).toEqual('<span id="nyu51-label">Abu Dhabi</span>');
  });

});
