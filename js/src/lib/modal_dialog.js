const modalDialog = {
  pdsLoginRegex: /LoginPds/,
  pdsUrlRegex: /var url = '([^\?]*\?func=load-login\&calling_system=aleph\&institute=[^\&]*\&url=)/,
  isPdsLogin(data) {
    return this.pdsLoginRegex.test(data);
  },
  pdsLoginUrl(data, currentUrl) {
    return this.pdsUrlRegex.exec(data)[1] + encodeURIComponent(currentUrl);
  },
  launchDialog(data, sharedModalD) {
    var $sharedModalD = $(sharedModalD);
    var feedbackText = $.trim($(data).children("div#feedbackbar p").text());
    var main = $(data).children("div#content div#main").get(0);
    var heading = $(main).find("h3").eq(0).remove();
    heading.find("span.subdue").remove();
    $sharedModalD.html(main);
    //Add title
    var title = jQuery("#holdings table#bib td.fxxx").first().text();
    $(sharedModalD).find("div#main").eq(0).prepend(jQuery("<h3>"+title+"</h3>"));
    //Add feedback
    if (feedbackText.length > 0) {
      var feedback = $("<div class=\"feedback\">"+feedbackText+"</div>");
      //shared_modal_d.prepend(feedback);
      $sharedModalD.html(feedback);
    }
    var is_request_ill = $sharedModalD.data("is_request_ill");
    if(is_request_ill) {
      var doc_number = $sharedModalD.data("doc_number");
      var doc_library = $sharedModalD.data("doc_library");
      $(sharedModalD).find("div#main form ol#request_options").eq(0).append(jQuery(bs_ill_item(doc_number, doc_library)));
    }
    var is_available = $sharedModalD.data("is_available");
    var is_offsite = $sharedModalD.data("is_offsite");
    if(is_available || is_offsite) {
      var sub_library = $sharedModalD.data("sub_library");
      $sharedModalD.find("div#main span#sub_library").eq(0).replaceWith(sub_library);
    }
    $sharedModalD.dialog("option", "title", heading.text());
    $sharedModalD.dialog("open");
  },
  launchDialogOrRedirect(sharedModalDialog, targetUrl, currentUrl, inputData) {
    $.get(targetUrl, inputData, function(data, textStatus, xmlHttpRequest) {
      // Check to see if we're logging into PDS.
      if (this.isPdsLogin(data)) {
        // Grab the pds url and redirect
        location.replace(this.pdsLoginUrl(data, currentUrl));
      } else {
        this.launchDialog(data, sharedModalD);
      }
    });
  },
  init() {
    var shared_modal_d = $("<div></div>").dialog({autoOpen: false, modal: true, width: "40em", dialogClass: "shared_modal", open: function(event, ui) { $("select").first().focus(); }}) ;
    $("#holdings table#items td.links a").filter(function(){
      return jQuery(this).text().match(/^Request$/);
    }).addClass("ajax_window");
  	$("#holdings table#items td.links a.ajax_window").live("click", function(event) {
  		var target_url = this.href;
  		var current_url = window.location;
      var holding = new Holding(this, shared_modal_d);
      holding.extractAndSetData();
  		launchDialogOrRedirect(shared_modal_d, target_url, current_url);
  		return false;
  	});
  	$("form.modal_dialog_form input[type=submit]").live("click", function(event) {
  		var target_url = jQuery(event.target).closest("form").attr("action");
  		var input_data = jQuery(event.target).closest("form").serialize();
  		var current_url = window.location;
      var holding = new Holding(this, shared_modal_d);
      holding.extractAndSetData();
  		jQuery(shared_modal_d).dialog({close: function(event, ui) {location.reload();}});
  		launchDialogOrRedirect(shared_modal_d, target_url, current_url, input_data);
  		return false;
  	});
  	$("form.modal_dialog_form").live( "submit", function(event) {
  		var target_url = jQuery(event.target).closest("form").attr("action");
  		var input_data = jQuery(event.target).closest("form").serialize();
  		var current_url = window.location;
      var holding = new Holding(this, shared_modal_d);
      holding.extractAndSetData();
  		$(shared_modal_d).dialog({close: function(event, ui) {location.reload();}});
  		launchDialogOrRedirect(shared_modal_d, target_url, current_url, input_data);
  		return false;
  	});
  }
};
