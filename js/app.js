// Sistema de gestión de inventario mejorado con búsqueda y filtros
class InventoryManager {
    constructor() {
        this.productos = [];
        this.nextId = 1;
        this.filteredProducts = [];
        this.currentFilters = {
            search: '',
            category: '',
            supplier: '',
            sort: 'name-asc'
        };
    }

    // CREATE - Agregar producto con código único
    agregarProducto(codigo, nombre, categoria, proveedor, precio, cantidad, descripcion) {
        // Verificar código único
        if (this.productos.some(p => p.codigo === codigo)) {
            throw new Error('Ya existe un producto con ese código');
        }

        const producto = {
            id: this.nextId++,
            codigo: codigo,
            nombre: nombre,
            categoria: categoria,
            proveedor: proveedor || 'Sin proveedor',
            precio: parseFloat(precio),
            cantidad: parseInt(cantidad),
            descripcion: descripcion || '',
            fechaCreacion: new Date().toLocaleDateString()
        };
        
        this.productos.push(producto);
        this.applyFilters(); // Actualizar filtros después de agregar
        return producto;
    }

    // READ - Obtener todos los productos
    obtenerProductos() {
        return this.productos;
    }

    // READ - Obtener productos filtrados
    obtenerProductosFiltrados() {
        return this.filteredProducts;
    }

    // READ - Obtener producto por ID
    obtenerProductoPorId(id) {
        return this.productos.find(producto => producto.id === parseInt(id));
    }

    // UPDATE - Actualizar producto
    actualizarProducto(id, codigo, nombre, categoria, proveedor, precio, cantidad, descripcion) {
        const index = this.productos.findIndex(producto => producto.id === parseInt(id));
        
        if (index !== -1) {
            // Verificar código único (excluyendo el producto actual)
            const existeOtroCodigo = this.productos.some(p => p.codigo === codigo && p.id !== parseInt(id));
            if (existeOtroCodigo) {
                throw new Error('Ya existe otro producto con ese código');
            }

            this.productos[index] = {
                ...this.productos[index],
                codigo: codigo,
                nombre: nombre,
                categoria: categoria,
                proveedor: proveedor || 'Sin proveedor',
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad),
                descripcion: descripcion || ''
            };
            
            this.applyFilters(); // Actualizar filtros después de actualizar
            return this.productos[index];
        }
        return null;
    }

    // DELETE - Eliminar producto
    eliminarProducto(id) {
        const index = this.productos.findIndex(producto => producto.id === parseInt(id));
        
        if (index !== -1) {
            const eliminado = this.productos.splice(index, 1)[0];
            this.applyFilters(); // Actualizar filtros después de eliminar
            return eliminado;
        }
        return null;
    }

    // FILTROS Y BÚSQUEDA
    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.productos];

        // Filtro de búsqueda (nombre o código)
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(producto => 
                producto.nombre.toLowerCase().includes(searchTerm) ||
                producto.codigo.toLowerCase().includes(searchTerm)
            );
        }

        // Filtro por categoría
        if (this.currentFilters.category) {
            filtered = filtered.filter(producto => 
                producto.categoria === this.currentFilters.category
            );
        }

        // Filtro por proveedor
        if (this.currentFilters.supplier) {
            filtered = filtered.filter(producto => 
                producto.proveedor === this.currentFilters.supplier
            );
        }

        // Ordenamiento
        filtered.sort((a, b) => {
            switch (this.currentFilters.sort) {
                case 'name-asc':
                    return a.nombre.localeCompare(b.nombre);
                case 'name-desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'price-asc':
                    return a.precio - b.precio;
                case 'price-desc':
                    return b.precio - a.precio;
                case 'quantity-asc':
                    return a.cantidad - b.cantidad;
                case 'quantity-desc':
                    return b.cantidad - a.cantidad;
                case 'code-asc':
                    return a.codigo.localeCompare(b.codigo);
                case 'code-desc':
                    return b.codigo.localeCompare(a.codigo);
                default:
                    return 0;
            }
        });

        this.filteredProducts = filtered;
    }

    // Obtener proveedores únicos para el filtro
    obtenerProveedores() {
        const proveedores = [...new Set(this.productos.map(p => p.proveedor))];
        return proveedores.filter(p => p && p !== 'Sin proveedor').sort();
    }

    // Obtener estadísticas
    obtenerEstadisticas() {
        const totalProductos = this.productos.length;
        const valorTotal = this.productos.reduce((total, producto) => 
            total + (producto.precio * producto.cantidad), 0
        );
        
        return {
            totalProductos,
            valorTotal: valorTotal.toFixed(2),
            filteredCount: this.filteredProducts.length
        };
    }
}

// Crear instancia global del administrador de inventario
const inventoryManager = new InventoryManager();

// Variables globales para la interfaz
let editingProductId = null;

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar aplicación
function initializeApp() {
    // Configurar eventos del formulario
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', handleFormSubmit);

    // Configurar eventos de filtros
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const supplierFilter = document.getElementById('supplierFilter');
    const sortFilter = document.getElementById('sortFilter');

    searchInput.addEventListener('input', handleSearchChange);
    categoryFilter.addEventListener('change', handleFilterChange);
    supplierFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);

    // Agregar productos de ejemplo
    addSampleProducts();
    
    // Renderizar productos iniciales
    updateSupplierFilter();
    renderProducts();
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        return;
    }

    try {
        if (editingProductId) {
            // Actualizar producto existente
            inventoryManager.actualizarProducto(
                editingProductId,
                formData.codigo,
                formData.nombre,
                formData.categoria,
                formData.proveedor,
                formData.precio,
                formData.cantidad,
                formData.descripcion
            );
            showMessage(`Producto "${formData.nombre}" actualizado correctamente`, 'success');
            editingProductId = null;
            document.querySelector('button[type="submit"]').textContent = '➕ Agregar Producto';
        } else {
            // Crear nuevo producto
            inventoryManager.agregarProducto(
                formData.codigo,
                formData.nombre,
                formData.categoria,
                formData.proveedor,
                formData.precio,
                formData.cantidad,
                formData.descripcion
            );
            showMessage(`Producto "${formData.nombre}" agregado correctamente`, 'success');
        }
        
        clearForm();
        updateSupplierFilter();
        renderProducts();
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Obtener datos del formulario
function getFormData() {
    return {
        codigo: document.getElementById('productCode').value.trim(),
        nombre: document.getElementById('productName').value.trim(),
        categoria: document.getElementById('productCategory').value,
        proveedor: document.getElementById('productSupplier').value.trim(),
        precio: document.getElementById('productPrice').value,
        cantidad: document.getElementById('productQuantity').value,
        descripcion: document.getElementById('productDescription').value.trim()
    };
}

// Validar formulario
function validateForm(data) {
    clearErrors();

    let hasErrors = false;

    if (!data.codigo) {
        showFieldError('productCodeError', 'El código es obligatorio');
        hasErrors = true;
    }

    if (!data.nombre) {
        showFieldError('productNameError', 'El nombre es obligatorio');
        hasErrors = true;
    }

    if (!data.categoria) {
        showFieldError('productCategoryError', 'Debe seleccionar una categoría');
        hasErrors = true;
    }

    if (!data.precio || parseFloat(data.precio) < 0) {
        showFieldError('productPriceError', 'El precio debe ser mayor o igual a 0');
        hasErrors = true;
    }

    if (!data.cantidad || parseInt(data.cantidad) < 0) {
        showFieldError('productQuantityError', 'La cantidad debe ser mayor o igual a 0');
        hasErrors = true;
    }

    return !hasErrors;
}

// Mostrar error en campo específico
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Agregar clase de error al input
        const input = errorElement.previousElementSibling;
        if (input && input.tagName !== 'DIV') {
            input.classList.add('error');
        }
    }
}

// Limpiar errores del formulario
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Limpiar formulario
function clearForm() {
    document.getElementById('productForm').reset();
    clearErrors();
    editingProductId = null;
    document.querySelector('button[type="submit"]').textContent = '➕ Agregar Producto';
}

// Manejar cambios en la búsqueda
function handleSearchChange(event) {
    inventoryManager.setFilters({ search: event.target.value });
    renderProducts();
}

// Manejar cambios en filtros
function handleFilterChange() {
    const filters = {
        category: document.getElementById('categoryFilter').value,
        supplier: document.getElementById('supplierFilter').value,
        sort: document.getElementById('sortFilter').value
    };
    
    inventoryManager.setFilters(filters);
    renderProducts();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('supplierFilter').value = '';
    document.getElementById('sortFilter').value = 'name-asc';
    
    inventoryManager.setFilters({
        search: '',
        category: '',
        supplier: '',
        sort: 'name-asc'
    });
    
    renderProducts();
}

// Actualizar filtro de proveedores
function updateSupplierFilter() {
    const supplierFilter = document.getElementById('supplierFilter');
    const proveedores = inventoryManager.obtenerProveedores();
    
    // Mantener opción seleccionada
    const currentValue = supplierFilter.value;
    
    // Limpiar opciones existentes (excepto la primera)
    while (supplierFilter.children.length > 1) {
        supplierFilter.removeChild(supplierFilter.lastChild);
    }
    
    // Agregar proveedores únicos
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor;
        option.textContent = proveedor;
        supplierFilter.appendChild(option);
    });
    
    // Restaurar valor seleccionado si aún existe
    if (proveedores.includes(currentValue)) {
        supplierFilter.value = currentValue;
    }
}

// Renderizar productos
function renderProducts() {
    const productsList = document.getElementById('productsList');
    const productsCount = document.getElementById('productsCount');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const emptyState = productsList.querySelector('.empty-state');
    
    const productos = inventoryManager.obtenerProductosFiltrados();
    const stats = inventoryManager.obtenerEstadisticas();
    
    // Actualizar contador
    if (stats.totalProductos === 0) {
        productsCount.textContent = 'No hay productos';
    } else if (stats.filteredCount === stats.totalProductos) {
        productsCount.textContent = `${stats.totalProductos} producto${stats.totalProductos !== 1 ? 's' : ''}`;
    } else {
        productsCount.textContent = `${stats.filteredCount} de ${stats.totalProductos} productos`;
    }
    
    // Mostrar/ocultar estados
    if (stats.totalProductos === 0) {
        // No hay productos en absoluto
        if (emptyState) emptyState.style.display = 'block';
        noResultsMessage.style.display = 'none';
        productsList.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem;">📦</div>
                <h3>No hay productos</h3>
                <p>Agrega tu primer producto usando el formulario</p>
            </div>
        `;
        return;
    }
    
    if (productos.length === 0) {
        // Hay productos pero ninguno coincide con los filtros
        if (emptyState) emptyState.style.display = 'none';
        noResultsMessage.style.display = 'block';
        productsList.innerHTML = '';
        return;
    }
    
    // Hay productos para mostrar
    if (emptyState) emptyState.style.display = 'none';
    noResultsMessage.style.display = 'none';
    
    // Renderizar productos
    productsList.innerHTML = productos.map(producto => `
        <div class="product-card" data-id="${producto.id}">
            <div class="product-header">
                <div class="product-info">
                    <h3>${highlightSearchTerm(producto.nombre)}</h3>
                    <span class="product-code">${highlightSearchTerm(producto.codigo)}</span>
                </div>
            </div>
            
            <div class="product-details">
                <div class="product-detail">
                    <span class="label">Categoría</span>
                    <span class="value">${producto.categoria}</span>
                </div>
                <div class="product-detail">
                    <span class="label">Proveedor</span>
                    <span class="value">${producto.proveedor}</span>
                </div>
                <div class="product-detail">
                    <span class="label">Precio</span>
                    <span class="value">RD$ ${producto.precio.toFixed(2)}</span>
                </div>
                <div class="product-detail">
                    <span class="label">Cantidad</span>
                    <span class="value">${producto.cantidad}</span>
                </div>
            </div>
            
            ${producto.descripcion ? `
                <div style="margin-bottom: 15px;">
                    <span class="label" style="font-size: 0.8rem; color: #6c757d; font-weight: 600;">Descripción:</span>
                    <p style="margin-top: 5px; color: #495057; font-size: 0.9rem;">${producto.descripcion}</p>
                </div>
            ` : ''}
            
            <div class="product-actions">
                <button class="btn btn-small btn-edit" onclick="editProduct(${producto.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-small btn-delete" onclick="deleteProduct(${producto.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Destacar términos de búsqueda
function highlightSearchTerm(text) {
    const searchTerm = inventoryManager.currentFilters.search;
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight-search">$1</span>');
}

// Editar producto
function editProduct(id) {
    const producto = inventoryManager.obtenerProductoPorId(id);
    if (!producto) return;
    
    // Llenar formulario con datos del producto
    document.getElementById('productCode').value = producto.codigo;
    document.getElementById('productName').value = producto.nombre;
    document.getElementById('productCategory').value = producto.categoria;
    document.getElementById('productSupplier').value = producto.proveedor !== 'Sin proveedor' ? producto.proveedor : '';
    document.getElementById('productPrice').value = producto.precio;
    document.getElementById('productQuantity').value = producto.cantidad;
    document.getElementById('productDescription').value = producto.descripcion;
    
    // Cambiar modo de edición
    editingProductId = id;
    document.querySelector('button[type="submit"]').textContent = '💾 Actualizar Producto';
    
    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Eliminar producto
function deleteProduct(id) {
    const producto = inventoryManager.obtenerProductoPorId(id);
    if (!producto) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar "${producto.nombre}"?`)) {
        inventoryManager.eliminarProducto(id);
        updateSupplierFilter();
        renderProducts();
        showMessage(`Producto "${producto.nombre}" eliminado correctamente`, 'success');
    }
}

// Mostrar mensajes
function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message ${type} show`;
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Agregar productos de ejemplo
function addSampleProducts() {
    if (inventoryManager.obtenerProductos().length === 0) {
        try {
            inventoryManager.agregarProducto('ELEC001', 'Laptop Dell XPS 13', 'electronica', 'TechStore RD', 89999.99, 5, 'Laptop ultrabook con procesador Intel i7');
            inventoryManager.agregarProducto('ROPA001', 'Camiseta Nike Dri-FIT', 'ropa', 'Nike Store', 1599.00, 25, 'Camiseta deportiva transpirable');
            inventoryManager.agregarProducto('HOGAR001', 'Cafetera Express Oster', 'hogar', 'Oster Dominicana', 4999.99, 12, 'Cafetera automática con sistema de espresso');
            inventoryManager.agregarProducto('DEP001', 'Balón de Fútbol Adidas', 'deportes', 'Sports World', 2499.00, 8, 'Balón oficial FIFA tamaño 5');
            inventoryManager.agregarProducto('OFIC001', 'Silla Ergonómica', 'oficina', 'Office Depot', 12999.00, 3, 'Silla de oficina con soporte lumbar');
        } catch (error) {
            console.log('Productos de ejemplo ya agregados');
        }
    }
}