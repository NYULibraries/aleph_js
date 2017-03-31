//INCOMPLETE
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
      $(sharedModalDialog).find("div#main").eq(0).prepend($(html.render({ tag: "h3", value: title})));
    });
  }
};
