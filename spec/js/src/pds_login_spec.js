describe('pdsLogin', function(){

  it('should return hostname if not on aleph', function(){
    let hostName = { hostname: 'randomHostName' };
    spyOn(pdsLogin, 'location').and.returnValue(hostName);
    expect(pdsLogin.pdsUrl()).toBe(hostName.hostname);
  });

});
