/*
 * Functionality related to the BobcatStandard search and full record display
 *
 * Ex.
 *  search.init();
 */
export const search = {
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
    let id = "f999";
    const fullFormat = querystring.get("format");
    if (fullFormat) {
      id = "f" + fullFormat;
    }
    $("#format").attr("id", id);
  },
  init() {
    this.setFullFormat();
  }
};
// Alias for old bs_history_nav function
export const bs_history_nav = (action) => { search.submitSearchHistoryAction(action); };
// Alias for old bs_toggle_limits function
export const bs_toggle_limits = () => { search.toggleLimits(); };