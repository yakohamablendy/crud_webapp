// selenium-tests/utils/helpers.js
const { By, until } = require('selenium-webdriver');
const testData = require('./testData'); // Usamos tu archivo testData

class TestHelpers {
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Realiza el proceso de login en la aplicación.
     * @param {string} username - El nombre de usuario.
     * @param {string} password - La contraseña.
     */
    async login(username, password) {
        await this.driver.get(testData.urls.login);
        await this.driver.findElement(By.css(testData.selectors.login.usernameInput)).sendKeys(username);
        await this.driver.findElement(By.css(testData.selectors.login.passwordInput)).sendKeys(password);
        await this.driver.findElement(By.css(testData.selectors.login.submitButton)).click();
        await this.driver.wait(until.urlIs(testData.urls.dashboard), testData.timeouts.long, 'No se redirigió al dashboard.');
    }

    /**
     * Cierra la sesión del usuario actual.
     */
    async logout() {
        // Espera a que el botón de logout sea clickeable
        const logoutButton = await this.driver.wait(
            until.elementLocated(By.css(testData.selectors.inventory.logoutButton)), 
            testData.timeouts.medium
        );
        await logoutButton.click();
        
        // Acepta la confirmación de la alerta
        await this.driver.wait(until.alertIsPresent(), testData.timeouts.short);
        await this.driver.switchTo().alert().accept();

        // Espera a ser redirigido a la página de login
        await this.driver.wait(until.urlIs(testData.urls.login), testData.timeouts.long, 'No se redirigió a la página de login.');
    }

    /**
     * Espera a que aparezca un mensaje de éxito y verifica su texto.
     * @param {string} expectedText - El texto que se espera que contenga el mensaje.
     */
    async verifySuccessMessage(expectedText) {
        const messageElement = await this.driver.wait(
            until.elementIsVisible(this.driver.findElement(By.css(testData.selectors.inventory.generalMessage))),
            testData.timeouts.medium
        );
        const messageText = await messageElement.getText();
        if (!messageText.includes(expectedText)) {
            throw new Error(`Mensaje de éxito esperado: "${expectedText}", pero se encontró: "${messageText}"`);
        }
    }
}

module.exports = TestHelpers;