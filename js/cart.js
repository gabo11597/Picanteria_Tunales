(function() {
  // Variables privadas
  let cart = [];
  let cartCount = 0;

  // Cargar carrito desde localStorage con manejo de errores
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      cart = JSON.parse(stored);
      cartCount = cart.length;
    }
  } catch (e) {
    console.error('Error cargando carrito desde localStorage, reseteando:', e);
    localStorage.removeItem('cart');
  }

  // Función para guardar carrito con debounce
  let saveTimer;
  const saveCart = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Error guardando carrito en localStorage:', e);
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
    const producto = window.productos.find((p) => p.id === productId);
    const quantity = parseInt(
      document.getElementById(`qty-${productId}`).textContent,
    );

    for (let i = 0; i < quantity; i++) {
      cart.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        emoji: producto.emoji,
      });
    }

    cartCount += quantity;
    updateCartCount();

    // Guardar en localStorage
    saveCart();

    // Resetear cantidad
    document.getElementById(`qty-${productId}`).textContent = "1";

    showNotification(`${quantity} x ${producto.nombre} agregado(s) al carrito`);
  }

  function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
      cartCountElement.style.display = cartCount > 0 ? "flex" : "none";
    }
  }

  function showCartDetails() {
    if (cart.length === 0) {
      showNotification("El carrito está vacío");
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
                      const producto = window.productos.find(p => p.id === item.id);
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
                <button class="btn-clear-cart">Vaciar carrito</button>
                <button class="btn-send-to-whatsapp">
                    <img class="wa-icon" src="data/ico/Whatsapp.svg" alt="WhatsApp"> Enviar a WhatsApp
                </button>
            </div>
        </div>
    `;

    showModal(cartHTML);

    // Event delegation for cart modal
    const modal = document.querySelector('.modal-overlay');
    modal.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('btn-close')) {
        closeCartModal();
      } else if (target.classList.contains('modal-backdrop')) {
        closeModal();
      } else if (target.classList.contains('cart-btn-minus')) {
        const item = target.closest('.cart-item');
        const productId = parseInt(item.getAttribute('data-product-id'));
        updateCartQuantity(productId, -1);
      } else if (target.classList.contains('cart-btn-plus')) {
        const item = target.closest('.cart-item');
        const productId = parseInt(item.getAttribute('data-product-id'));
        updateCartQuantity(productId, 1);
      } else if (target.classList.contains('btn-delete-item')) {
        const item = target.closest('.cart-item');
        const productId = parseInt(item.getAttribute('data-product-id'));
        removeFromCart(productId);
      } else if (target.classList.contains('btn-send-to-whatsapp')) {
        sendToWhatsApp();
      } else if (target.classList.contains('btn-clear-cart')) {
        clearCart();
      }
    });
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
    if (!whatsappNumber) return;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  }

  function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartCount();
    closeCartModal();

    // Guardar en localStorage
    saveCart();

    showNotification("Carrito vaciado");
  }

  function updateCartQuantity(productId, change) {
    const qtyElement = document.getElementById(`cart-qty-${productId}`);
    let currentQty = parseInt(qtyElement.textContent);
    let newQty = Math.max(1, currentQty + change);
    qtyElement.textContent = newQty;

    // Actualizar carrito
    const productIndex = cart.findIndex((item) => item.id === productId);
    if (change > 0) {
      const producto = window.productos.find((p) => p.id === productId);
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
      // Remove one item
      const indexToRemove = cart.findIndex((item) => item.id === productId);
      if (indexToRemove !== -1) {
        cart.splice(indexToRemove, 1);
        cartCount--;
      }
    }

    updateCartCount();

    // Update cart modal if open (sin cerrar/reabrir)
    updateCartModalContent();

    // Guardar en localStorage
    saveCart();

    if (change > 0) {
      const product = window.productos.find((p) => p.id === productId);
      showNotification("+" + product.nombre + " agregado");
    } else {
      const product = window.productos.find((p) => p.id === productId);
      showNotification("- " + product.nombre + " eliminado");
    }
  }

  function removeFromCart(productId) {
    // Remove all items with this product ID
    const initialCount = cart.length;
    cart = cart.filter((item) => item.id !== productId);
    const removedCount = initialCount - cart.length;
    cartCount = cart.length;

    updateCartCount();

    // Update cart modal if open (sin cerrar/reabrir)
    updateCartModalContent();

    // Guardar en localStorage
    saveCart();

    const product = window.productos.find((p) => p.id === productId);
    showNotification(removedCount + " x " + product.nombre + " eliminado(s)");
  }

  function updateCartModalContent() {
    const cartModal = document.querySelector(".cart-modal");
    if (!cartModal) return;

    // Agrupar productos actualizados
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
      const productId = parseInt(itemEl.getAttribute("data-product-id"));
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

})();
