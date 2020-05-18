describe('utils', () => {
  describe('ill', () => {

    beforeEach( () => {
      spyOn(redirect, 'windowReplace').and.stub();
    });

    describe('url', () => {
      it('should give the internal url to redirect to illiad', () => {
        expect(ill.url("BOBST", "1234")).toEqual('/F/?func=item-sfx&doc_library=BOBST&doc_number=1234&local_base=PRIMOCOMMON');
      });
    });

    describe('redirectToIll', () => {
      it('should give the internal url to redirect to illiad', () => {
        ill.redirectToIll("BOBST", "1234");
        expect(redirect.windowReplace).toHaveBeenCalled();
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

  describe('cookies', () => {
    const key = 'key';
  
    beforeEach(function deleteAllCookies() {
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      });
    });
  
    it('should be able to set a default value of 1', function(){
      let value = '1';
      cookies.set(key);
      expect(document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')[2]).toBe(value);
    });
  
    it('should be able to set a custom value', function(){
      let value = 'custom';
      cookies.set(key, value);
      expect(document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')[2]).toBe(value);
    });
  
    it('should be able to get a cookie that has been set', function(){
      let value = '1';
      cookies.set(key);
      expect(cookies.get(key)).toBe(value);
    });
  
    it('should not be able to get a cookie that has not been set', function(){
      expect(cookies.get('unknownKey')).toBe(null);
    });
  });
  
});
