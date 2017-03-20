/*
 * Functionality related to the BobcatStandard search and full record display
 *
 * Ex.
 *  search.init();
 */
const search = {
  toggleLimits() {
    $("#showlimits").toggle();
    $("#hidelimits").toggle();
    $("#limits").toggle();
  },
  submitSearchHistoryAction(action) {
    $("#nav_action").attr("name", action);
    $("#nav_form").submit();
  },
  setFullFormat() {
    const id = "f999";
    const fullFormat = $.query.get("format");
    if (fullFormat) {
      id = "f" + fullFormat;
    }
    $("#format").attr("id", id);
  },
  init() {
    $("#limits-block").find("#showlimits a, #hidelimits a").on('click', (e) => {
      e.preventDefault();
      search.toggleLimits();
      return false;
    });
    this.setFullFormat();
  }
};
// Alias for old bs_history_nav function
const bs_history_nav = search.submitSearchHistoryAction(action);
