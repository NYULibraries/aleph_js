var AlephInit = {};
//window.location.replace("http://library.nyu.edu/errors/bobcatstandard-library-nyu-edu/")
var ezProxyPrefix = {"BWEB": "https://ezproxy.library.nyu.edu/login?url=", "NWEB": "https://ezproxy.library.nyu.edu/login?url=", "CU": "http://proxy.library.cooper.edu:2048/login?url=", "TWEB": "https://login.libproxy.newschool.edu/login?url=", "WEB": "", "NYSID": "http://plibrary.nysid.edu/login?url="};
var restrictedSublibraries = ["BWEB", "CU", "TWEB", "NWEB", "NYSID"];

//Initialize page after it has been loaded.
function bs_init() {
	jQuery(document).ready(function() {
		//Handle full page styling
		bs_set_full_format();
		//Handle bib info when appropriate
		bs_format_bib();
		//Handle holdings when appropriate
		bs_format_holdings();
		//Handle items when appropriate
		bs_format_items();
		//Handle patrons when appropriate
		bs_process_patron_activites();
		// Instatiate the shared modal dialog
	    var shared_modal_d = jQuery("<div></div>").dialog({autoOpen: false, modal: true, width: "40em", dialogClass: "shared_modal", open: function(event, ui) { jQuery("select").first().focus(); }}) ;
		// Attach ajax modal window to request links
		bs_ajax_window(shared_modal_d);
		// Handle booking related events
		bs_process_booking();
	});
}

//Add IDsCalled on initialize
function bs_process_patron_activites () {
	jQuery("#pindex #activities td.td1").filter(function() {return jQuery(this).html().match(/^NYU50$/i);}).html("<span id=\"nyu50-Label\">New York</span>");
	jQuery("#pindex #activities td.td1").filter(function() {return jQuery(this).html().match(/^NYU51$/i);}).html("<span id=\"nyu51-Label\">Abu Dhabi</span>");
}

function patron_logout (anchor) {
	if (confirm('Are you sure you want to logout of the patron module? ')){return true;} else {return false;};
}

//Show/hide the limits in search form
function bs_toggle_limits () {
	jQuery("#showlimits").toggle();
	jQuery("#hidelimits").toggle();
	jQuery("#limits").toggle();
}

//Set the nav action hidden element and submit the form.
function bs_history_nav(action) {
	jQuery("#nav_action").attr("name", action);
	jQuery("#nav_form").submit();
	return false;
}

//Set format id for styling; called on initialize
function bs_set_full_format () {
	var id = "f999";
	if (jQuery.query.get("format")) {
		id = "f"+jQuery.query.get("format");
	}
	jQuery("#format").attr("id", id);
}


function bs_request_ill(doc_library, doc_number) {
	location.replace("/F/?func=item-sfx&doc_library="+doc_library+"&doc_number="+doc_number+"&local_base=PRIMOCOMMON");
}

function bs_send_broken_link(anchor) {
	// Grab the saved data
	var aleph_id = jQuery(anchor).next("a").attr("id");
	var aleph_url = encodeURIComponent(jQuery(anchor).next("a").attr("href"));
	// Load text that says we're sending the broken link info
	var wrapper = jQuery(anchor).closest("span");
	wrapper.html('[<span class="sending"><em>Sending...</em></span>]');
	// Make the ajax call
	new jQuery.get(
		"/cgi-bin/broken.pl",
		"aleph_id=" + aleph_id + "&aleph_url=" + aleph_url,
		function(data, text_status, xml_http_request) {
			wrapper.html('['+ data +']');
		}
	);
}

function bs_process_booking() {
	// Enable datepicker
	var dates = jQuery("#book #start_date, #book #end_date").datepicker({
		dateFormat: 'yy/mm/dd',
		minDate: 0,
		showOn: "both",
		buttonImage: "/bobcat/images/cal.gif",
		buttonImageOnly: true,
		onSelect: function(selectedDate) {
			if(jQuery(this).data("hours")[jQuery(this).datepicker("getDate").getDay()] != "Closed") {
				var hour1 = (this.id == "start_date") ? jQuery("#book #start_hour") : jQuery("#book #end_hour");
				var hour2 = (this.id == "start_date") ? jQuery("#book #end_hour") : jQuery("#book #start_hour");
				var instance = jQuery(this).data("datepicker");
				var date1 = jQuery.datepicker.parseDate(instance.settings.dateFormat || jQuery.datepicker._defaults.dateFormat, selectedDate, instance.settings);
				hour1.val(jQuery(this).data("hours")[jQuery(this).datepicker("getDate").getDay()]);
				if (this.id == "start_date") date1.setDate(date1.getDate() + loanDays);
				if (this.id == "end_date") date1.setDate(date1.getDate() - loanDays);
				if (this.id == "start_date" || admLibrary == "NYU50") {
					dates.not(this).datepicker("setDate", date1);
					hour2.val(dates.not(this).data("hours")[dates.not(this).datepicker("getDate").getDay()]);
					if (admLibrary == "NYU51") {
						dates.not(this).datepicker("option", {maxDate: date1});
					}
				}
			}
			var form = jQuery(this).closest("form");
			jQuery(form).validate().element(this);
		}
	});

	// Initialize vars
	var instance = jQuery("#book #start_date").data("datepicker");
	var format = instance.settings.dateFormat || jQuery.datepicker._defaults.dateFormat;
	var admLibrary = jQuery('input[name="adm_library"]').val();

	// Form validation
	jQuery("#book #start_date, #book #end_date").addClass("closed");
	jQuery.validator.addMethod("closed", function(value, element) { return jQuery(element).data("hours")[jQuery(element).datepicker("getDate").getDay()] != "Closed" }, "The library is closed on the day selected.");
	jQuery.validator.addMethod("hour", function(value, element) { return this.optional(element) || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value); }, "Please enter a valid hour.");
	var form = jQuery("#book #start_date").closest("form");
	jQuery(form).validate({
		start_date: {required: true, dateISO: true},
		end_date: {required: true, dateISO: true},
		start_hour: {required: true},
		end_hour: {required: true},
		pickup_location: {required: true},
		errorPlacement: function(error, element) {element.before(error);},
		submitHandler: function(form) {bs_booking_submit(form);}
	});
	jQuery("#book #start_date, #book #end_date").attr("readonly", true);

	// Store hours in jQuery data
	if(admLibrary == "NYU50") {
		jQuery("#book #start_date").data("hours", ["12:00", "09:00", "09:00", "09:00", "09:00", "09:00", "12:00"]);
		jQuery("#book #end_date").data("hours", ["19:45", "22:45", "22:45", "22:45", "22:45", "18:45", "19:45"]);
		//jQuery("#book #end_date").datepicker("option", {buttonImage: '', buttonImageOnly: false});
		//jQuery("#book #end_date").datepicker("disable");
		//jQuery("#book #end_date").closest("form").submit(function(event) {jQuery("#book #end_date").datepicker("enable");});
	} else {
		jQuery("#book #start_date").data("hours", ["08:00", "08:00", "08:00", "08:00", "08:00", "14:00", "14:00"]);
		jQuery("#book #end_date").data("hours", ["22:30", "22:30", "22:30", "22:30", "18:00", "18:00", "22:30"]);
	}

	// Set default start and end dates
	jQuery("#book #start_date").datepicker("setDate", jQuery.datepicker.formatDate(format, new Date(), instance.settings));
	jQuery("#book #end_date").datepicker("setDate", "+"+loanDays+"d");
	jQuery("#book #start_date, #book #end_date").datepicker("option", "minDate", jQuery("#book #start_date").datepicker("getDate"));

	// Set default start and end hours
	jQuery("#book #start_hour").val(jQuery("#book #start_date").data("hours")[jQuery("#book #start_date").datepicker("getDate").getDay()]);
	//jQuery("#book #end_hour").val(jQuery("#book #end_date").data("hours")[jQuery("#book #end_date").datepicker("getDate").getDay()]);
	// Calculate initial end hour with some math
	var da = dueHour.split(" ");
	var dt = da[0];
	var dp = da[1];
	var dta = dt.split(":");
	var dh = parseInt(dta[0]);
	var dm = dta[1];
	if (dp == "PM") {
		dh = dh + 12;
	}
	dt = dh + ":" + dm;
	jQuery("#book #end_hour").val(dt);

	// Update confirmation heading
	var bookingMessage = (admLibrary == "NYU50")? "For questions about AFC bookings, please email afcbookings@library.nyu.edu." : "For questions about NYU Abu Dhabi bookings, please email nyuad_circ@library.nyu.edu."
	jQuery("#booking_message").html(bookingMessage);

	// Hide caveat for NYU51 requests that are picked up in Abu Dhabi
	if (admLibrary == "NYU51") {
		jQuery("#hours_NABUD .caveat").hide();
		jQuery("#booking_terms_of_use").hide();
		jQuery("#loan_period").html("Items are eligible to be booked for a period of up to " + loanDays + " days. Please book items at least one day in advance.");
		jQuery("#loan_period").css("margin-bottom", "1em");
	}

	// Set the onchange event of pickup locations to show the appropriate booking hours.
	jQuery("#pickup_location").change(bs_booking_location_hours);

	// Show appropriate booking hours
	bs_booking_location_hours();

	// Move the booking period
	var loanPeriod = jQuery("#loan_period").remove();
	jQuery("#item_booking_header").after(loanPeriod);

	// Make matrix selectable
	// This feature is not ready for prime time
	/*
	jQuery("table#bookingmatrix").selectable({
		filter: 'td.avail',
		distance: 1,
		start: function(event, ui) {
			//jQuery(".ui-selected").removeClass("ui-selected");
		},
		stop: function(event, ui) {
			var first_index = jQuery(".ui-selectee").index(jQuery(".ui-selected").first());
			var last_index = jQuery(".ui-selectee").index(jQuery(".ui-selected").last());
			jQuery(".ui-selectee").not(jQuery(".ui-selectee:lt(" + first_index + "), .ui-selectee:gt(" + last_index + ")")).addClass("ui-selected");
			var first_date_array = jQuery(".ui-selected").first().closest("tr").children("td").first().html().split("/");
			var first_date = "20"+first_date_array[2] + "/" + first_date_array[0] + "/" + first_date_array[1];
			var last_date_array = jQuery(".ui-selected").last().closest("tr").children("td").first().html().split("/");
			var last_date = "20"+last_date_array[2] + "/" + last_date_array[0] + "/" + last_date_array[1];
			var first_hour_array = jQuery("table#bookingmatrix tr:eq(1) td:eq(" + jQuery(".ui-selected").first().closest("tr").children("td").index(jQuery(".ui-selected").first()) + ")").html().split(":");
			var first_minute = ((Number(first_hour_array[1]) + 1) < 10) ? "0" + (Number(first_hour_array[1]) + 1):(Number(first_hour_array[1]) + 1);
			var first_hour = first_hour_array[0] + ":" + first_minute;
			var last_hour_array = jQuery("table#bookingmatrix tr:eq(1) td:eq(" + jQuery(".ui-selected").last().closest("tr").children("td").index(jQuery(".ui-selected").last()) + ")").html().split(":");
			var last_hour = (Number(last_hour_array[0]) + 1) + ":" + last_hour_array[1];
			jQuery("#book #start_date").val(first_date);
			jQuery("#book #start_hour").val(first_hour);
			jQuery("#book #end_date").val(last_date);
			jQuery("#book #end_hour").val(last_hour);
		}
	});
	*/
}

function bs_booking_submit(form) {
	jQuery("#book #start_date").val(jQuery("#book #start_date").val().replace(/\//gi, ''));
	jQuery("#book #start_hour").val(jQuery("#book #start_hour").val().replace(/\:/gi, ''));
	jQuery("#book #end_date").val(jQuery("#book #end_date").val().replace(/\//gi, ''));
	jQuery("#book #end_hour").val(jQuery("#book #end_hour").val().replace(/\:/gi, ''));
	form.submit();
}

function bs_booking_location_hours() {
	jQuery("select#pickup_location option").each(
		function(index, option) {
			if(option.value && option.selected) {
				jQuery("#hours_" + option.value).show();
			} else if(option.value) {
				jQuery("#hours_" + option.value).hide();
			}
		}
	);
}

//Clean whitespace from links table data element for prettier presentation
function bs_format_items () {
	jQuery("#holdings table#items td.links").each(function(index, td){jQuery(td).html(jQuery(td).html().replace("&nbsp;", ""))});
}

//Add dialog box to request queries
function bs_ajax_window (shared_modal_d) {
	//Capture item table column order
	var item_column_order = new Array();
	jQuery("#holdings table#items th").each(function(index, th) {item_column_order[index] = jQuery.trim(jQuery(th).text());});
	var sub_library_index = jQuery.inArray("Location", item_column_order);
	var collection_index = jQuery.inArray("Collection", item_column_order);
	var item_type_index = jQuery.inArray("Item Type", item_column_order);
	var availability_index = jQuery.inArray("Availability", item_column_order);
	jQuery("#holdings table#items td.links a").filter(function(){return jQuery(this).text().match(/^Request$/);}).addClass("ajax_window");
	// Store data about this item.
	jQuery("#holdings table#items td.links a.ajax_window").each(function(index, a) {
		var sub_library = jQuery(a).closest("tr").children().eq(sub_library_index).text();
		jQuery.data(a, "sub_library", sub_library);
		var collection = jQuery(a).closest("tr").children().eq(collection_index).text();
		jQuery.data(a, "collection", collection);
		var item_type = jQuery(a).closest("tr").children().eq(item_type_index).text();
		jQuery.data(a, "item_type", item_type);
		var availability = jQuery(a).closest("tr").children().eq(availability_index).text();
		jQuery.data(a, "availability", availability);
		var doc_number_regex = /\&adm_doc_number=([^&]+)&/;
		var doc_library_regex = /\&doc_library=([^&]+)&/;
		jQuery.data(a, "doc_number", doc_number_regex.exec(this.href)[1]);
		jQuery.data(a, "doc_library", doc_library_regex.exec(this.href)[1]);
	});
	jQuery("#holdings table#items td.links a.ajax_window").live("click", function(event) {
		var target_url = this.href;
		var current_url = window.location;
		bs_is_available(this, shared_modal_d);
		bs_is_offsite(this, shared_modal_d);
		bs_is_request_ill(this, shared_modal_d);
		bs_modal_dialog(shared_modal_d, target_url, current_url);
		return false;
	});
	jQuery("form.modal_dialog_form input[type=submit]").live("click", function(event) {
		var target_url = jQuery(event.target).closest("form").attr("action");
		var input_data = jQuery(event.target).closest("form").serialize();
		var current_url = window.location;
		bs_is_available(this, shared_modal_d);
		bs_is_offsite(this, shared_modal_d);
		bs_is_request_ill(this, shared_modal_d);
		jQuery(shared_modal_d).dialog({close: function(event, ui) {location.reload();}});
		bs_modal_dialog(shared_modal_d, target_url, current_url, input_data);
		return false;
	});
	jQuery("form.modal_dialog_form").live( "submit", function(event) {
		var target_url = jQuery(event.target).closest("form").attr("action");
		var input_data = jQuery(event.target).closest("form").serialize();
		var current_url = window.location;
		bs_is_available(this, shared_modal_d);
		bs_is_offsite(this, shared_modal_d);
		bs_is_request_ill(this, shared_modal_d);
		jQuery(shared_modal_d).dialog({close: function(event, ui) {location.reload();}});
		bs_modal_dialog(shared_modal_d, target_url, current_url, input_data);
		return false;
	});
}

//Determine if we should update the available display
function bs_is_available(a, shared_modal_d) {
	var sub_library = jQuery.data(a, "sub_library");
	var collection = jQuery.data(a, "collection");
	var item_type = jQuery.data(a, "item_type");
	var availability = jQuery.data(a, "availability");
	var is_available = false;
	if (item_type == "Available" || availability == "On Shelf") {
		is_available = true;
		jQuery.data(shared_modal_d, "sub_library", jQuery.data(a, "sub_library"));
	}
	jQuery.data(shared_modal_d, "is_available", is_available);
}

//Determine if we should update the offsite display
function bs_is_offsite(a, shared_modal_d) {
	var sub_library = jQuery.data(a, "sub_library");
	var item_type = jQuery.data(a, "item_type");
	var is_offsite = false;
	if (item_type == "Offsite Available") {
		is_offsite = true;
		jQuery.data(shared_modal_d, "sub_library", jQuery.data(a, "sub_library"));
	}
	jQuery.data(shared_modal_d, "is_offsite", is_offsite);
}

//Determine if we should display Request ILL choice
function bs_is_request_ill(a, shared_modal_d) {
	var collection = jQuery.data(a, "collection");
	var item_type = jQuery.data(a, "item_type");
	var availability = jQuery.data(a, "availability");
	var is_request_ill = false;
	if ((item_type != "Offsite Available" && item_type != "Available" && availability != "On Shelf" && availability != "Reshelving") && (collection != "NYU Bobst Avery Fisher Center")) {
		is_request_ill = true;
		jQuery.data(shared_modal_d, "doc_number", jQuery.data(a, "doc_number"));
		jQuery.data(shared_modal_d, "doc_library", jQuery.data(a, "doc_library"));
	}
	jQuery.data(shared_modal_d, "is_request_ill", is_request_ill);
}

function bs_ill_item(doc_number, doc_library) {
	var html = "\n";
	html += "<li>\n";
	html += "\t<a href=\"/F/?func=item-sfx&doc_library="+doc_library+"&doc_number="+doc_number+"&local_base=PRIMOCOMMON\">Request this item from another library via Interlibrary Loan</a><br />\n";
	html += "\tMost requests arrive within two weeks. Due dates and renewals are determined by the lending library.\n";
	html += "\tArticle/chapter requests are typically delivered electronically in 3-5 days.\n";
	html += "</li>\n";
	return html;
}

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

//Hide empty table data elements
function bs_format_bib() {
	jQuery("#holdings table#bib td.fxxx").filter(function() {return jQuery(this).html().match(/<span>\s*&nbsp;<br>\s*<\/span>/i);}).hide();
}


function bs_format_holdings () {
	// Row labels
	var locationRowLabel = /"nowrap f99label">\s*Location/;
	var summaryHoldingsRowLabel = /"nowrap f99label">\s*Summary Holding/;
	var electronicLocationRowLabel = /"nowrap f99label">\s*Electronic Location/;
	var emptyRowLabel = /"nowrap f99label">\s*<\/td>/i;

	// Maintain state through the previous row object
	var previousRow = {type: null, index: null};
	var lastSummaryStart = null;

	jQuery("#holdings table#holdingsTable tr.f99").each(
		function(index, tr) {
			// Handle locations (hide restricted Internet locations)
			// Either location row or empty row with previous as location
			if(locationRowLabel.test(tr.innerHTML) || (emptyRowLabel.test(tr.innerHTML) && previousRow.type == "location")) {
				// Maintain state by preserving the fact that this is a "location"
				previousRow.type = "location";
				previousRow.index = index;
				// Restricted Internet Location Regular Expression
				var internetLocationRegExp = /Restricted/g;
				// Restricted Internet Location 2 Regular Expression
				var internetLocation2RegExp = /Internet/gi;
				// Is this an Internet location?  Don't display
				if (internetLocationRegExp.test(tr.innerHTML) && internetLocation2RegExp.test(tr.innerHTML)) {
					jQuery(tr).hide();
				}
			// Handle summaries (only display the last one, but loop through all)
			// Last summary row and (summary row or empty row with previous as summary)
			} else if (jQuery(tr) == jQuery("tr.f99").last() && (summaryHoldingsRowLabel.test(tr.innerHTML) || (emptyRowLabel.test(tr.innerHTML) && previousRow.type == "summary"))) {
				// Show last summary holdings
				// Maintain state by preserving the fact that this is a "summary"
				previousRow.type = "summary";
				previousRow.index = index;
				// Only display the last instance of summary holdings
				if(lastSummaryStart && !(summaryHoldingsRowLabel.test(tr.innerHTML))){jQuery("tr.f99").slice(lastSummaryStart.index).show();}
			} else if (summaryHoldingsRowLabel.test(tr.innerHTML) || (emptyRowLabel.test(tr.innerHTML) && previousRow.type == "summary")) {
				// Hide summary holdings
				// Maintain state by preserving the fact that this is a "summary"
				previousRow.type = "summary";
				previousRow.index = index;
				//Copy the preivious row into the last summary start object if this is the start of a summary holding
				if (summaryHoldingsRowLabel.test(tr.innerHTML)) {jQuery.extend(lastSummaryStart, previousRow);}
				// Hide all summaries initially since we're only displaying the last instance of summary holdings
				jQuery(tr).hide();
			} else if (electronicLocationRowLabel.test(tr.innerHTML) || (emptyRowLabel.test(tr.innerHTML) && previousRow.type == "electronic_location")) {
				// Handle electronic locations (Broken link functionality and EZProxy)
				// Maintain state by preserving the fact that this is an "electronic location"
				previousRow.type = "electronic_location";
				previousRow.index = index;
				var web856RegExp = /(\sBWEB|\sCU|\sTWEB|\sNWEB|\sWEB|\sNYSID)\s*/;
				var sublibrary = jQuery.trim(web856RegExp.exec(tr.innerHTML)[0]);
				var td856 = jQuery(tr).children("td").filter(function() {return jQuery(this).html().match(web856RegExp);});
				var anchor856 = jQuery(td856).children("a").first();
				var href856 = jQuery(anchor856).attr("href");
				// Add broken link functionality
				// Broken link span
				var broken_link_span = jQuery('<span id="broken_link' + index + '" class="broken_link">[<a id="broken_link_anchor_'+ index +'" href="/cgi-bin/broken.pl" target="_blank">Report Broken Link</a>]</span>');
				// Store url and aleph id for processing later
				broken_link_span.data("aleph_id", jQuery.query.get("doc_number"));
				broken_link_span.data("aleph_url", href856);
				var broken_link_data = jQuery('<a />').attr({'id': broken_link_span.data('aleph_id'), 'href': broken_link_span.data('aleph_url')}).hide();
				broken_link_span.append(broken_link_data);
				jQuery(td856).append(broken_link_span);
				// Attache broken link Ajax function
				jQuery('a#broken_link_anchor_'+ index).live("click", function(event) {bs_send_broken_link(this);return false;});
				// Add EZProxy prefix
				if (jQuery.inArray(restrictedSublibraries, sublibrary)) {
					var restrictedHref856 = ezProxyPrefix[sublibrary].concat(href856);
					jQuery(anchor856).attr("href", restrictedHref856);
					jQuery(anchor856).html(restrictedHref856);
				}
				// Remove Sublibrary
				jQuery(td856).html(jQuery(td856).html().replace(sublibrary, ""));
			} else {
				previousRow.type = null;
			}
		}
	);
}
jQuery.noConflict();
bs_init();
