describe('modalDialog', () => {
  var origSharedModalDialog;

  beforeEach(() => {
    origSharedModalDialog = modalDialog.$sharedModalDialog;
  });

  afterEach(() => {
    modalDialog.$sharedModalDialog = origSharedModalDialog;
  })

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

  describe('populateMain', () => {
    var data, htmlSpy;

    beforeEach(() => {
      data = "<body><div id=\"content\"><div id=\"main\"><h3>My Header<span class=\"subdue\">Remove Me</span></h3><p>My Content</p></div></div></body>"
      htmlSpy = spyOn(modalDialog.$sharedModalDialog, 'html');
      spyOn(modalDialog.$sharedModalDialog, 'dialog');
    });

    it('should populate modal with #main', () => {
      modalDialog.populateMain(data);
      expect(modalDialog.$sharedModalDialog.html).toHaveBeenCalled();
      expect($(htmlSpy.calls.mostRecent().args[0]).html()).toEqual("<p>My Content</p>")
      expect(modalDialog.$sharedModalDialog.dialog).toHaveBeenCalledWith("option", "title", "My Header");
    });
  });

  describe('addTitle', () => {
    beforeEach(() => {
      spyOn(modalDialog, 'getTitleText').and.returnValue("My Title");
      modalDialog.$sharedModalDialog = $('<div class="modal"><div id="main"><p>Hello</p></div></div>');
    });

    it('should add title to modal dialog', () => {
      modalDialog.addTitle();
      expect(modalDialog.$sharedModalDialog.html()).toEqual(('<div id="main"><h3>My Title</h3><p>Hello</p></div>'));
    });
  });

  describe('displayFeedback', () => {
    var data;

    describe('when data includes feedback', () => {
      beforeEach(() => {
        data = '<body><div id="feedbackbar"><p>  Some feedback    </p></div></body>';
      });

      it('should replace shared modal with feedback', () => {
        modalDialog.displayFeedback(data);
        expect(modalDialog.$sharedModalDialog.html()).toEqual('<div class="feedback">Some feedback</div>');
      });
    });

    describe("when data doesn't include feedback", () => {
      beforeEach(() => {
        data = '<body>Something else</body>';
      });

      it('should replace shared modal with feedback', () => {
        var origSharedModalHtml = modalDialog.$sharedModalDialog.html();
        modalDialog.displayFeedback(data);
        expect(modalDialog.$sharedModalDialog.html()).toEqual(origSharedModalHtml);
      });
    });
  });

  describe('addIllItem', () => {
    describe('if shared modal has ILL data', () => {
      beforeEach(() => {
        modalDialog.$sharedModalDialog = $('<div class="modal" data-is_request_ill="true" data-doc_number="123" data-doc_library="abc"><div id="main"><form><ol id="request_options"><li>Existing item</li></ol></form></div></div>');
        spyOn(modalDialog, 'getIllItem').and.returnValue('<li>New item</li>');
      });

      it('should append ILL item', () => {
        modalDialog.addIllItem();
        expect(modalDialog.getIllItem).toHaveBeenCalledWith(123, 'abc');
        expect(modalDialog.$sharedModalDialog.html()).toEqual('<div id="main"><form><ol id="request_options"><li>Existing item</li><li>New item</li></ol></form></div>')
      });
    });

    describe("if shared modal doesn't have ILL data", () => {
      beforeEach(() => {
        modalDialog.$sharedModalDialog = $('<div class="modal"><div id="main"><form><ol id="request_options"><li>Existing item</li></ol></form></div></div>');
        spyOn(modalDialog, 'getIllItem').and.returnValue('<li>New item</li>');
      });

      it('should append ILL item', () => {
        var origSharedModalHtml = modalDialog.$sharedModalDialog.html();
        modalDialog.addIllItem();
        expect(modalDialog.getIllItem).not.toHaveBeenCalled();
        expect(modalDialog.$sharedModalDialog.html()).toEqual(origSharedModalHtml);
      });
    });
  });

  describe('addSublibrary', () => {
    describe("if shared modal has truthy available data", () => {
      beforeEach(() => {
        modalDialog.$sharedModalDialog = $('<div class="modal" data-is_available="true" data-is_offsite="false" data-sub_library="ISAW"><div id="main"><span>Ignore me</span><span id="sub_library">Bobst</span></div></div>');
      });

      it("should add to correct span", () => {
        modalDialog.addSublibrary();
        expect(modalDialog.$sharedModalDialog.html()).toEqual('<div id="main"><span>Ignore me</span>ISAW</div>')
      });
    });

    describe("if shared modal has truthy offsite data", () => {
      beforeEach(() => {
        modalDialog.$sharedModalDialog = $('<div class="modal" data-is_available="false" data-is_offsite="true" data-sub_library="ISAW"><div id="main"><span>Ignore me</span><span id="sub_library">Bobst</span></div></div>');
      });

      it("should add to correct span", () => {
        modalDialog.addSublibrary();
        expect(modalDialog.$sharedModalDialog.html()).toEqual('<div id="main"><span>Ignore me</span>ISAW</div>')
      });
    });

    describe("if shared modal has falsy available offsite data", () => {
      beforeEach(() => {
        modalDialog.$sharedModalDialog = $('<div class="modal" data-is_available="false" data-is_offsite="false"><div id="main"><span>Ignore me</span><span id="sub_library">Bobst</span></div></div>');
      });

      it("should add to correct span", () => {
        var origSharedModalHtml = modalDialog.$sharedModalDialog.html();
        modalDialog.addSublibrary();
        expect(modalDialog.$sharedModalDialog.html()).toEqual(origSharedModalHtml)
      });
    });

    describe("if shared modal doesn't have available offsite data", () => {
      beforeEach(() => {
        modalDialog.$sharedModalDialog = $('<div class="modal"><div id="main"><span>Ignore me</span><span id="sub_library">Bobst</span></div></div>');
      });

      it("should add to correct span", () => {
        var origSharedModalHtml = modalDialog.$sharedModalDialog.html();
        modalDialog.addSublibrary();
        expect(modalDialog.$sharedModalDialog.html()).toEqual(origSharedModalHtml)
      });
    });
  });

  describe('launchDialog', () => {
    var data;

    beforeEach(() => {
      data = "Some data";
      spyOn(modalDialog, 'populateMain');
      spyOn(modalDialog, 'addTitle');
      spyOn(modalDialog, 'displayFeedback');
      spyOn(modalDialog, 'addIllItem');
      spyOn(modalDialog, 'addSublibrary');
      spyOn(modalDialog, 'bindSubmitToAjax');
      spyOn(modalDialog.$sharedModalDialog, 'dialog');
    });

    it("should call all correct methods", () => {
      modalDialog.launchDialog(data);
      expect(modalDialog.populateMain).toHaveBeenCalledWith(data);
      expect(modalDialog.addTitle).toHaveBeenCalledWith();
      expect(modalDialog.displayFeedback).toHaveBeenCalledWith(data);
      expect(modalDialog.addIllItem).toHaveBeenCalledWith();
      expect(modalDialog.addSublibrary).toHaveBeenCalledWith();
      expect(modalDialog.bindSubmitToAjax).toHaveBeenCalledWith();
      expect(modalDialog.$sharedModalDialog.dialog).toHaveBeenCalledWith("open");
    });
  });

  describe('launchDialogOrRedirect', () => {
    var targetUrl, currentUrl, inputData, data, getPromise;

    beforeEach(() => {
      targetUrl = "alephstage.library.nyu.edu/endpoint";
      currentUrl = "alephstage.library.nyu.edu/home";
      inputData = "Inputted data";
      data = "Some data";
    });

    describe('if GET is successful', () => {
      beforeEach(() => {
        getPromise = {
          done: (callback) => { callback(data); }
        };
        spyOn($, 'get').and.returnValue(getPromise);
      });

      describe('and response is PDS redirect', () => {
        var redirectUrl;

        beforeEach(() => {
          redirectUrl = "http://example.com";
          spyOn(modalDialog, 'isPdsLogin').and.returnValue(true);
          spyOn(modalDialog, 'pdsLoginUrl').and.returnValue(redirectUrl);
          spyOn(location, 'replace');
        })

        it("should redirect via location.replace", () => {
          modalDialog.launchDialogOrRedirect(targetUrl, currentUrl, inputData);
          expect($.get).toHaveBeenCalledWith(targetUrl, inputData)
          expect(modalDialog.isPdsLogin).toHaveBeenCalledWith(data);
          expect(modalDialog.pdsLoginUrl).toHaveBeenCalledWith(data, currentUrl);
          expect(location.replace).toHaveBeenCalledWith(redirectUrl);
        });
      });

      describe('and response is not redirect', () => {
        beforeEach(() => {
          spyOn(modalDialog, 'launchDialog');
        })

        it("should launch dialog with data", () => {
          modalDialog.launchDialogOrRedirect(targetUrl, currentUrl, inputData);
          expect(modalDialog.launchDialog).toHaveBeenCalledWith(data);
        });
      });
    });

    describe('if GET is unsuccessful', () => {
      beforeEach(() => {
        getPromise = {
          done: (callback) => { return; }
        };
      });

      pending();
    });
  });

  describe('submitDialogForm', () => {
    var submitEvent, form, mockHolding;

    beforeEach(() => {
      form = $('#form-submit-test').get(0);
      submitEvent = {};
      submitEvent.currentTarget = form;
      mockHolding = new Holding();
      spyOn(window, 'Holding').and.returnValue(mockHolding);
      spyOn(mockHolding, 'extractAndSetData');
      spyOn(modalDialog, 'launchDialogOrRedirect').and.returnValue(true);
      spyOn(modalDialog.$sharedModalDialog, 'dialog');
    });

    it("should launchDialogOrRedirect", () => {
      modalDialog.submitDialogForm(submitEvent);
      expect(modalDialog.launchDialogOrRedirect).toHaveBeenCalledWith('/some/path', jasmine.anything(), $(form).serialize());
      expect(modalDialog.launchDialogOrRedirect.calls.mostRecent().args[1]).toMatch(/^http:\/\/localhost:\d+\/\d+\/holdings\.html$/)
      expect(Holding).toHaveBeenCalledWith(form, modalDialog.$sharedModalDialog);
      expect(mockHolding.extractAndSetData).toHaveBeenCalledWith();
      expect(modalDialog.$sharedModalDialog.dialog).toHaveBeenCalledWith({close: jasmine.any(Function)});
    })
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
          $(".submit-to-click").click();
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
