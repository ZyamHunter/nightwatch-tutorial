const fs = require('fs');
const path = require('path');

const resourcesLogin = require('../resources/login');

describe('The Login Page', function () {
  let massa;

  before(function (browser) {
    const userData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data', 'user.json'), 'utf8'),
    );
    massa = userData;
  });

  beforeEach(function (browser) {
    browser.navigateTo('/');
  });

  afterEach(function (browser) {
    browser.pause(2000);
  });

  it('Login genérico', function (browser) {
    browser.navigateTo('/');
    browser.assert.elementPresent('#email');
    browser.sendKeys('#email', 'user@teste.com');
    browser.assert.elementPresent('#password');
    browser.sendKeys('#password', ['Teste@123!', browser.Keys.ENTER]);
    browser.waitForElementVisible(
      '.Toastify__toast-body',
      'Login realizado com sucesso!',
    );

    browser.getText('.Toastify__toast-body', function (result) {
      this.assert.strictEqual(result.status, 0);
      this.assert.equal(result.value, 'Login realizado com sucesso!');
    });
    browser.assert.urlContains('/dashboard');
  });

  it('Login avançado', function (browser) {
    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, 'user@teste.com')
      .sendKeys(resourcesLogin.passwordInput, [
        'Teste@123!',
        browser.Keys.ENTER,
      ])
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Login realizado com sucesso!',
      );
  });

  it('Login com sucesso com massa definida em constante', function (browser) {
    const user = {
      email: 'user@teste.com',
      senha: 'Teste@123!',
    };

    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, user.email)
      .setValue(resourcesLogin.passwordInput, user.senha)
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Login realizado com sucesso!',
      );
  });

  it('Login com sucesso usando massa da fixture', function (browser) {
    const userData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data', 'user.json'), 'utf8'),
    );
    user = userData;

    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, user.email)
      .setValue(resourcesLogin.passwordInput, user.senha)
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Login realizado com sucesso!',
      );
  });

  it('Login com sucesso usando massa da fixture no before', function (browser) {
    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, massa.email)
      .setValue(resourcesLogin.passwordInput, massa.senha)
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Login realizado com sucesso!',
      );
  });

  it('Login com email incorreto', function (browser) {
    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, 'email_incorreto@teste.com')
      .setValue(resourcesLogin.passwordInput, massa.senha)
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Erro ao acessar, verifique suas credenciais de acesso!',
      );
  });

  it('Login com senha incorreta', function (browser) {
    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, massa.email)
      .setValue(resourcesLogin.passwordInput, 'SenhaErrada123!')
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Erro ao acessar, verifique suas credenciais de acesso!',
      );
  });

  it('Login com email e senha incorretos', function (browser) {
    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, 'email_errado@teste.com')
      .setValue(resourcesLogin.passwordInput, 'SenhaErrada123!')
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Erro ao acessar, verifique suas credenciais de acesso!',
      );
  });

  it('Login com campo de email inválido', function (browser) {
    browser
      .navigateTo('/')
      .waitForElementVisible(resourcesLogin.emailInput)
      .setValue(resourcesLogin.emailInput, 'email_errado.teste.com')
      .setValue(resourcesLogin.passwordInput, massa.senha)
      .click(resourcesLogin.accessButton)
      .waitForElementVisible(resourcesLogin.inputMessageError)
      .assert.containsText(
        resourcesLogin.inputMessageError,
        'Por favor, insira um e-mail válido.',
      )
      .waitForElementVisible(resourcesLogin.toastLoginStatus)
      .assert.containsText(
        resourcesLogin.toastLoginStatus,
        'Preencha os campos corretamente!',
      );
  });

  after(function (browser) {
    browser.end();
    browser;
  });
});
