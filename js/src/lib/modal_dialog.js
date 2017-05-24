//INCOMPLETE
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
    var feedbackText = $.trim($(data).children("div#feedbackbar p").text());
    var main = $(data).children("div#content div#main").get(0);
    var heading = $(main).find("h3").eq(0).remove();
    heading.find("span.subdue").remove();
    sharedModalD.html(main);
    //Add title
    var title = jQuery("#holdings table#bib td.fxxx").first().text();
    $(sharedModalD).find("div#main").eq(0).prepend(jQuery("<h3>"+title+"</h3>"));
    //Add feedback
    if (feedbackText.length > 0) {
      var feedback = $("<div class=\"feedback\">"+feedback_text+"</div>");
      //shared_modal_d.prepend(feedback);
      sharedModalD.html(feedback);
    }
    var is_request_ill = jQuery.data(shared_modal_d, "is_request_ill");
    if(is_request_ill) {
      var doc_number = jQuery.data(shared_modal_d, "doc_number");
      var doc_library = jQuery.data(shared_modal_d, "doc_library");
      jQuery(shared_modal_d).find("div#main form ol#request_options").eq(0).append(jQuery(bs_ill_item(doc_number, doc_library)));
    }
    var is_available = jQuery.data(shared_modal_d, "is_available");
    var is_offsite = jQuery.data(shared_modal_d, "is_offsite");
    if(is_available || is_offsite) {
        var sub_library = jQuery.data(shared_modal_d, "sub_library");
      jQuery(shared_modal_d).find("div#main span#sub_library").eq(0).replaceWith(sub_library);
    }
          jQuery(shared_modal_d).dialog("option", "title", heading.text());
    jQuery(shared_modal_d).dialog("open");
  },
  launchDialogOrRedirect(sharedModalDialog, targetUrl, currentUrl, inputData) {
    $.get(targetUrl, inputData, function(data, textStatus, xmlHttpRequest) {
      // Check to see if we're logging into PDS.
      if (this.isPdsLogin(data)) {
        // Grab the pds url and redirect
        location.replace(this.pdsLoginUrl(data, currentUrl));
      } else {

      }
    });
  }
};
