/*
 * Handle Interlibrary Loan (ILL) requests
 */
const ill = {
  redirectToIll(doc_library, doc_number) {
    location.replace("/F/?func=item-sfx&doc_library=" + doc_library + "&doc_number=" + doc_number + "&local_base=PRIMOCOMMON");
  }
};
// Alias old function name
const bs_request_ill = (doc_library, doc_number) => { ill.redirectToIll(doc_library, doc_number); };
