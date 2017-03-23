const bookings = {
  init() {

  }
};
// function bs_process_booking() {
// 	// Enable datepicker
// 	var dates = jQuery("#book #start_date, #book #end_date").datepicker({
// 		dateFormat: 'yy/mm/dd',
// 		minDate: 0,
// 		showOn: "both",
// 		buttonImage: "/bobcat/images/cal.gif",
// 		buttonImageOnly: true,
// 		onSelect: function(selectedDate) {
// 			if(jQuery(this).data("hours")[jQuery(this).datepicker("getDate").getDay()] != "Closed") {
// 				var hour1 = (this.id == "start_date") ? jQuery("#book #start_hour") : jQuery("#book #end_hour");
// 				var hour2 = (this.id == "start_date") ? jQuery("#book #end_hour") : jQuery("#book #start_hour");
// 				var instance = jQuery(this).data("datepicker");
// 				var date1 = jQuery.datepicker.parseDate(instance.settings.dateFormat || jQuery.datepicker._defaults.dateFormat, selectedDate, instance.settings);
// 				hour1.val(jQuery(this).data("hours")[jQuery(this).datepicker("getDate").getDay()]);
// 				if (this.id == "start_date") date1.setDate(date1.getDate() + loanDays);
// 				if (this.id == "end_date") date1.setDate(date1.getDate() - loanDays);
// 				if (this.id == "start_date" || admLibrary == "NYU50") {
// 					dates.not(this).datepicker("setDate", date1);
// 					hour2.val(dates.not(this).data("hours")[dates.not(this).datepicker("getDate").getDay()]);
// 					if (admLibrary == "NYU51") {
// 						dates.not(this).datepicker("option", {maxDate: date1});
// 					}
// 				}
// 			}
// 			var form = jQuery(this).closest("form");
// 			jQuery(form).validate().element(this);
// 		}
// 	});
//
// 	// Initialize vars
// 	var instance = jQuery("#book #start_date").data("datepicker");
// 	var format = instance.settings.dateFormat || jQuery.datepicker._defaults.dateFormat;
// 	var admLibrary = jQuery('input[name="adm_library"]').val();
//
// 	// Form validation
// 	jQuery("#book #start_date, #book #end_date").addClass("closed");
// 	jQuery.validator.addMethod("closed", function(value, element) { return jQuery(element).data("hours")[jQuery(element).datepicker("getDate").getDay()] != "Closed" }, "The library is closed on the day selected.");
// 	jQuery.validator.addMethod("hour", function(value, element) { return this.optional(element) || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value); }, "Please enter a valid hour.");
// 	var form = jQuery("#book #start_date").closest("form");
// 	jQuery(form).validate({
// 		start_date: {required: true, dateISO: true},
// 		end_date: {required: true, dateISO: true},
// 		start_hour: {required: true},
// 		end_hour: {required: true},
// 		pickup_location: {required: true},
// 		errorPlacement: function(error, element) {element.before(error);},
// 		submitHandler: function(form) {bs_booking_submit(form);}
// 	});
// 	jQuery("#book #start_date, #book #end_date").attr("readonly", true);
//
// 	// Store hours in jQuery data
// 	if(admLibrary == "NYU50") {
// 		jQuery("#book #start_date").data("hours", ["12:00", "09:00", "09:00", "09:00", "09:00", "09:00", "12:00"]);
// 		jQuery("#book #end_date").data("hours", ["19:45", "22:45", "22:45", "22:45", "22:45", "18:45", "19:45"]);
// 		//jQuery("#book #end_date").datepicker("option", {buttonImage: '', buttonImageOnly: false});
// 		//jQuery("#book #end_date").datepicker("disable");
// 		//jQuery("#book #end_date").closest("form").submit(function(event) {jQuery("#book #end_date").datepicker("enable");});
// 	} else {
// 		jQuery("#book #start_date").data("hours", ["08:00", "08:00", "08:00", "08:00", "08:00", "14:00", "14:00"]);
// 		jQuery("#book #end_date").data("hours", ["22:30", "22:30", "22:30", "22:30", "18:00", "18:00", "22:30"]);
// 	}
//
// 	// Set default start and end dates
// 	jQuery("#book #start_date").datepicker("setDate", jQuery.datepicker.formatDate(format, new Date(), instance.settings));
// 	jQuery("#book #end_date").datepicker("setDate", "+"+loanDays+"d");
// 	jQuery("#book #start_date, #book #end_date").datepicker("option", "minDate", jQuery("#book #start_date").datepicker("getDate"));
//
// 	// Set default start and end hours
// 	jQuery("#book #start_hour").val(jQuery("#book #start_date").data("hours")[jQuery("#book #start_date").datepicker("getDate").getDay()]);
// 	//jQuery("#book #end_hour").val(jQuery("#book #end_date").data("hours")[jQuery("#book #end_date").datepicker("getDate").getDay()]);
// 	// Calculate initial end hour with some math
// 	var da = dueHour.split(" ");
// 	var dt = da[0];
// 	var dp = da[1];
// 	var dta = dt.split(":");
// 	var dh = parseInt(dta[0]);
// 	var dm = dta[1];
// 	if (dp == "PM") {
// 		dh = dh + 12;
// 	}
// 	dt = dh + ":" + dm;
// 	jQuery("#book #end_hour").val(dt);
//
// 	// Update confirmation heading
// 	var bookingMessage = (admLibrary == "NYU50")? "For questions about AFC bookings, please email afcbookings@library.nyu.edu." : "For questions about NYU Abu Dhabi bookings, please email nyuad_circ@library.nyu.edu."
// 	jQuery("#booking_message").html(bookingMessage);
//
// 	// Hide caveat for NYU51 requests that are picked up in Abu Dhabi
// 	if (admLibrary == "NYU51") {
// 		jQuery("#hours_NABUD .caveat").hide();
// 		jQuery("#booking_terms_of_use").hide();
// 		jQuery("#loan_period").html("Items are eligible to be booked for a period of up to " + loanDays + " days. Please book items at least one day in advance.");
// 		jQuery("#loan_period").css("margin-bottom", "1em");
// 	}
//
// 	// Set the onchange event of pickup locations to show the appropriate booking hours.
// 	jQuery("#pickup_location").change(bs_booking_location_hours);
//
// 	// Show appropriate booking hours
// 	bs_booking_location_hours();
//
// 	// Move the booking period
// 	var loanPeriod = jQuery("#loan_period").remove();
// 	jQuery("#item_booking_header").after(loanPeriod);
// }
//
// function bs_booking_submit(form) {
// 	jQuery("#book #start_date").val(jQuery("#book #start_date").val().replace(/\//gi, ''));
// 	jQuery("#book #start_hour").val(jQuery("#book #start_hour").val().replace(/\:/gi, ''));
// 	jQuery("#book #end_date").val(jQuery("#book #end_date").val().replace(/\//gi, ''));
// 	jQuery("#book #end_hour").val(jQuery("#book #end_hour").val().replace(/\:/gi, ''));
// 	form.submit();
// }
//
// function bs_booking_location_hours() {
// 	jQuery("select#pickup_location option").each(
// 		function(index, option) {
// 			if(option.value && option.selected) {
// 				jQuery("#hours_" + option.value).show();
// 			} else if(option.value) {
// 				jQuery("#hours_" + option.value).hide();
// 			}
// 		}
// 	);
// }
