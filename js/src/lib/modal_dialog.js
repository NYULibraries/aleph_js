const modalDialog = {
  pdsLoginRegex: /LoginPds/,
  pdsUrlRegex: /var url = '([^\?]*\?func=load-login\&calling_system=aleph\&institute=[^\&]*\&url=)/,
  isPdsLogin(data) {
    return this.pdsLoginRegex.test(data);
  },
  pdsLoginUrl(data, currentUrl) {
    return this.pdsUrlRegex.exec(data)[1] + encodeURIComponent(currentUrl);
  },
  getSharedModalDialog() {
    var $dialog = $("<div></div>")
    $dialog.dialog({
      autoOpen: false,
      modal: true,
      width: "40em",
      dialogClass: "shared_modal",
      open: (event, ui) => {
        $("select").first().focus();
      }
    });
    return $dialog;
  },
  getTitleText() {
    return $("#holdings table#bib td.fxxx").first().text();
  },
  getIllItem(docNumber, docLibrary) {
    var html = "\n";
  	html += "<li>\n";
  	html += "\t<a href=\"/F/?func=item-sfx&doc_library="+docLibrary+"&doc_number="+docNumber+"&local_base=PRIMOCOMMON\">Request this item from another library via Interlibrary Loan</a><br />\n";
  	html += "\tMost requests arrive within two weeks. Due dates and renewals are determined by the lending library.\n";
  	html += "\tArticle/chapter requests are typically delivered electronically in 3-5 days.\n";
  	html += "</li>\n";
  	return html;
  },
  populateMain(data) {
    var main = $(data).children("div#content div#main").get(0);
    var heading = $(main).find("h3").eq(0).remove();
    heading.find("span.subdue").remove();
    this.$sharedModalDialog.html(main);
    this.$sharedModalDialog.dialog("option", "title", heading.text());
  },
  addTitle() {
    var $title = $("<h3>" + this.getTitleText() + "</h3>");
    this.$sharedModalDialog.find("div#main").eq(0).prepend($title);
  },
  displayFeedback(data) {
    var feedbackText = $.trim($(data).children("div#feedbackbar p").text());
    if (feedbackText.length > 0) {
      var feedback = $("<div class=\"feedback\">"+feedbackText+"</div>");
      this.$sharedModalDialog.html(feedback);
    }
  },
  addIllItem() {
    var is_request_ill = this.$sharedModalDialog.data("is_request_ill");
    if (is_request_ill) {
      var doc_number = this.$sharedModalDialog.data("doc_number");
      var doc_library = this.$sharedModalDialog.data("doc_library");
      var $illItem = $(this.getIllItem(doc_number, doc_library));
      this.$sharedModalDialog.find("div#main form ol#request_options").eq(0).append($illItem);
    }
  },
  addSublibrary() {
    var is_available = this.$sharedModalDialog.data("is_available");
    var is_offsite = this.$sharedModalDialog.data("is_offsite");
    if(is_available || is_offsite) {
      var sub_library = this.$sharedModalDialog.data("sub_library");
      this.$sharedModalDialog.find("div#main span#sub_library").eq(0).replaceWith(sub_library);
    }
  },
  launchDialog(data) {
    this.populateMain(data);
    this.addTitle();
    this.displayFeedback(data);
    this.addIllItem();
    this.addSublibrary();
    this.bindSubmitToAjax();
    this.$sharedModalDialog.dialog("open");
  },
  launchDialogOrRedirect(targetUrl, currentUrl, inputData) {
    $.get(targetUrl, inputData).done((data) => {
      if (this.isPdsLogin(data)) {
        location.replace(this.pdsLoginUrl(data, currentUrl));
      } else {
        this.launchDialog(data);
      }
    });
  },
  submitDialogForm(event) {
    var targetUrl = $(event.currentTarget).attr("action");
    var inputData = $(event.currentTarget).serialize();
    var currentUrl = window.location;
    var holding = new Holding(event.currentTarget, this.$sharedModalDialog);
    holding.extractAndSetData();
    this.$sharedModalDialog.dialog({
      close: (event, ui) => { location.reload(); }
    });
    this.launchDialogOrRedirect(targetUrl, currentUrl, inputData);
  },
  loadDialogForm(event) {
    var targetUrl = event.currentTarget.href;
    var currentUrl = window.location;
    var holding = new Holding(event.currentTarget, this.$sharedModalDialog);
    holding.extractAndSetData();
    this.launchDialogOrRedirect(targetUrl, currentUrl);
  },
  bindClickToLaunch() {
    var obj = this;
    $("#holdings table#items td.links a").each(function() {
      if (!$(this).text().match(/^Request$/)) { return; }
      $(this).click((event) => {
        obj.loadDialogForm(event);
        return false;
      });
    });
  },
  bindSubmitToAjax() {
    $("form.modal_dialog_form").submit((event) => {
      this.submitDialogForm(event);
      return false;
    });
  },
  init() {
    this.$sharedModalDialog = this.getSharedModalDialog();
    this.bindClickToLaunch();
  }
};
