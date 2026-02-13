// PRODUCTS.JS - Gestión de productos y tienda

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let currentColumns = null;
let resizeObserverEnabled = true;

function changeColumns(cols, init = false) {
  if (currentColumns === cols && !init) return;

  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  if (!init) {
    resizeObserverEnabled = false; // Desactivar ResizeObserver para clicks manuales
    // Actualizar botones activos
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`.view-btn[data-columns="${cols}"]`).classList.add("active");
  }

  grid.classList.remove("cols-1", "cols-2", "cols-3");
  grid.classList.add(`cols-${cols}`);

  currentColumns = cols;
}

/**
 * Carga y renderiza los productos en la tienda
 * @returns {Promise<void>}
 */
async function loadProducts() {
  const tiendaTab = document.getElementById("tienda");
  if (!tiendaTab) return;

  console.log("Cargando productos...");

  // Cachear productos para evitar fetch repetido
  if (!window.productos) {
    let productos;
    try {
      const response = await fetch("data/productos.json", {
        cache: "no-store",
      });
      productos = await response.json();
      console.log("Productos cargados:", productos.length);
    } catch (error) {
      console.error("Error cargando productos:", error);
      return;
    }
    window.productos = productos;
  } else {
    console.log("Productos ya cargados desde cache");
  }

  const productos = window.productos;

  // Agregar event listeners antes del early return
  if (!tiendaTab.dataset.listenersAttached) {
    tiendaTab.addEventListener("click", (e) => {
      const target = e.target;
      const button = target.closest('.view-btn, .btn-minus, .btn-plus, .btn-add-cart');

      if (button) {
        if (button.classList.contains('view-btn')) {
          const cols = button.getAttribute('data-columns');
          changeColumns(parseInt(cols));
        } else if (button.classList.contains('btn-minus')) {
          const productCard = button.closest('.product-card');
          const qtyEl = productCard.querySelector('.quantity');
          const productId = parseInt(qtyEl.id.split('-')[1]);
          changeQuantity(productId, -1);
        } else if (button.classList.contains('btn-plus')) {
          const productCard = button.closest('.product-card');
          const qtyEl = productCard.querySelector('.quantity');
          const productId = parseInt(qtyEl.id.split('-')[1]);
          changeQuantity(productId, 1);
        } else if (button.classList.contains('btn-add-cart')) {
          const productCard = button.closest('.product-card');
          const qtyEl = productCard.querySelector('.quantity');
          const productId = parseInt(qtyEl.id.split('-')[1]);
          addToCart(productId);
        }
      }
    });

    tiendaTab.dataset.listenersAttached = 'true';
  }

  // Renderizar solo si no está renderizado
  if (!tiendaTab.querySelector(".tienda-container")) {
    console.log("Renderizando productos...");

    let productosHTML = `
        <div class="tienda-container">
            <div class="shop-header">
                <h2>Nuestra Picantería</h2>
                <p>15 platos tradicionales arequipeños</p>
                <div class="view-controls">
                    <button class="view-btn active" data-columns="1">
                        <i class="fas fa-list"></i> 1 Columna
                    </button>
                    <button class="view-btn" data-columns="2">
                        <i class="fas fa-th-large"></i> 2 Columnas
                    </button>
                    <button class="view-btn" data-columns="3">
                        <i class="fas fa-th"></i> 3 Columnas
                    </button>
                </div>
            </div>
            <div class="products-grid" id="products-grid">
    `;

    productos.forEach((producto) => {
      productosHTML += `
            <div class="product-card" role="article" aria-label="${producto.nombre}">
                <div class="product-image ${producto.imagen ? "has-image" : ""}">
                    ${
                      producto.imagen
                        ? `<img data-src="${producto.imagen}" class="lazy" alt="${producto.nombre}" onload="this.parentElement.classList.remove('img-loading'); this.style.opacity='1'" onerror="this.parentElement.classList.remove('img-loading')">`
                        : `<span class="product-emoji">${producto.emoji}</span>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-price">S/ ${producto.precio.toFixed(2)}</p>
                    <p class="product-description">${producto.descripcion}</p>
                    <div class="product-actions">
                        <div class="quantity-control">
                            <button class="btn-minus">-</button>
                            <span class="quantity" id="qty-${producto.id}">1</span>
                            <button class="btn-plus">+</button>
                        </div>
                        <button class="btn-add-cart">
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

    const defaultCols = window.innerWidth >= 992 ? 3 : 1;
    changeColumns(defaultCols, true);
  } else {
    console.log("Productos ya renderizados, saltando re-render");
  }

  // Lazy loading con Intersection Observer
  if (window.productImageObserver) {
    window.productImageObserver.disconnect();
  }

  window.productImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        window.productImageObserver.unobserve(img);
      }
    });
  }, { rootMargin: "50px" });

  document.querySelectorAll(".lazy").forEach((img) => window.productImageObserver.observe(img));

  // Responsive con ResizeObserver debounced
  if (window.productResizeObserver) {
    window.productResizeObserver.disconnect();
  }

  let resizeTimeout;
  window.productResizeObserver = new ResizeObserver(entries => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!resizeObserverEnabled) {
        resizeObserverEnabled = true; // Reset flag
        return;
      }
      const width = entries[0].contentRect.width;
      const cols = width >= 992 ? 3 : width >= 600 ? 2 : 1;
      changeColumns(cols);
    }, 150);
  });

  window.productResizeObserver.observe(tiendaTab);

  // Guardar productos para el carrito
  window.productos = productos;

  // Preload de primeras 5 imágenes para velocidad (no crítico)
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      productos.slice(0, 5).forEach((p) => {
        if (p.imagen) new Image().src = p.imagen;
      });
    });
  } else {
    setTimeout(() => {
      productos.slice(0, 5).forEach((p) => {
        if (p.imagen) new Image().src = p.imagen;
      });
    }, 100);
  }
}

function changeQuantity(productId, change) {
  const qtyElement = document.getElementById(`qty-${productId}`);
  let currentQty = parseInt(qtyElement.textContent);
  let newQty = Math.max(1, currentQty + change);
  qtyElement.textContent = newQty;
}

// Cleanup observers on page unload
window.addEventListener('beforeunload', () => {
  window.productResizeObserver?.disconnect();
  window.productImageObserver?.disconnect();
});
