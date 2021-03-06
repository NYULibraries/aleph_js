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
      spyOn(redirect, 'windowReplace').and.returnValue(true);
      pdsLogin.redirectToPds();
    });

    it('should redirect to the pds login url', () => {
      expect(redirect.windowReplace).toHaveBeenCalled();
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

    it('should return to login if user is not logged in but the current page is not the holdings page', () => {
      isLoggedIn = false;
      querystringFunc = 'another-page';
      pdsLogin.passiveLogin();
      expect(pdsLogin.redirectToPds).toHaveBeenCalledTimes(0);
    });

    it('should redirect to login if user is not logged in and the current page is the holdings page', () => {
      isLoggedIn = false;
      querystringFunc = 'item-global';
      pdsLogin.passiveLogin();
      expect(pdsLogin.redirectToPds).toHaveBeenCalled();
    });
  });

  describe('addLoginButton', () => {
    beforeEach( () => {
      spyOn(pdsLogin, 'hostname').and.returnValue('alephstage');
    });
    describe('when user IS NOT already logged in', () => {
      it('should append pds login button to the header', () => {
        expect($('#pds-login-button').html()).toEqual('Login');
        expect($('#pds-login-button').attr('href')).toEqual('localhost');
      });
    });
    describe('when user IS already logged in', () => {
      beforeEach( () => {
        spyOn(pdsLogin, 'isLoggedIn').and.returnValue(true);
      });
      xit('should append pds login button to the header', () => {
        expect($('#pds-login-button').length).toEqual(0);
      });
    });
  });

});
