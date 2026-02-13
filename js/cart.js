(function() {
  // Variables privadas
  let cart = [];
  let cartCount = 0;

  // Configuración de expiración
  const EXPIRATION_CONFIG = {
    type: 'INACTIVITY',
    inactivityHours: 2
  };

  // Cargar carrito desde localStorage con manejo de errores y expiración
  try {
    const storedData = localStorage.getItem('cartData');
    if (storedData) {
      const data = JSON.parse(storedData);
      const now = Date.now();
      const expirationTime = EXPIRATION_CONFIG.inactivityHours * 60 * 60 * 1000; // horas a ms

      if (now - data.lastActivity < expirationTime) {
        cart = data.cart;
        cartCount = data.cartCount;
        console.log('✅ Carrito cargado desde localStorage (válido)');
      } else {
        console.log('⏰ Carrito expirado por inactividad, limpiando');
        localStorage.removeItem('cartData');
      }
    }
  } catch (e) {
    console.error('Error cargando carrito desde localStorage, reseteando:', e);
    localStorage.removeItem('cartData');
  }

  // Función para guardar carrito con debounce
  let saveTimer;
  const saveCart = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        const data = {
          cart: cart,
          cartCount: cartCount,
          lastActivity: Date.now()
        };
        localStorage.setItem('cartData', JSON.stringify(data));
        console.log('✅ Carrito guardado en localStorage');
      } catch (e) {
        console.error('❌ Error guardando carrito en localStorage:', e);
        if (typeof showNotification === 'function') {
          showNotification('Error al guardar carrito');
        }
      }
    }, 300);
  };

  // Función auxiliar privada
  function groupCart(cartArray) {
    const grouped = {};
    cartArray.forEach((item) => {
      if (!grouped[item.id]) {
        grouped[item.id] = {
          ...item,
          quantity: 0,
        };
      }
      grouped[item.id].quantity++;
    });
    return grouped;
  }

  function addToCart(productId) {
    console.log('🛒 addToCart llamado con productId:', productId);
    
    // ✅ VALIDACIÓN 1: Verificar que window.productos existe
    if (!window.productos) {
      console.error('❌ window.productos no está definido');
      if (typeof showNotification === 'function') {
        showNotification('Error: Productos no cargados');
      }
      return;
    }

    // ✅ VALIDACIÓN 2: Buscar el producto
    const producto = window.productos.find((p) => p.id === productId);
    
    if (!producto) {
      console.error('❌ Producto no encontrado con ID:', productId);
      if (typeof showNotification === 'function') {
        showNotification('Error: Producto no encontrado');
      }
      return;
    }

    console.log('✅ Producto encontrado:', producto);

    // ✅ VALIDACIÓN 3: Verificar que el elemento de cantidad existe
    const qtyElement = document.getElementById(`qty-${productId}`);
    
    if (!qtyElement) {
      console.error('❌ Elemento de cantidad no encontrado para ID:', productId);
      if (typeof showNotification === 'function') {
        showNotification('Error al agregar producto');
      }
      return;
    }

    const quantity = parseInt(qtyElement.textContent, 10);
    
    if (isNaN(quantity) || quantity < 1) {
      console.error('❌ Cantidad inválida:', quantity);
      return;
    }

    console.log('✅ Agregando', quantity, 'unidades al carrito');

    // Agregar al carrito
    for (let i = 0; i < quantity; i++) {
      cart.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        emoji: producto.emoji,
      });
    }

    cartCount += quantity;
    console.log('✅ Carrito actualizado. Total items:', cartCount);
    
    updateCartCount();

    // Guardar en localStorage
    saveCart();

    // Resetear cantidad
    qtyElement.textContent = "1";

    // Notificar al usuario
    if (typeof showNotification === 'function') {
      showNotification(`✅ ${quantity} x ${producto.nombre} agregado al carrito`);
    } else {
      console.log(`✅ ${quantity} x ${producto.nombre} agregado al carrito`);
    }
  }

  function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
      cartCountElement.style.display = cartCount > 0 ? "flex" : "none";
      console.log('✅ Contador actualizado:', cartCount);
    } else {
      console.warn('⚠️ Elemento .cart-count no encontrado');
    }
  }

  function showCartDetails() {
    if (cart.length === 0) {
      if (typeof showNotification === 'function') {
        showNotification("El carrito está vacío");
      }
      return;
    }

    const groupedCart = groupCart(cart);

    let cartHTML = `
        <div class="cart-modal">
            <div class="cart-header">
                <h3>🛒 Tu Carrito</h3>
                <button class="btn-close">×</button>
            </div>
            <div class="cart-items">
    `;

    let total = 0;
    Object.values(groupedCart).forEach((item) => {
      const subtotal = item.precio * item.quantity;
      total += subtotal;
      cartHTML += `
            <div class="cart-item" data-product-id="${item.id}" role="listitem" aria-label="Producto en carrito: ${item.nombre}">
                <div class="item-info">
                    ${(() => {
                      const producto = window.productos?.find(p => p.id === item.id);
                      return producto && producto.imagen
                        ? `<img class="cart-thumb" src="${producto.imagen}" alt="Miniatura de ${item.nombre}">`
                        : `<span class="item-emoji">${item.emoji}</span>`;
                    })()}
                    <div class="item-details">
                        <h4>${item.nombre}</h4>
                        <p>S/ ${item.precio.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="cart-quantity-control">
                        <button class="cart-btn-minus">-</button>
                        <span class="cart-quantity" id="cart-qty-${item.id}">${item.quantity}</span>
                        <button class="cart-btn-plus">+</button>
                    </div>
                    <div class="item-subtotal">S/ ${subtotal.toFixed(2)}</div>
                    <button class="btn-delete-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartHTML += `
            </div>
            <div class="cart-footer">
                <div class="cart-total">Total: S/ ${total.toFixed(2)}</div>
                <div class="cart-actions">
                    <button class="btn-clear">Vaciar carrito</button>
                    <button class="btn-whatsapp">
                        <img class="wa-icon" src="data/ico/Whatsapp.svg" alt="WhatsApp"> Enviar a WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;

    showModal(cartHTML);

    // Event delegation for cart modal
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.addEventListener('click', function(e) {
        const target = e.target;
        const button = target.closest('.btn-close, .modal-backdrop, .cart-btn-minus, .cart-btn-plus, .btn-delete-item, .btn-whatsapp, .btn-clear');
        
        if (!button) return;
        
        if (button.classList.contains('btn-close')) {
          closeCartModal();
        } else if (button.classList.contains('modal-backdrop')) {
          closeModal();
        } else if (button.classList.contains('cart-btn-minus')) {
          const item = button.closest('.cart-item');
          const productId = parseInt(item.getAttribute('data-product-id'), 10);
          updateCartQuantity(productId, -1);
        } else if (button.classList.contains('cart-btn-plus')) {
          const item = button.closest('.cart-item');
          const productId = parseInt(item.getAttribute('data-product-id'), 10);
          updateCartQuantity(productId, 1);
        } else if (button.classList.contains('btn-delete-item')) {
          const item = button.closest('.cart-item');
          const productId = parseInt(item.getAttribute('data-product-id'), 10);
          removeFromCart(productId);
        } else if (button.classList.contains('btn-whatsapp')) {
          sendToWhatsApp();
        } else if (button.classList.contains('btn-clear')) {
          clearCart();
        }
      });
    }
  }

  function sendToWhatsApp() {
    if (cart.length === 0) return;

    const groupedCart = groupCart(cart);

    const businessName =
      window.sharedData?.nombre || window.empresaData?.nombre || "Mi Negocio";
    const baseMessage = window.sharedData?.whatsappMensajeBase || "";
    let message = `*Pedido para ${businessName}*\n`;
    message += baseMessage ? `${baseMessage}\n` : "";
    message += `📋 _Detalles del pedido:_\n`;

    let total = 0;
    Object.values(groupedCart).forEach((item) => {
      const subtotal = item.precio * item.quantity;
      total += subtotal;
      message += `- ${item.quantity}x *${item.nombre}* S/ ${subtotal.toFixed(2)}\n`;
    });

    message += `\n💰 *Total:* S/ ${total.toFixed(2)}\n`;
    message += `¡Gracias por tu pedido! 😊`;

    const whatsappNumber =
      window.sharedData?.whatsapp || window.socialData?.whatsapp || "";
    
    if (!whatsappNumber) {
      if (typeof showNotification === 'function') {
        showNotification('Error: Número de WhatsApp no configurado');
      }
      return;
    }
    
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir con seguridad
    const link = document.createElement('a');
    link.href = whatsappURL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }

  function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartCount();
    closeCartModal();

    // Guardar en localStorage
    saveCart();

    if (typeof showNotification === 'function') {
      showNotification("Carrito vaciado");
    }
  }

  function updateCartQuantity(productId, change) {
    const qtyElement = document.getElementById(`cart-qty-${productId}`);
    if (!qtyElement) return;
    
    let currentQty = parseInt(qtyElement.textContent, 10);
    let newQty = Math.max(1, currentQty + change);
    qtyElement.textContent = newQty;

    // Actualizar carrito
    if (change > 0) {
      const producto = window.productos?.find((p) => p.id === productId);
      if (producto) {
        cart.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          emoji: producto.emoji,
        });
        cartCount++;
      }
    } else if (change < 0 && cart.length > 0) {
      const indexToRemove = cart.findIndex((item) => item.id === productId);
      if (indexToRemove !== -1) {
        cart.splice(indexToRemove, 1);
        cartCount--;
      }
    }

    updateCartCount();
    updateCartModalContent();
    saveCart();
  }

  function removeFromCart(productId) {
    const initialCount = cart.length;
    cart = cart.filter((item) => item.id !== productId);
    const removedCount = initialCount - cart.length;
    cartCount = cart.length;

    updateCartCount();
    updateCartModalContent();
    saveCart();

    if (removedCount > 0 && typeof showNotification === 'function') {
      const product = window.productos?.find((p) => p.id === productId);
      if (product) {
        showNotification(`${removedCount} x ${product.nombre} eliminado(s)`);
      }
    }
  }

  function updateCartModalContent() {
    const cartModal = document.querySelector(".cart-modal");
    if (!cartModal) return;

    const groupedCart = groupCart(cart);

    // Actualizar cantidades y subtotales
    Object.values(groupedCart).forEach((item) => {
      const qtyEl = cartModal.querySelector(`[data-product-id="${item.id}"] .cart-quantity`);
      const subtotalEl = cartModal.querySelector(`[data-product-id="${item.id}"] .item-subtotal`);
      if (qtyEl) qtyEl.textContent = item.quantity;
      if (subtotalEl) subtotalEl.textContent = `S/ ${(item.precio * item.quantity).toFixed(2)}`;
    });

    // Actualizar total
    let total = 0;
    Object.values(groupedCart).forEach((item) => {
      total += item.precio * item.quantity;
    });
    const totalEl = cartModal.querySelector(".cart-total");
    if (totalEl) totalEl.textContent = `Total: S/ ${total.toFixed(2)}`;

    // Remover items con cantidad 0
    const itemsToRemove = cartModal.querySelectorAll(".cart-item");
    itemsToRemove.forEach((itemEl) => {
      const productId = parseInt(itemEl.getAttribute("data-product-id"), 10);
      if (!groupedCart[productId]) {
        itemEl.remove();
      }
    });
  }

  // Exponer funciones públicas
  window.addToCart = addToCart;
  window.updateCartCount = updateCartCount;
  window.showCartDetails = showCartDetails;
  window.sendToWhatsApp = sendToWhatsApp;
  window.clearCart = clearCart;
  window.updateCartQuantity = updateCartQuantity;
  window.removeFromCart = removeFromCart;

  // Inicializar contador cuando carga la página
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Cart.js inicializado');
    console.log('📦 Carrito tiene', cartCount, 'items');
    
    // Esperar a que se cree el floating cart
    setTimeout(() => {
      updateCartCount();
    }, 500);
  });

})();