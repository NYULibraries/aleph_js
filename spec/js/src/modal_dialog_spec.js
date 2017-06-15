describe('modalDialog', () => {
  describe('pdsLoginRegex', () => {
    it('should work', () => {
      expect(modalDialog.pdsLoginRegex).toEqual(/LoginPds/);
    });
  });

  describe('isPdsLogin', () => {
    it('should return true when matching', () => {
      expect(modalDialog.isPdsLogin("somethingLoginPdssomething")).toEqual(true);
    });

    it('should return false when not matching', () => {
      expect(modalDialog.isPdsLogin("somethingloginpdssomething")).toEqual(false);
    });

    it('should return false for null', () => {
      expect(modalDialog.isPdsLogin(null)).toEqual(false);
    });
  });

  describe('pdsLoginUrl', () => {
    var responseData, url, currentUrl;

    beforeEach(() => {
      url = 'https://pdsdev.library.nyu.edu:443/pds?func=load-login&calling_system=aleph&institute=NYU&url=https://alephstage.library.nyu.edu/F/N88QMT7G36GIA5D9DUBQ93L448566J5K6XPRFHHJYQH8N1I14F-00420?func=item-hold-request&amp;doc_library=NYU50&amp;adm_doc_number=001816252&amp;item_sequence=000020&amp;year=&amp;volume=&amp;sub_library=BOBST&amp;type=&amp;no_loaned=N&amp;start_rec_key=&amp;end_rec_key=';
      responseData = "<html>\n\r<script> \n\r<!--\n\r var debug =0 ; \n\rfunction LoginPds() {\n\rvar url = '"+url+"';\n\rif (debug == 1) alert (url);\n\rwindow.location = url;\n\r}\n\r//-->\n\r</script>\n\r<body onload = \"LoginPds()\"></body>\n\r</html> ";
      currentUrl = 'https://alephstage.library.nyu.edu/F/3ILGX8QRRBMU8F2K17T7ALQG99JC1GQSXUJR4CTIDAC7KS2B2C-00007?func=item-global&amp=&amp=&amp=&amp=&amp=&amp=&amp=&amp=&amp=&amp=&amp=&amp=&amp=&doc_library=NYU01&local_base=PRIMOCOMMON&doc_number=001816252&sub_library=BOBST&&pds_handle=9620171334354316065422926601935';
    });

    it('should return correct result', () => {
      expect(modalDialog.pdsLoginUrl(responseData, currentUrl)).toEqual("https://pdsdev.library.nyu.edu:443/pds?func=load-login&calling_system=aleph&institute=NYU&url=" + encodeURIComponent(currentUrl));
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
