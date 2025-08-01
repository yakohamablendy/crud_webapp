// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const btnAgregar = document.getElementById('btn-agregar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formProducto = document.getElementById('form-producto');
    const productoFormSection = document.getElementById('producto-form');
    
    // Eventos de botones
    btnAgregar.addEventListener('click', mostrarFormulario);
    btnCancelar.addEventListener('click', ocultarFormulario);
    formProducto.addEventListener('submit', manejarSubmitFormulario);
    
    // Cargar productos al iniciar
    renderizarProductos();
    
    // Agregar algunos productos de ejemplo
    agregarProductosEjemplo();
});

// Mostrar formulario de producto
function mostrarFormulario() {
    const formSection = document.getElementById('producto-form');
    const form = document.getElementById('form-producto');
    
    // Limpiar formulario
    form.reset();
    delete form.dataset.editId;
    
    // Restaurar títulos originales
    document.querySelector('#producto-form h2').textContent = 'Agregar Nuevo Producto';
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
    
    // Mostrar formulario
    formSection.classList.remove('hidden');
    formSection.scrollIntoView({ behavior: 'smooth' });
}

// Ocultar formulario de producto
function ocultarFormulario() {
    const formSection = document.getElementById('producto-form');
    const form = document.getElementById('form-producto');
    
    formSection.classList.add('hidden');
    form.reset();
    delete form.dataset.editId;
}

// Manejar envío del formulario
function manejarSubmitFormulario(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value;
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;
    
    // Validar datos
    if (!validarFormulario(nombre, categoria, precio, cantidad)) {
        return;
    }
    
    // Verificar si es edición o creación
    const form = document.getElementById('form-producto');
    const editId = form.dataset.editId;
    
    if (editId) {
        // Actualizar producto existente
        const productoActualizado = inventoryManager.actualizarProducto(
            editId, nombre, categoria, precio, cantidad
        );
        
        if (productoActualizado) {
            mostrarMensaje(`Producto "${nombre}" actualizado correctamente`, 'success');
            renderizarProductos();
            ocultarFormulario();
        }
    } else {
        // Crear nuevo producto
        const nuevoProducto = inventoryManager.agregarProducto(
            nombre, categoria, precio, cantidad
        );
        
        mostrarMensaje(`Producto "${nombre}" agregado correctamente`, 'success');
        renderizarProductos();
        form.reset(); // Limpiar formulario para el siguiente producto
    }
}

// Validar formulario
function validarFormulario(nombre, categoria, precio, cantidad) {
    if (!nombre) {
        mostrarMensaje('El nombre del producto es obligatorio', 'error');
        return false;
    }
    
    if (!categoria) {
        mostrarMensaje('Debe seleccionar una categoría', 'error');
        return false;
    }
    
    if (!precio || parseFloat(precio) < 0) {
        mostrarMensaje('El precio debe ser un número válido mayor o igual a 0', 'error');
        return false;
    }
    
    if (!cantidad || parseInt(cantidad) < 0) {
        mostrarMensaje('La cantidad debe ser un número entero mayor o igual a 0', 'error');
        return false;
    }
    
    // Verificar si ya existe un producto con el mismo nombre (solo para nuevos productos)
    const form = document.getElementById('form-producto');
    if (!form.dataset.editId) {
        const productosExistentes = inventoryManager.obtenerProductos();
        const existe = productosExistentes.some(producto => 
            producto.nombre.toLowerCase() === nombre.toLowerCase()
        );
        
        if (existe) {
            mostrarMensaje('Ya existe un producto con ese nombre', 'error');
            return false;
        }
    }
    
    return true;
}

// Agregar productos de ejemplo
function agregarProductosEjemplo() {
    // Solo agregar si no hay productos
    if (inventoryManager.obtenerProductos().length === 0) {
        inventoryManager.agregarProducto('Laptop Dell XPS 13', 'electronica', 1299.99, 5);
        inventoryManager.agregarProducto('Camiseta Nike', 'ropa', 29.99, 20);
        inventoryManager.agregarProducto('Cafetera Express', 'hogar', 89.99, 8);
        inventoryManager.agregarProducto('Balón de Fútbol', 'deportes', 24.99, 15);
        
        renderizarProductos();
    }
}

// Funciones de utilidad adicionales
function buscarProductos() {
    // Función para implementar búsqueda (futuro)
    console.log('Función de búsqueda por implementar');
}

function exportarInventario() {
    // Función para exportar datos (futuro)
    const productos = inventoryManager.obtenerProductos();
    console.log('Exportar inventario:', productos);
}

function importarInventario() {
    // Función para importar datos (futuro)
    console.log('Función de importación por implementar');
}

// Función para obtener estadísticas del inventario
function mostrarEstadisticas() {
    const stats = inventoryManager.obtenerEstadisticas();
    console.log('Estadísticas del inventario:', stats);
    
    mostrarMensaje(
        `Total productos: ${stats.totalProductos}, Valor total: $${stats.valorTotal}`, 
        'success'
    );
}

// Agregar evento de teclado para shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + N para nuevo producto
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        mostrarFormulario();
    }
    
    // Escape para cerrar formulario
    if (event.key === 'Escape') {
        const formSection = document.getElementById('producto-form');
        if (!formSection.classList.contains('hidden')) {
            ocultarFormulario();
        }
    }
});