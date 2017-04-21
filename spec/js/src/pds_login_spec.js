describe('pdsLogin', () => {

  describe('pdsUrl', () => {
    let hostName;

    beforeEach( () => {
      spyOn(pdsLogin, 'hostname').and.callFake( () => hostName );
    });

    it('should return hostname if not on aleph', function(){
      hostName = 'randomHostName';
      expect(pdsLogin.pdsUrl()).toBe(hostName);
    });

    it('should return pdsdev if on alephstage', () => {
      hostName = 'alephstage.library.nyu.edu';
      expect(/^https:\/\/pdsdev\.library\.nyu\.edu\/pds/.test(pdsLogin.pdsUrl())).toBe(true);
    });

    it('should return pds if on aleph production', () => {
      hostName = 'aleph.library.nyu.edu';
      expect(/^https:\/\/pds\.library\.nyu\.edu\/pds/.test(pdsLogin.pdsUrl())).toBe(true);
    });
  });

  describe('isLoggedIn', () => {
    let cookieValue;

    beforeEach( () => {
      spyOn(cookies, "get").and.callFake( (undefined) => cookieValue );
    });

    it('should return true if logged in', () => {
      cookieValue = true;
      expect(pdsLogin.isLoggedIn()).toBe(true);
    });

    it('should return false if not logged in', () => {
      cookieValue = false;
      expect(pdsLogin.isLoggedIn()).toBe(false);
    });
  });

  describe('redirectToPds', () => {
    beforeEach( () => {
      spyOn(location, 'replace').and.returnValue(true);
      pdsLogin.redirectToPds();
    });

    it('should redirect to the pds login url', () => {
      expect(location.replace.calls.any()).toBe(true);
    });
  });

  describe('passiveLogin', () => {
    let isLoggedIn, querystringFunc;

    beforeEach( () => {
      spyOn(pdsLogin, 'isLoggedIn').and.callFake( () => isLoggedIn );
      spyOn(querystring, 'get').and.callFake( (undefined) => querystringFunc );
      spyOn(pdsLogin, 'redirectToPds').and.returnValue(true);
    });

    it('should return if user is already logged in', () => {
      isLoggedIn = true;
      expect(pdsLogin.passiveLogin()).toBeUndefined();
    });

    it('should redturn to login if user is not logged in but the current page is not the holdings page', () => {
      isLoggedIn = false;
      querystringFunc = 'another-page';
      pdsLogin.passiveLogin();
      expect(pdsLogin.redirectToPds.calls.any()).toBe(false);
    });

    it('should redirect to login if user is not logged in and the current page is the holdings page', () => {
      isLoggedIn = false;
      querystringFunc = 'item-global';
      pdsLogin.passiveLogin();
      expect(pdsLogin.redirectToPds.calls.any()).toBe(true);
    });
  });

});
