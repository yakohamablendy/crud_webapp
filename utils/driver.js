// utils/driver.js - VERSIÓN CORREGIDA
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class DriverManager {
    constructor() {
        this.driver = null;
    }

    async createDriver() {
        console.log('🚀 Iniciando ChromeDriver...');
        
        try {
            // Configurar opciones básicas de Chrome (SIN experimental options)
            const options = new chrome.Options();
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');
            options.addArguments('--disable-web-security');
            options.addArguments('--window-size=1280,720');
            options.addArguments('--disable-blink-features=AutomationControlled');
            
            // Crear driver sin service personalizado
            this.driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();

            console.log('✅ ChromeDriver iniciado correctamente');

            // Configurar timeouts
            await this.driver.manage().setTimeouts({
                implicit: 10000,
                pageLoad: 30000,
                script: 30000
            });

            return this.driver;

        } catch (error) {
            console.error('❌ Error al crear el driver:', error.message);
            throw error;
        }
    }

    async quitDriver() {
        if (this.driver) {
            console.log('🛑 Cerrando ChromeDriver...');
            try {
                await this.driver.quit();
                this.driver = null;
                console.log('✅ ChromeDriver cerrado correctamente');
            } catch (error) {
                console.log('⚠️  Error al cerrar driver:', error.message);
            }
        }
    }

    getDriver() {
        if (!this.driver) {
            throw new Error('Driver no está inicializado. Llama a createDriver() primero.');
        }
        return this.driver;
    }
}

module.exports = DriverManager;