// testData.js - Datos de prueba para Selenium
module.exports = {
    // URLs de la aplicación
   urls: {
    login: 'http://127.0.0.1:5500/crud_webapp/login.html',
    dashboard: 'http://127.0.0.1:5500/crud_webapp/index.html'
},

    // Usuarios válidos para pruebas positivas
    validUsers: [
        {
            username: 'admin',
            password: '123456',
            displayName: 'admin'
        },
        {
            username: 'user', 
            password: 'password',
            displayName: 'user'
        },
        {
            username: 'test',
            password: 'test123',
            displayName: 'test'
        }
    ],

    // Credenciales inválidas para pruebas negativas
    invalidUsers: [
        {
            username: 'admin',
            password: 'wrong',
            expectedError: 'Usuario o contraseña incorrectos'
        },
        {
            username: 'nouser',
            password: '123456',
            expectedError: 'Usuario o contraseña incorrectos'
        },
        {
            username: '',
            password: '123456',
            expectedError: 'El usuario es obligatorio'
        },
        {
            username: 'admin',
            password: '',
            expectedError: 'La contraseña es obligatoria'
        },
        {
            username: 'ad', // Menos de 3 caracteres
            password: '123456',
            expectedError: 'El usuario debe tener al menos 3 caracteres'
        },
        {
            username: 'admin',
            password: '123', // Menos de 6 caracteres
            expectedError: 'La contraseña debe tener al menos 6 caracteres'
        }
    ],

    // Productos de prueba para CRUD
    validProducts: [
        {
            codigo: 'TEST001',
            nombre: 'Producto de Prueba 1',
            categoria: 'electronica',
            proveedor: 'Proveedor Test',
            precio: '999.99',
            cantidad: '10',
            descripcion: 'Este es un producto de prueba para automatización'
        },
        {
            codigo: 'TEST002',
            nombre: 'Producto de Prueba 2',
            categoria: 'ropa',
            proveedor: 'Test Supplier',
            precio: '49.95',
            cantidad: '25',
            descripcion: 'Segundo producto para pruebas de CRUD'
        },
        {
            codigo: 'TEST003',
            nombre: 'Producto Actualizado',
            categoria: 'hogar',
            proveedor: 'Nuevo Proveedor',
            precio: '199.50',
            cantidad: '5',
            descripcion: 'Producto para pruebas de actualización'
        }
    ],

    // Productos inválidos para pruebas negativas
    invalidProducts: [
        {
            codigo: '', // Código vacío
            nombre: 'Producto Test',
            categoria: 'electronica',
            proveedor: 'Test',
            precio: '100',
            cantidad: '1',
            descripcion: 'Test',
            expectedError: 'El código es obligatorio'
        },
        {
            codigo: 'TEST004',
            nombre: '', // Nombre vacío
            categoria: 'electronica',
            proveedor: 'Test',
            precio: '100',
            cantidad: '1',
            descripcion: 'Test',
            expectedError: 'El nombre es obligatorio'
        },
        {
            codigo: 'TEST005',
            nombre: 'Producto Test',
            categoria: '', // Categoría vacía
            proveedor: 'Test',
            precio: '100',
            cantidad: '1',
            descripcion: 'Test',
            expectedError: 'Debe seleccionar una categoría'
        },
        {
            codigo: 'TEST006',
            nombre: 'Producto Test',
            categoria: 'electronica',
            proveedor: 'Test',
            precio: '-100', // Precio negativo
            cantidad: '1',
            descripcion: 'Test',
            expectedError: 'El precio debe ser mayor o igual a 0'
        },
        {
            codigo: 'TEST007',
            nombre: 'Producto Test',
            categoria: 'electronica',
            proveedor: 'Test',
            precio: '100',
            cantidad: '-1', // Cantidad negativa
            descripcion: 'Test',
            expectedError: 'La cantidad debe ser mayor o igual a 0'
        }
    ],

    // Datos para pruebas de límites
    boundaryTests: {
        // Código de 20 caracteres (máximo permitido)
        maxCodeLength: 'ABCDEFGHIJKLMNOPQRST',
        // Nombre de 100 caracteres (máximo permitido)  
        maxNameLength: 'A'.repeat(100),
        // Descripción de 500 caracteres (máximo permitido)
        maxDescriptionLength: 'A'.repeat(500),
        // Valores límite de precio
        minPrice: '0',
        maxPrice: '999999.99',
        // Valores límite de cantidad
        minQuantity: '0',
        maxQuantity: '999999'
    },

    // Selectores CSS para los elementos
    selectors: {
        // Login page
        login: {
            usernameInput: '#username',
            passwordInput: '#password',
            submitButton: '#loginBtn',
            errorMessage: '#loginMessage',
            usernameError: '#usernameError',
            passwordError: '#passwordError',
            form: '#loginForm'
        },
        
        // Inventory page
        inventory: {
            // Formulario
            codigoInput: '#productCode',
            nombreInput: '#productName',
            categoriaSelect: '#productCategory',
            proveedorInput: '#productSupplier',
            precioInput: '#productPrice',
            cantidadInput: '#productQuantity',
            descripcionTextarea: '#productDescription',
            submitButton: 'button[type="submit"]',
            clearButton: '.btn-secondary',
            
            // Mensajes de error
            codigoError: '#productCodeError',
            nombreError: '#productNameError',
            categoriaError: '#productCategoryError',
            precioError: '#productPriceError',
            cantidadError: '#productQuantityError',
            
            // Lista de productos
            productsList: '#productsList',
            productsCount: '#productsCount',
            productCard: '.product-card',
            editButton: '.btn-edit',
            deleteButton: '.btn-delete',
            
            // Filtros y búsqueda
            searchInput: '#searchInput',
            categoryFilter: '#categoryFilter',
            supplierFilter: '#supplierFilter',
            sortFilter: '#sortFilter',
            clearFiltersButton: '.filter-actions .btn-secondary',
            
            // Mensajes
            successMessage: '.message.success',
            errorMessage: '.message.error',
            generalMessage: '#message',
            
            // Estados
            emptyState: '.empty-state',
            noResultsState: '#noResultsMessage',
            
            // Header y navegación
            userInfo: '.user-info',
            logoutButton: '[onclick="authManager.logout()"]'
        }
    },

    // Mensajes esperados
    expectedMessages: {
        login: {
            success: 'Accediendo...',
            invalidCredentials: 'Usuario o contraseña incorrectos',
            emptyUsername: 'El usuario es obligatorio',
            emptyPassword: 'La contraseña es obligatoria',
            shortUsername: 'El usuario debe tener al menos 3 caracteres',
            shortPassword: 'La contraseña debe tener al menos 6 caracteres'
        },
        
        inventory: {
            productAdded: 'agregado correctamente',
            productUpdated: 'actualizado correctamente', 
            productDeleted: 'eliminado correctamente',
            duplicateCode: 'Ya existe un producto con ese código',
            requiredCode: 'El código es obligatorio',
            requiredName: 'El nombre es obligatorio',
            requiredCategory: 'Debe seleccionar una categoría',
            invalidPrice: 'El precio debe ser mayor o igual a 0',
            invalidQuantity: 'La cantidad debe ser mayor o igual a 0'
        }
    },

    // Tiempos de espera
    timeouts: {
        short: 2000,    // 2 segundos
        medium: 5000,   // 5 segundos
        long: 10000     // 10 segundos
    }
};