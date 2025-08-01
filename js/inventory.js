// Sistema de gestión de inventario
class InventoryManager {
    constructor() {
        this.productos = [];
        this.nextId = 1;
    }

    // CREATE - Agregar producto
    agregarProducto(nombre, categoria, precio, cantidad) {
        const producto = {
            id: this.nextId++,
            nombre: nombre,
            categoria: categoria,
            precio: parseFloat(precio),
            cantidad: parseInt(cantidad),
            fechaCreacion: new Date().toLocaleDateString()
        };
        
        this.productos.push(producto);
        return producto;
    }

    // READ - Obtener todos los productos
    obtenerProductos() {
        return this.productos;
    }

    // READ - Obtener producto por ID
    obtenerProductoPorId(id) {
        return this.productos.find(producto => producto.id === parseInt(id));
    }

    // UPDATE - Actualizar producto
    actualizarProducto(id, nombre, categoria, precio, cantidad) {
        const index = this.productos.findIndex(producto => producto.id === parseInt(id));
        
        if (index !== -1) {
            this.productos[index] = {
                ...this.productos[index],
                nombre: nombre,
                categoria: categoria,
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad)
            };
            return this.productos[index];
        }
        return null;
    }

    // DELETE - Eliminar producto
    eliminarProducto(id) {
        const index = this.productos.findIndex(producto => producto.id === parseInt(id));
        
        if (index !== -1) {
            return this.productos.splice(index, 1)[0];
        }
        return null;
    }

    // Buscar productos por categoría
    buscarPorCategoria(categoria) {
        return this.productos.filter(producto => 
            producto.categoria.toLowerCase() === categoria.toLowerCase()
        );
    }

    // Obtener estadísticas básicas
    obtenerEstadisticas() {
        const totalProductos = this.productos.length;
        const valorTotal = this.productos.reduce((total, producto) => 
            total + (producto.precio * producto.cantidad), 0
        );
        
        return {
            totalProductos,
            valorTotal: valorTotal.toFixed(2)
        };
    }
}

// Crear instancia global del administrador de inventario
const inventoryManager = new InventoryManager();

// Función para renderizar productos en el DOM
function renderizarProductos() {
    const container = document.getElementById('productos-container');
    const productos = inventoryManager.obtenerProductos();
    
    if (productos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                <h3>No hay productos en el inventario</h3>
                <p>Haz clic en "Agregar Producto" para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productos.map(producto => `
        <div class="producto-card" data-id="${producto.id}">
            <h3>${producto.nombre}</h3>
            <div class="producto-info">
                <p><strong>Categoría:</strong> ${producto.categoria}</p>
                <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Valor Total:</strong> $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                <p><strong>Fecha:</strong> ${producto.fechaCreacion}</p>
            </div>
            <div class="producto-actions">
                <button class="btn-edit" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn-delete" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Función para eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        const productoEliminado = inventoryManager.eliminarProducto(id);
        if (productoEliminado) {
            renderizarProductos();
            mostrarMensaje(`Producto "${productoEliminado.nombre}" eliminado correctamente`, 'success');
        }
    }
}

// Función para editar producto (placeholder)
function editarProducto(id) {
    const producto = inventoryManager.obtenerProductoPorId(id);
    if (producto) {
        // Llenar el formulario con los datos existentes
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('cantidad').value = producto.cantidad;
        
        // Mostrar el formulario
        document.getElementById('producto-form').classList.remove('hidden');
        
        // Cambiar el comportamiento del formulario para edición
        const form = document.getElementById('form-producto');
        form.dataset.editId = id;
        
        document.querySelector('#producto-form h2').textContent = 'Editar Producto';
        document.querySelector('button[type="submit"]').textContent = 'Actualizar';
    }
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `mensaje ${tipo}`;
    messageDiv.textContent = mensaje;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        ${tipo === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remover mensaje después de 3 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}