// tests/main.test.js - VERSIÓN CORREGIDA
const { By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');
const DriverManager = require('../utils/driver');
const testData = require('../utils/testData');

// CREAR LA INSTANCIA CORRECTAMENTE
const driverManager = new DriverManager();

describe('TAREA 4: SUITE COMPLETA DE PRUEBAS AUTOMATIZADAS', function() {
    this.timeout(40000);
    let driver;

    // HOOK GLOBAL: Se ejecuta UNA vez antes de todas las pruebas en este archivo
    before(async function() {
        // Usamos la instancia de tu driver.js
        driver = await driverManager.createDriver();
    });

    // HOOK GLOBAL: Se ejecuta UNA vez después de que todas las pruebas terminan
    after(async function() {
        await driverManager.quitDriver();
    });

    // --- Suite 1: Pruebas de Conexión y Login ---
    describe('🔑 Suite de Autenticación', function() {

        beforeEach(async function() {
            // Antes de cada prueba de login, vamos a la página
            await driver.get(testData.urls.login);
        });

        it.skip('✅ [Logout] Debe cerrar sesión para continuar con pruebas negativas', async function() {
            const user = testData.validUsers[0];
            await driver.findElement(By.css(testData.selectors.login.usernameInput)).sendKeys(user.username);       
            await driver.findElement(By.css(testData.selectors.login.passwordInput)).sendKeys(user.password);       
            await driver.findElement(By.css(testData.selectors.login.submitButton)).click();
            await driver.wait(until.urlIs(testData.urls.dashboard), testData.timeouts.medium);
        });

        // Hacemos el logout para las siguientes pruebas
        it('✅ [Logout] Debe cerrar sesión para continuar con pruebas negativas', async function() {
            const logoutButton = await driver.wait(until.elementLocated(By.css(testData.selectors.inventory.logoutButton)), testData.timeouts.medium);
            await logoutButton.click();
            await driver.wait(until.alertIsPresent(), testData.timeouts.short);
            await driver.switchTo().alert().accept();
            await driver.wait(until.urlIs(testData.urls.login), testData.timeouts.medium);
        });

        testData.invalidUsers.forEach(user => {
            it(`❌ [Login - Negativo] Debe mostrar error para: ${user.expectedError}`, async function() {
                await driver.findElement(By.css(testData.selectors.login.usernameInput)).sendKeys(user.username);
                await driver.findElement(By.css(testData.selectors.login.passwordInput)).sendKeys(user.password);
                await driver.findElement(By.css(testData.selectors.login.submitButton)).click();

                let errorSelector;
                if (user.expectedError.includes('incorrectos')) errorSelector = testData.selectors.login.errorMessage;
                else if (user.expectedError.includes('usuario')) errorSelector = testData.selectors.login.usernameError;
                else errorSelector = testData.selectors.login.passwordError;

                const errorElement = await driver.wait(until.elementIsVisible(driver.findElement(By.css(errorSelector))), testData.timeouts.short);
                const errorText = await errorElement.getText();
                expect(errorText).to.equal(user.expectedError);
            });
        });
    });

    // --- Suite 2: Pruebas del Inventario (CRUD) ---
    describe('📋 Suite de Inventario (CRUD)', function() {
        const product = testData.validProducts[0];
        const updatedProduct = testData.validProducts[2];

        // Antes de empezar esta suite, nos aseguramos de estar logueados
        before(async function() {
            await driver.get(testData.urls.login);
            await driver.findElement(By.css(testData.selectors.login.usernameInput)).sendKeys(testData.validUsers[0].username);
            await driver.findElement(By.css(testData.selectors.login.passwordInput)).sendKeys(testData.validUsers[0].password);
            await driver.findElement(By.css(testData.selectors.login.submitButton)).click();
            await driver.wait(until.urlIs(testData.urls.dashboard), testData.timeouts.medium);
        });

        it('✅ [CREATE] Debe crear un nuevo producto correctamente', async function() {
            await driver.findElement(By.css(testData.selectors.inventory.codigoInput)).sendKeys(product.codigo);
            await driver.findElement(By.css(testData.selectors.inventory.nombreInput)).sendKeys(product.nombre);    
            await driver.findElement(By.css(testData.selectors.inventory.categoriaSelect)).sendKeys(product.categoria);
            await driver.findElement(By.css(testData.selectors.inventory.submitButton)).click();

            const msgElement = await driver.wait(until.elementIsVisible(driver.findElement(By.css(testData.selectors.inventory.generalMessage))), testData.timeouts.medium);
            const msgText = await msgElement.getText();
            expect(msgText).to.include(testData.expectedMessages.inventory.productAdded);
        });

        it('✅ [READ] Debe encontrar el producto recién creado en la lista', async function() {
            const cardSelector = By.xpath(`//div[contains(@class, 'product-card')][.//span[contains(text(), '${product.codigo}')]]`);
            const productCard = await driver.wait(until.elementLocated(cardSelector), testData.timeouts.medium);    
            expect(productCard).to.exist;
        });

        it('✅ [UPDATE] Debe editar el producto existente correctamente', async function() {
            const cardSelector = By.xpath(`//div[contains(@class, 'product-card')][.//span[contains(text(), '${product.codigo}')]]`);
            const productCard = await driver.findElement(cardSelector);
            await productCard.findElement(By.css(testData.selectors.inventory.editButton)).click();

            await driver.wait(until.elementTextContains(driver.findElement(By.css(testData.selectors.inventory.submitButton)), 'Actualizar'), testData.timeouts.short);

            const nameInput = await driver.findElement(By.css(testData.selectors.inventory.nombreInput));
            await nameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
            await nameInput.sendKeys(updatedProduct.nombre);
            await driver.findElement(By.css(testData.selectors.inventory.submitButton)).click();

            const msgElement = await driver.wait(until.elementIsVisible(driver.findElement(By.css(testData.selectors.inventory.generalMessage))), testData.timeouts.medium);
            const msgText = await msgElement.getText();
            expect(msgText).to.include(testData.expectedMessages.inventory.productUpdated);
        });

        it('✅ [DELETE] Debe eliminar el producto actualizado correctamente', async function() {
            const cardSelector = By.xpath(`//div[contains(@class, 'product-card')][.//h3[contains(text(), '${updatedProduct.nombre}')]]`);
            const productCard = await driver.findElement(cardSelector);
            await productCard.findElement(By.css(testData.selectors.inventory.deleteButton)).click();

            await driver.wait(until.alertIsPresent(), testData.timeouts.short);
            await driver.switchTo().alert().accept();

            const msgElement = await driver.wait(until.elementIsVisible(driver.findElement(By.css(testData.selectors.inventory.generalMessage))), testData.timeouts.medium);
            const msgText = await msgElement.getText();
            expect(msgText).to.include(testData.expectedMessages.inventory.productDeleted);

            const elements = await driver.findElements(cardSelector);
            expect(elements.length).to.equal(0);
        });
    });
});