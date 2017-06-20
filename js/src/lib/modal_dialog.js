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
      open: function(event, ui) {
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
  launchDialog(data, sharedModalD) {
    var feedbackText = $.trim($(data).children("div#feedbackbar p").text());
    var main = $(data).children("div#content div#main").get(0);
    var heading = $(main).find("h3").eq(0).remove();
    heading.find("span.subdue").remove();
    this.$sharedModalDialog.html(main);
    //Add title
    var $title = $("<h3>" + this.getTitleText() + "</h3>");
    this.$sharedModalDialog.find("div#main").eq(0).prepend($title);
    //Add feedback
    if (feedbackText.length > 0) {
      var feedback = $("<div class=\"feedback\">"+feedbackText+"</div>");
      //shared_modal_d.prepend(feedback);
      this.$sharedModalDialog.html(feedback);
    }
    var is_request_ill = this.$sharedModalDialog.data("is_request_ill");
    if(is_request_ill) {
      var doc_number = this.$sharedModalDialog.data("doc_number");
      var doc_library = this.$sharedModalDialog.data("doc_library");
      var $illItem = $(this.getIllItem(doc_number, doc_library));
      $(sharedModalD).find("div#main form ol#request_options").eq(0).append($illItem);
    }
    var is_available = this.$sharedModalDialog.data("is_available");
    var is_offsite = this.$sharedModalDialog.data("is_offsite");
    if(is_available || is_offsite) {
      var sub_library = this.$sharedModalDialog.data("sub_library");
      this.$sharedModalDialog.find("div#main span#sub_library").eq(0).replaceWith(sub_library);
    }
    this.$sharedModalDialog.dialog("option", "title", heading.text());
    this.$sharedModalDialog.dialog("open");
  },
  launchDialogOrRedirect(targetUrl, currentUrl, inputData) {
    var obj = this;
    $.get(targetUrl, inputData).done((data) => {
      // Check to see if we're logging into PDS.
      if (obj.isPdsLogin(data)) {
        // Grab the pds url and redirect
        location.replace(obj.pdsLoginUrl(data, currentUrl));
      } else {
        obj.launchDialog(data);
      }
    });
  },
  submitDialogForm(event) {
    var targetUrl = $(event.target).closest("form").attr("action");
    var inputData = $(event.target).closest("form").serialize();
    var currentUrl = window.location;
    var holding = new Holding(this, this.$sharedModalDialog);
    holding.extractAndSetData();
    this.$sharedModalDialog.dialog({close: function(event, ui) {location.reload();}});
    this.launchDialogOrRedirect(targetUrl, currentUrl, inputData);
  },
  loadDialogForm(event) {
    var targetUrl = event.target.href;
    var currentUrl = window.location;
    var holding = new Holding(this, this.$sharedModalDialog);
    holding.extractAndSetData();
    this.launchDialogOrRedirect(targetUrl, currentUrl);
  },
  init() {
    var obj = this;
    this.$sharedModalDialog = this.getSharedModalDialog();
    $("#holdings table#items td.links a").filter(function(){
      return $(this).text().match(/^Request$/);
    }).addClass("ajax_window");
  	$("#holdings table#items td.links a.ajax_window").click((event) => {
      obj.loadDialogForm(event);
  		return false;
  	});
    var submitForm = function(event) {
      obj.submitDialogForm(event);
      return false;
    }
  	$("form.modal_dialog_form input[type=submit]").live("click", submitForm);
  	$("form.modal_dialog_form").on('submit', submitForm);
  }
};
