// PICANTERÍA LOS TUNALES - JAVASCRIPT PRINCIPAL

let currentTab = 'tienda';
let cart = [];
let cartCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏪 Picantería Los Tunales - Iniciando...');
    initCarousel();
    loadProducts();
    createFloatingCart();
});

function initCarousel() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            if (tabId === currentTab) return;
            
            // Remover active de todos
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Agregar active al seleccionado
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            currentTab = tabId;
            
            // Cargar contenido según tab
            if (tabId === 'tienda') {
                loadProducts();
            } else if (tabId === 'nosotros') {
                loadNosotros();
            } else if (tabId === 'ubicacion') {
                loadUbicacion();
            }
        });
    });
}

function loadProducts() {
    const tiendaTab = document.getElementById('tienda');
    if (!tiendaTab) return;
    
    // 15 platos tradicionales arequipeños
    const productos = [
        { id: 1, nombre: 'Chairo de Tunales', precio: 18.90, descripcion: 'Sopa tradicional con chuño y carne de llama', emoji: '🍲' },
        { id: 2, nombre: 'Soltero de Queso', precio: 22.50, descripcion: 'Habas tiernas con queso fresco y choclo', emoji: '🧀' },
        { id: 3, nombre: 'Ocopa Arequipeña', precio: 24.00, descripcion: 'Salsa de huacatay con papas y queso', emoji: '🥔' },
        { id: 4, nombre: 'Rocoto Relleno', precio: 26.80, descripcion: 'Rocoto relleno con carne y queso', emoji: '🌶️' },
        { id: 5, nombre: 'Pastel de Papa', precio: 20.50, descripcion: 'Pastel de papa con carne molida', emoji: '🥙' },
        { id: 6, nombre: 'Adobo Arequipeño', precio: 32.00, descripcion: 'Cerdo marinado con chicha de jora', emoji: '🍖' },
        { id: 7, nombre: 'Chicharrón de Chancho', precio: 28.90, descripcion: 'Cerdo frito con camote y sarza', emoji: '🥓' },
        { id: 8, nombre: 'Cuy Chactado', precio: 45.00, descripcion: 'Cuy frito tradicional arequipeño', emoji: '🐭' },
        { id: 9, nombre: 'Zambo Racacho', precio: 35.00, descripcion: 'Plato típico con zambo y mote', emoji: '🎃' },
        { id: 10, nombre: 'Timpo de Tunales', precio: 38.50, descripcion: 'Sopa de miércoles santo con carne', emoji: '🍜' },
        { id: 11, nombre: 'Pepián de Cordero', precio: 42.00, descripcion: 'Cordero en salsa de ají y hierbas', emoji: '🐑' },
        { id: 12, nombre: 'Causa Arequipeña', precio: 19.90, descripcion: 'Causa rellena con pollo o atún', emoji: '🥚' },
        { id: 13, nombre: 'Enrollado de Pollo', precio: 23.50, descripcion: 'Pollo enrollado con aceitunas', emoji: '🍗' },
        { id: 14, nombre: 'Chupe de Viernes', precio: 30.00, descripcion: 'Chupe tradicional de los viernes', emoji: '🍲' },
        { id: 15, nombre: 'Queso Helado', precio: 12.90, descripcion: 'Helado tradicional de queso', emoji: '🍦' }
    ];
    
    let productosHTML = `
        <div class="tienda-container">
            <div class="shop-header">
                <h2>Nuestra Picantería</h2>
                <p>15 platos tradicionales arequipeños</p>
                <div class="view-controls">
                    <button class="view-btn active" data-columns="1" onclick="changeColumns(1)">
                        <i class="fas fa-list"></i> 1 Columna
                    </button>
                    <button class="view-btn" data-columns="2" onclick="changeColumns(2)">
                        <i class="fas fa-th-large"></i> 2 Columnas
                    </button>
                    <button class="view-btn" data-columns="3" onclick="changeColumns(3)">
                        <i class="fas fa-th"></i> 3 Columnas
                    </button>
                </div>
            </div>
            <div class="products-grid" id="products-grid">
    `;
    
    productos.forEach(producto => {
        productosHTML += `
            <div class="product-card">
                <div class="product-image">
                    <span class="product-emoji">${producto.emoji}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-price">S/ ${producto.precio.toFixed(2)}</p>
                    <p class="product-description">${producto.descripcion}</p>
                    <div class="product-actions">
                        <div class="quantity-control">
                            <button class="btn-minus" onclick="changeQuantity(${producto.id}, -1)">-</button>
                            <span class="quantity" id="qty-${producto.id}">1</span>
                            <button class="btn-plus" onclick="changeQuantity(${producto.id}, 1)">+</button>
                        </div>
                        <button class="btn-add-cart" onclick="addToCart(${producto.id})">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    productosHTML += `
            </div>
        </div>
    `;
    
    tiendaTab.innerHTML = productosHTML;
    
    // Agregar estilos de productos
    if (!document.getElementById('product-styles')) {
        const style = document.createElement('style');
        style.id = 'product-styles';
        style.textContent = `
            .tienda-container {
                padding: 20px;
                min-height: 500px;
            }
            
            .shop-header {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .shop-header h2 {
                font-size: 1.4em;
                font-weight: 600;
                background: var(--gradient-accent);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 5px;
            }
            
            .shop-header p {
                color: var(--text-gray);
                font-size: 0.8em;
                margin-bottom: 15px;
            }
            
            .view-controls {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 10px;
                flex-wrap: wrap;
            }
            
            .view-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 107, 107, 0.3);
                color: var(--text-light);
                padding: 6px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 500;
                font-size: 0.7em;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .view-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-1px);
            }
            
            .view-btn.active {
                background: var(--gradient-sunset);
                border-color: var(--accent-yellow);
                box-shadow: var(--shadow-glow);
            }
            
            .view-btn i {
                font-size: 0.8em;
            }
            
            .products-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
                max-width: 1200px;
                margin: 0 auto;
                transition: var(--transition);
            }
            
            .products-grid.cols-1 {
                grid-template-columns: 1fr;
                max-width: 600px;
            }
            
            .products-grid.cols-1 .product-card {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            
            .products-grid.cols-1 .product-image {
                width: 120px;
                height: 120px;
                flex-shrink: 0;
            }
            
            .products-grid.cols-1 .product-info {
                flex: 1;
                padding: 20px;
            }
            
            .products-grid.cols-2 {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .products-grid.cols-3 {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .product-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 107, 107, 0.2);
                border-radius: var(--radius-md);
                overflow: hidden;
                transition: var(--transition);
                position: relative;
            }
            
            .product-card:hover {
                transform: translateY(-3px);
                border-color: var(--accent-coral);
                box-shadow: var(--shadow-glow);
            }
            
            .product-image {
                height: 120px;
                background: var(--gradient-beach);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5em;
            }
            
            .product-emoji {
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            }
            
            .product-info {
                padding: 15px;
            }
            
            .product-name {
                font-size: 0.95em;
                font-weight: 600;
                color: var(--text-light);
                margin-bottom: 5px;
            }
            
            .product-price {
                font-size: 1em;
                font-weight: 700;
                color: var(--accent-coral);
                margin-bottom: 5px;
            }
            
            .product-description {
                color: var(--text-gray);
                font-size: 0.75em;
                margin-bottom: 10px;
                line-height: 1.3;
            }
            
            .product-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .quantity-control {
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 15px;
                overflow: hidden;
            }
            
            .btn-minus, .btn-plus {
                background: transparent;
                border: none;
                color: var(--text-light);
                width: 25px;
                height: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: var(--transition);
            }
            
            .btn-minus:hover, .btn-plus:hover {
                background: var(--accent-coral);
            }
            
            .quantity {
                padding: 0 8px;
                color: var(--text-light);
                font-weight: 600;
                min-width: 15px;
                text-align: center;
            }
            
            .btn-add-cart {
                flex: 1;
                background: var(--gradient-sunset);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 500;
                font-size: 0.75em;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0px;
            }
            
            .btn-add-cart:hover {
                transform: scale(1.02);
                box-shadow: var(--shadow-glow);
            }
            
            @media (max-width: 768px) {
                .products-grid {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                
                .tienda-container {
                    padding: 20px;
                }
            }
            
            @media (max-width: 480px) {
                .products-grid {
                    grid-template-columns: 1fr;
                }
                
                .product-actions {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .quantity-control {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Guardar productos para el carrito
    window.productos = productos;
}

function changeQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyElement.textContent);
    let newQty = Math.max(1, currentQty + change);
    qtyElement.textContent = newQty;
}

function addToCart(productId) {
    const producto = window.productos.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).textContent);
    
    for (let i = 0; i < quantity; i++) {
        cart.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            emoji: producto.emoji
        });
    }
    
    cartCount += quantity;
    updateCartCount();
    
    // Resetear cantidad
    document.getElementById(`qty-${productId}`).textContent = '1';
    
    showNotification(`${quantity} x ${producto.nombre} agregado(s) al carrito`);
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

function createFloatingCart() {
    const floatingCart = document.createElement('div');
    floatingCart.className = 'floating-cart';
    floatingCart.innerHTML = `
        <div class='cart-icon'>
            <i class='fas fa-shopping-cart'></i>
            <span class='cart-count'>0</span>
        </div>
    `;
    
    floatingCart.style.cssText = `
        position: fixed;
        bottom: 15px;
        right: 15px;
        width: 50px;
        height: 50px;
        background: var(--gradient-sunset);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow-glow);
        transition: var(--transition);
    `;
    
    floatingCart.addEventListener('mouseenter', () => {
        floatingCart.style.transform = 'scale(1.05)';
    });
    
    floatingCart.addEventListener('mouseleave', () => {
        floatingCart.style.transform = 'scale(1)';
    });
    
    floatingCart.addEventListener('click', () => {
        showCartDetails();
    });
    
    document.body.appendChild(floatingCart);
    
    // Estilos del carrito
    const cartStyle = document.createElement('style');
    cartStyle.textContent = `
        .floating-cart {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        
        .cart-icon {
            position: relative;
            color: white;
            font-size: 1.2em;
        }
        
        .cart-count {
            position: absolute;
            top: -6px;
            right: -6px;
            background: var(--accent-coral);
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 0.6em;
            font-weight: 700;
        }
    `;
    document.head.appendChild(cartStyle);
}

function showCartDetails() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío');
        return;
    }
    
    // Agrupar productos por id
    const groupedCart = {};
    cart.forEach(item => {
        if (!groupedCart[item.id]) {
            groupedCart[item.id] = {
                ...item,
                quantity: 0
            };
        }
        groupedCart[item.id].quantity++;
    });
    
    let cartHTML = `
        <div class="cart-modal">
            <div class="cart-header">
                <h3>🛒 Tu Carrito</h3>
                <button class="btn-close" onclick="closeCartModal()">×</button>
            </div>
            <div class="cart-items">
    `;
    
    let total = 0;
    Object.values(groupedCart).forEach(item => {
        const subtotal = item.precio * item.quantity;
        total += subtotal;
        cartHTML += `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-info">
                    <span class="item-emoji">${item.emoji}</span>
                    <div class="item-details">
                        <h4>${item.nombre}</h4>
                        <p>S/ ${item.precio.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="cart-quantity-control">
                        <button class="cart-btn-minus" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="cart-quantity" id="cart-qty-${item.id}">${item.quantity}</span>
                        <button class="cart-btn-plus" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div class="item-subtotal">S/ ${subtotal.toFixed(2)}</div>
                    <button class="btn-delete-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total: S/ ${total.toFixed(2)}</strong>
                </div>
                <div class="cart-actions">
                    <button class="btn-whatsapp" onclick="sendToWhatsApp()">
                        <i class="fas fa-whatsapp"></i> Pedir por WhatsApp
                    </button>
                    <button class="btn-clear" onclick="clearCart()">Vaciar</button>
                </div>
            </div>
        </div>
    `;
    
    showModal(cartHTML);
}

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeModal()"></div>
        <div class="modal-content">
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Estilos del modal
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
            }
            
            .modal-content {
                position: relative;
                background: var(--secondary-dark);
                border: 2px solid var(--accent-coral);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .cart-modal {
                padding: 25px;
            }
            
            .cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .cart-header h3 {
                font-size: 1.5em;
                color: var(--text-light);
            }
            
            .btn-close {
                background: transparent;
                border: none;
                color: var(--text-gray);
                font-size: 1.5em;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .btn-close:hover {
                background: var(--accent-coral);
                color: white;
            }
            
            .cart-items {
                margin-bottom: 20px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .cart-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--radius-md);
                margin-bottom: 10px;
                border: 1px solid rgba(255, 107, 107, 0.1);
                transition: var(--transition);
            }
            
            .cart-item:hover {
                border-color: var(--accent-coral);
                transform: translateY(-1px);
                box-shadow: var(--shadow-glow);
            }
            
            .item-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }
            
            .item-emoji {
                font-size: 1.5em;
            }
            
            .item-details h4 {
                color: var(--text-light);
                margin-bottom: 4px;
            }
            
            .item-details p {
                color: var(--text-gray);
                font-size: 0.9em;
            }
            
            .item-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .cart-quantity-control {
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                overflow: hidden;
            }
            
            .cart-btn-minus,
            .cart-btn-plus {
                background: transparent;
                border: none;
                color: var(--text-light);
                width: 25px;
                height: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .cart-btn-minus:hover,
            .cart-btn-plus:hover {
                background: var(--accent-coral);
            }
            
            .cart-quantity {
                padding: 0 8px;
                color: var(--text-light);
                font-weight: 600;
                min-width: 20px;
                text-align: center;
                font-size: 0.9em;
            }
            
            .item-subtotal {
                font-weight: 700;
                color: var(--accent-coral);
                min-width: 60px;
                text-align: right;
            }
            
            .btn-delete-item {
                background: transparent;
                border: none;
                color: var(--text-gray);
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .btn-delete-item:hover {
                background: var(--accent-coral);
                color: white;
                transform: scale(1.1);
            }
            
            .cart-footer {
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .cart-total {
                text-align: right;
                margin-bottom: 15px;
                font-size: 1.2em;
                color: var(--text-light);
            }
            
            .cart-actions {
                display: flex;
                gap: 10px;
            }
            
            .btn-whatsapp {
                flex: 1;
                background: #25D366;
                color: white;
                border: none;
                padding: 12px;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .btn-whatsapp:hover {
                transform: scale(1.02);
            }
            
            .btn-clear {
                background: transparent;
                color: var(--accent-coral);
                border: 1px solid var(--accent-coral);
                padding: 12px;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition);
            }
            
            .btn-clear:hover {
                background: var(--accent-coral);
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function closeCartModal() {
    closeModal();
}

function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartCount();
    closeCartModal();
    showNotification('Carrito vaciado');
}

function sendToWhatsApp() {
    if (cart.length === 0) return;
    
    // Agrupar productos
    const groupedCart = {};
    cart.forEach(item => {
        if (!groupedCart[item.id]) {
            groupedCart[item.id] = {
                ...item,
                quantity: 0
            };
        }
        groupedCart[item.id].quantity++;
    });
    
    let message = '🏪 *PEDIDO PICANTERÍA LOS TUNALES*\n\n';
    message += '📋 *Detalles del pedido:*\n\n';
    
    let total = 0;
    Object.values(groupedCart).forEach(item => {
        const subtotal = item.precio * item.quantity;
        total += subtotal;
        message += `• ${item.quantity}x ${item.nombre} - S/ ${subtotal.toFixed(2)}\n`;
    });
    
    message += `\n💰 *Total: S/ ${total.toFixed(2)}*\n\n`;
    message += '📍 *Dirección:* Calle La Merced 456, Arequipa\n';
    message += '📞 *Teléfono:* 054-123456\n\n';
    message += '⏰ *Horario:* Lunes a Sábado 10:00 AM - 6:00 PM\n\n';
    message += '¡Gracias por tu pedido! 🍲';
    
    const whatsappURL = `https://wa.me/51987654321?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadNosotros() {
    const nosotrosTab = document.getElementById('nosotros');
    if (!nosotrosTab) return;
    
    nosotrosTab.innerHTML = `
        <div class="nosotros-container">
            <div class="about-header">
                <h2>Picantería Los Tunales</h2>
                <p>Tradición arequipeña desde 1950</p>
            </div>
            <div class="about-content">
                <div class="about-story">
                    <h3>Nuestra Historia</h3>
                    <p>Somos una picantería familiar con más de 70 años de tradición. Desde nuestros inicios en 1950, nos hemos dedicado a preservar y compartir la rica tradición culinaria arequipeña.</p>
                    <div class="values-grid">
                        <div class="value-item">
                            <i class="fas fa-heart"></i>
                            <span>Hecho con amor</span>
                        </div>
                        <div class="value-item">
                            <i class="fas fa-leaf"></i>
                            <span>Ingredientes frescos</span>
                        </div>
                        <div class="value-item">
                            <i class="fas fa-star"></i>
                            <span>Calidad excepcional</span>
                        </div>
                        <div class="value-item">
                            <i class="fas fa-users"></i>
                            <span>Servicio amigable</span>
                        </div>
                    </div>
                </div>
                <div class="about-stats">
                    <div class="stat-box">
                        <span class="stat-number">70+</span>
                        <span class="stat-label">Años de Tradición</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">5000+</span>
                        <span class="stat-label">Clientes Felices</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">15</span>
                        <span class="stat-label">Platos Tradicionales</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos de Nosotros
    if (!document.getElementById('nosotros-styles')) {
        const style = document.createElement('style');
        style.id = 'nosotros-styles';
        style.textContent = `
            .nosotros-container {
                padding: 40px;
                min-height: 500px;
            }
            
            .about-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .about-header h2 {
                font-size: 2.2em;
                font-weight: 800;
                background: var(--gradient-accent);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 10px;
            }
            
            .about-header p {
                color: var(--text-gray);
                font-size: 1.1em;
            }
            
            .about-content {
                max-width: 1000px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 40px;
                align-items: start;
            }
            
            .about-story h3 {
                font-size: 1.5em;
                color: var(--text-light);
                margin-bottom: 15px;
            }
            
            .about-story p {
                color: var(--text-gray);
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .values-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .value-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--radius-md);
                border: 1px solid rgba(255, 107, 107, 0.2);
                transition: var(--transition);
            }
            
            .value-item:hover {
                border-color: var(--accent-coral);
                transform: translateY(-2px);
            }
            
            .value-item i {
                color: var(--accent-coral);
                font-size: 1.2em;
            }
            
            .value-item span {
                color: var(--text-light);
                font-weight: 500;
            }
            
            .about-stats {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .stat-box {
                background: rgba(255, 255, 255, 0.05);
                padding: 25px;
                border-radius: var(--radius-lg);
                text-align: center;
                border: 1px solid rgba(255, 107, 107, 0.2);
                transition: var(--transition);
            }
            
            .stat-box:hover {
                border-color: var(--accent-coral);
                transform: translateY(-3px);
                box-shadow: var(--shadow-glow);
            }
            
            .stat-number {
                display: block;
                font-size: 2em;
                font-weight: 900;
                color: var(--accent-coral);
                margin-bottom: 5px;
            }
            
            .stat-label {
                color: var(--text-gray);
                font-size: 0.9em;
            }
            
            @media (max-width: 768px) {
                .nosotros-container {
                    padding: 25px;
                }
                
                .about-content {
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                
                .values-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function loadUbicacion() {
    const ubicacionTab = document.getElementById('ubicacion');
    if (!ubicacionTab) return;
    
    ubicacionTab.innerHTML = `
        <div class="ubicacion-container">
            <div class="location-header">
                <h2>Ubicación</h2>
                <p>Visítanos en Arequipa</p>
            </div>
            <div class="location-content">
                <div class="map-section">
                    <div class="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.123456789!2d-71.539123!3d-16.398876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9102424b4b4b4b4b%3A0x4b4b4b4b4b4b4b!2sArequipa%2C+Per%C3%BA!5e0!3m2!1ses!2spe!4v1234567890" 
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <div class="location-info">
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-store"></i>
                        </div>
                        <div class="info-content">
                            <h3>Dirección</h3>
                            <p>Calle La Merced 456<br>Centro Histórico<br>Arequipa, Perú</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="info-content">
                            <h3>Horario</h3>
                            <p>Lunes a Sábado: 10:00 AM - 6:00 PM<br>Domingos: 10:00 AM - 4:00 PM</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="info-content">
                            <h3>Contacto</h3>
                            <p>Teléfono: 054-123456<br>Celular: 987-654321</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="info-content">
                            <h3>Email</h3>
                            <p>info@picanterialostunales.com<br>reservas@picanterialostunales.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos de Ubicación
    if (!document.getElementById('ubicacion-styles')) {
        const style = document.createElement('style');
        style.id = 'ubicacion-styles';
        style.textContent = `
            .ubicacion-container {
                padding: 40px;
                min-height: 500px;
            }
            
            .location-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .location-header h2 {
                font-size: 2.2em;
                font-weight: 800;
                background: var(--gradient-accent);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 10px;
            }
            
            .location-header p {
                color: var(--text-gray);
                font-size: 1.1em;
            }
            
            .location-content {
                max-width: 1200px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 30px;
            }
            
            .map-container {
                border-radius: var(--radius-lg);
                overflow: hidden;
                box-shadow: var(--shadow);
                position: relative;
                height: 400px;
            }
            
            .map-container iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .location-info {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .info-card {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: var(--radius-lg);
                border: 1px solid rgba(255, 107, 107, 0.2);
                display: flex;
                align-items: flex-start;
                gap: 15px;
                transition: var(--transition);
            }
            
            .info-card:hover {
                border-color: var(--accent-coral);
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
            
            .info-icon {
                width: 45px;
                height: 45px;
                background: var(--gradient-beach);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-light);
                font-size: 1.2em;
                flex-shrink: 0;
            }
            
            .info-content h3 {
                font-size: 1.1em;
                font-weight: 600;
                color: var(--text-light);
                margin-bottom: 5px;
            }
            
            .info-content p {
                color: var(--text-gray);
                line-height: 1.4;
                font-size: 0.9em;
            }
            
            @media (max-width: 768px) {
                .ubicacion-container {
                    padding: 25px;
                }
                
                .location-content {
                    grid-template-columns: 1fr;
                    gap: 25px;
                }
                
                .map-container {
                    height: 300px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}


// CART CONTROL FUNCTIONS
function updateCartQuantity(productId, change) {
    // Find all items with this product ID in cart
    const productItems = cart.filter(item => item.id === productId);
    
    if (change > 0) {
        // Add one more item
        const product = window.productos.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                emoji: product.emoji
            });
            cartCount++;
        }
    } else if (change < 0 && productItems.length > 0) {
        // Remove one item
        const indexToRemove = cart.findIndex(item => item.id === productId);
        if (indexToRemove !== -1) {
            cart.splice(indexToRemove, 1);
            cartCount--;
        }
    }
    
    updateCartCount();
    
    // Refresh cart modal if open
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        closeCartModal();
        setTimeout(() => showCartDetails(), 100);
    }
    
    if (change > 0) {
        const product = window.productos.find(p => p.id === productId);
        showNotification('+' + product.nombre + ' agregado');
    } else {
        const product = window.productos.find(p => p.id === productId);
        showNotification('- ' + product.nombre + ' eliminado');
    }
}

function removeFromCart(productId) {
    // Remove all items with this product ID
    const initialCount = cart.length;
    cart = cart.filter(item => item.id !== productId);
    const removedCount = initialCount - cart.length;
    cartCount = cart.length;
    
    updateCartCount();
    
    // Refresh cart modal if open
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        closeCartModal();
        setTimeout(() => showCartDetails(), 100);
    }
    
    const product = window.productos.find(p => p.id === productId);
    showNotification(removedCount + ' x ' + product.nombre + ' eliminado(s)');
}



// COLUMN CHANGE FUNCTION
function changeColumns(columns) {
    const grid = document.getElementById('products-grid');
    const buttons = document.querySelectorAll('.view-btn');
    
    // Remove all column classes
    grid.classList.remove('cols-1', 'cols-2', 'cols-3');
    
    // Add the new column class
    grid.classList.add('cols-' + columns);
    
    // Update button states
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-columns')) === columns) {
            btn.classList.add('active');
        }
    });
    
    // Show notification
    showNotification('Vista: ' + columns + ' columna' + (columns > 1 ? 's' : ''));
}

