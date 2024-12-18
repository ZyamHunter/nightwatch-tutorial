const resourcesHome = require('../resources/home');

describe('Home', () => {
  beforeEach(function (browser) {
    browser.navigateTo('/');
  });

  it('Acessar Home', () => {
    browser.waitForElementPresent(resourcesHome.home);
  });
});
