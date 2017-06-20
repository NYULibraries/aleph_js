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

  describe('getSharedModalDialog', () => {
    var $mockDialog, originalDollar;

    beforeEach(() => {
      $mockDialog = $('<div></div>');
      spyOn($mockDialog, 'dialog');
      originalDollar = $
      $ = jasmine.createSpy("dollar").and.returnValue($mockDialog);
    });

    afterEach(() => {
      $ = originalDollar;
    })

    it('should initialize jquery object correctly', () => {
      expect(modalDialog.getSharedModalDialog()).toEqual($mockDialog);
      expect($).toHaveBeenCalledWith("<div></div>");
      expect($mockDialog.dialog).toHaveBeenCalledWith(({
        autoOpen: false,
        modal: true,
        width: "40em",
        dialogClass: "shared_modal",
        open: jasmine.any(Function)
      }));
    });
  });

  describe('getTitleText', () => {
    it('should return correct value from DOM', () => {
      expect(modalDialog.getTitleText()).toEqual(' Husihui.:          ');
    })
  });

  describe('getIllItem', () => {
    var docNumber, docLibrary, originalDollar;
    const illRegexp = /^\s*<li>\s+<a href="\/F\/\?func=item-sfx&doc_library=Bobst&doc_number=123456&local_base=PRIMOCOMMON">Request this item from another library via Interlibrary Loan<\/a><br\s*\/>\s*Most requests arrive within two weeks. Due dates and renewals are determined by the lending library\.\s*Article\/chapter requests are typically delivered electronically in 3-5 days\.\s*<\/li>\s*$/;

    beforeEach(() => {
      docNumber = '123456';
      docLibrary = 'Bobst';
    })

    it('should generate HTML string correctly', () => {
      expect(modalDialog.getIllItem(docNumber, docLibrary)).toMatch(illRegexp);
    });
  });

  describe('init', () => {
    describe('when response requires redirect', () => {
      var redirectUrlRegex;

      beforeEach(() => {
        redirectUrlRegex = /^https:\/\/pdsdev\.library\.nyu\.edu:443\/pds\?func=load-login&calling_system=aleph&institute=NYU&url=http%3A%2F%2Flocalhost%3A\d+%2F\d+%2Fholdings.html$/;
        spyOn(location, 'replace')
      })

      it('should send to login instead', (done) => {
        $('.redirect-request-to-click').click();
        // wait for GET
        setTimeout(function(){
          expect(location.replace).toHaveBeenCalled();
          expect(location.replace.calls.mostRecent().args[0]).toMatch(redirectUrlRegex);
          done();
        }, 50);
      });
    });

    describe('when no redirect required', () => {
      beforeEach(() => {
        spyOn(modalDialog, 'isPdsLogin').and.returnValue(false);
      })

      it('should open modal when clicked', (done) => {
        $('.request-to-click').click();
        // wait for GET
        setTimeout(() => {
          expect($('.ui-dialog').is(":visible")).toEqual(true);
          expect($('.ui-dialog .ui-dialog-title').text()).toMatch(/^Request this item for Alter, Barnaby\s+$/);
          // submit form to test handling
          $("form.modal_dialog_form input[type=submit]").click();
          setTimeout(() => {
            expect($('.ui-dialog').is(":visible")).toEqual(true);
            expect($(".comfirm-request-to-click").val()).toMatch(/^Confirm request$/);
            // submit confirmation
            $(".comfirm-request-to-click").click();
            setTimeout(() => {
              expect($('.ui-dialog').is(":visible")).toEqual(true);
              expect($('.ui-dialog').text()).toMatch(/Item has been requested for pickup at NYU Bobst/)
              done();
            }, 50)
          }, 50)
        }, 50);
      });
    })
  });
});
