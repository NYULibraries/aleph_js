// Exclude sub-domains from same-origin policy
document.domain = 'library.nyu.edu';
//Load Aleph initialize JavaScript if not already loaded.
if (typeof(window.AlephInit) == "undefined") {
  if (window.location.hostname.match("^alephstage")) {
    document.write('<script type="text/javascript" src="https://dev.cdn.library.nyu.edu/aleph/application.js"><\/script>');
  } else {
    document.write('<script type="text/javascript" src="https://cdn.library.nyu.edu/aleph/application.js"><\/script>');
  }
}
