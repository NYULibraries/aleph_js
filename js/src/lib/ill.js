/*
 * Handle Interlibrary Loan (ILL) requests
 */
const ill = {
  url(docLibrary, docNumber) {
    return "/F/?func=item-sfx&doc_library=" + docLibrary + "&doc_number=" + docNumber + "&local_base=PRIMOCOMMON";
  },
  redirectToIll(docLibrary, docNumber) {
    redirect.windowReplace(this.url(docLibrary, docNumber));
  }
};
// Alias old function name
const bs_request_ill = (docLibrary, docNumber) => { ill.redirectToIll(docLibrary, docNumber); };
