const htmlHelpers = {
  render(tag) {
    let html = "";
    html += "<" + tag.tag;
    $.each(tag.attrs, (key, value) => {
      html += " " + key + "=\"" + value + "\"";
    });
    html += ">";
    html += tag.value;
    html += "</" + tag.tag + ">";
    return html;
  }
};
