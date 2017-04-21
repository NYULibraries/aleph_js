describe('pdsLogin', () => {

  describe('pdsUrl', () => {
    it('should return hostname if not on aleph', function(){
      let hostName = { hostname: 'randomHostName' };
      spyOn(pdsLogin, 'location').and.returnValue(hostName);
      expect(pdsLogin.pdsUrl()).toBe(hostName.hostname);
    });

    it('should return pdsdev if on alephstage', () => {
      let hostName = { hostname: 'alephstage.library.nyu.edu' };
      spyOn(pdsLogin, 'location').and.returnValue(hostName);
      expect(pdsLogin.pdsUrl()).toStartWith("https://pdsdev.library.nyu.edu/pds");
    });

  });

});
