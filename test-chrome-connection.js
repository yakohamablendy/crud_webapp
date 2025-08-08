// test-chrome-connection.js - Prueba de conexión con Chrome
const DriverManager = require('./utils/driver');

async function testChromeConnection() {
    const driverManager = new DriverManager();
    
    try {
        console.log('🔄 Iniciando prueba de conexión con ChromeDriver...\n');
        
        // 1. Crear el driver
        console.log('1. Creando ChromeDriver...');
        const driver = await driverManager.createDriver();
        
        // 2. Navegar a una página simple
        console.log('2. Navegando a página de prueba...');
        await driver.get('https://www.google.com');
        
        // 3. Obtener el título de la página
        console.log('3. Obteniendo título de la página...');
        const title = await driver.getTitle();
        console.log(`   📄 Título: "${title}"`);
        
        // 4. Verificar que Chrome responde
        console.log('4. Verificando que Chrome responde...');
        const currentUrl = await driver.getCurrentUrl();
        console.log(`   🔗 URL actual: ${currentUrl}`);
        
        // 5. Probar navegación a tu aplicación local
        console.log('5. Probando navegación a tu aplicación...');
        await driver.get('file:///E:/Clases/Nuevo%20trimestre/Programacion%203/Tareas/crud_webapp/login.html');
        
        const appTitle = await driver.getTitle();
        console.log(`   📱 Título de tu app: "${appTitle}"`);
        
        // 6. Tomar screenshot (opcional)
        console.log('6. Tomando screenshot...');
        await driver.takeScreenshot().then(function(image) {
            console.log('   📸 Screenshot tomado correctamente');
        });
        
        // Esperar 3 segundos para ver la página
        console.log('7. Esperando 3 segundos para verificar visualmente...');
        await driver.sleep(3000);
        
        console.log('\n✅ ¡PRUEBA EXITOSA! ChromeDriver está funcionando correctamente\n');
        console.log('🎯 RESULTADOS:');
        console.log('   ✅ ChromeDriver se inició correctamente');
        console.log('   ✅ Puede navegar a páginas web');
        console.log('   ✅ Puede obtener información de las páginas');
        console.log('   ✅ Puede acceder a tu aplicación local');
        console.log('   ✅ Puede tomar screenshots');
        
    } catch (error) {
        console.error('\n❌ ERROR EN LA PRUEBA:');
        console.error('   Tipo:', error.name);
        console.error('   Mensaje:', error.message);
        
        // Diagnóstico de errores comunes
        if (error.message.includes('chrome')) {
            console.error('\n🔍 POSIBLES SOLUCIONES:');
            console.error('   1. Verificar que Chrome está instalado');
            console.error('   2. Actualizar Chrome a la última versión');
            console.error('   3. Instalar ChromeDriver: npm install chromedriver');
        }
        
        if (error.message.includes('file://')) {
            console.error('\n🔍 PROBLEMA CON ARCHIVO LOCAL:');
            console.error('   1. Verificar que el archivo existe en la ruta especificada');
            console.error('   2. Verificar permisos de la carpeta');
        }
        
    } finally {
        // Cerrar el navegador
        console.log('\n8. Cerrando ChromeDriver...');
        await driverManager.quitDriver();
        console.log('🔚 Prueba completada.\n');
    }
}

// Ejecutar la prueba
if (require.main === module) {
    testChromeConnection()
        .then(() => {
            console.log('🎉 Script de prueba finalizado correctamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error fatal:', error);
            process.exit(1);
        });
}

module.exports = testChromeConnection;