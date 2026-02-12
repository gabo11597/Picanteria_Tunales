/**
 * GESTIÓN DEL CARRITO
 */

let cart = [];

function openCart() {
    document.getElementById('cartModal').classList.add('active');
    updateCartDisplay();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function updateCart() {
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const buyBtn = document.querySelector('.btn-buy');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <p>Tu carrito está vacío</p>
                <p>¡Agrega productos para empezar!</p>
            </div>
        `;
        buyBtn.disabled = true;
        return;
    }
    
    buyBtn.disabled = false;
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">Cantidad: ${item.quantity}</div>
                </div>
                <div class="cart-item-price">S/ ${subtotal.toFixed(2)}</div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Quitar</button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function buyNow() {
    if (cart.length === 0) return;
    
    let message = '🛍️ *Mi Pedido:*\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• ${item.name} x${item.quantity} = S/ ${subtotal.toFixed(2)}\n`;
    });
    
    message += `\n*Total: S/ ${total.toFixed(2)}*\n\n¿Cuál es el costo de envío?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Cerrar modal al clickear afuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cartModal');
    if (e.target === modal) {
        closeCart();
    }
});
