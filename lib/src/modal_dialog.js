const modalDialog = {
  launchDialog(sharedModalDialog, targetUrl, currentUrl, inputData) {
    $.get(targetUrl, inputData, (data, textStatus, xmlHttpRequest) => {
      const feedbackText = $.trim($(data).children("div#feedbackbar p").text());
      const $main = $(data).children("div#content div#main").get(0);
      const $heading = $(main).find("h3").eq(0).remove();
      $heading.find("span.subdue").remove();
      sharedModalDialog.html($main);
      // Add title
      const title = $("#holdings table#bib td.fxxx").first().text();
      $(sharedModalDialog).find("div#main").eq(0).prepend($(htmlHelpers.render({ tag: "h3", value: title}));
    });
  }
};
function bs_modal_dialog(shared_modal_d, target_url, current_url, input_data) {
	jQuery.get(target_url, input_data, function(data, textStatus, xmlHttpRequest) {
		// Check to see if we're logging into PDS.
		var pds_login_regex = /LoginPds/;
		if (pds_login_regex.test(data)) {
			// Grab the pds url and redirect
			var pds_url_regex = /var url = '([^\?]*\?func=load-login\&calling_system=aleph\&institute=[^\&]*\&url=)/;
			var pds_url = pds_url_regex.exec(data)[1] + encodeURIComponent(current_url);
			location.replace(pds_url);
		} else {
			var feedback_text = jQuery.trim(jQuery(data).children("div#feedbackbar p").text());
			var main = jQuery(data).children("div#content div#main").get(0);
            var heading = jQuery(main).find("h3").eq(0).remove();
			heading.find("span.subdue").remove();
			shared_modal_d.html(main);
			//Add title
			var title = jQuery("#holdings table#bib td.fxxx").first().text();
			jQuery(shared_modal_d).find("div#main").eq(0).prepend(jQuery("<h3>"+title+"</h3>"));
			//Add feedback
			if (feedback_text.length > 0) {
				var feedback = jQuery("<div class=\"feedback\">"+feedback_text+"</div>");
				//shared_modal_d.prepend(feedback);
				shared_modal_d.html(feedback);
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
		}
	});
}
