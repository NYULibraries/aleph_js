describe('brokenLink', () => {

  describe('init', () => {
    it('should add a broken link button to the page', () => {
      brokenLink = $("td span.broken_link");
      expect($(brokenLink).length).toBeGreaterThan(0);
      expect($(brokenLink).children("a").first().attr("href")).toEqual("https://nyu.qualtrics.com/jfe/form/SV_a30SvEFe8f1yXQh");
      expect($(brokenLink).closest("td span.broken_link").html()).toMatch(/\[<a id="broken_link_anchor(\d+)" target="_blank" href="\https:\/\/nyu\.qualtrics\.com\/jfe\/form\/SV_a30SvEFe8f1yXQh">Report Broken Link<\/a>\]/);
    });
  });

});
