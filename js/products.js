// PRODUCTS.JS - Gestión de productos y tienda

function changeColumns(cols, init = false) {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;

  productsGrid.className = `products-grid cols-${cols}`;

  if (!init) {
    // Actualizar botones activos
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`.view-btn[data-columns="${cols}"]`).classList.add("active");
  }
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
      const response = await fetch("data/productos.json", { cache: "no-store" });
      console.log("Response:", response);
      productos = await response.json();
      console.log("Productos cargados:", productos.length);
      console.log("Primer producto:", productos[0]);
    } catch (error) {
      console.error("Error cargando productos:", error);
      return;
    }
    window.productos = productos;
  } else {
    console.log("Productos ya cargados desde cache");
  }

  // Evitar re-render si ya está renderizado
  if (tiendaTab.querySelector('.tienda-container')) {
    console.log("Productos ya renderizados, saltando re-render");
    return;
  }

  const productos = window.productos;

  let productosHTML = `
        <div class="tienda-container">
            <div class="shop-header">
                <h2>Nuestra Picantería</h2>
                <p>15 platos tradicionales arequipeños</p>
                <div class="view-controls">
                    <button class="view-btn" data-columns="1">
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

  // Set active button
  const viewButtons = tiendaTab.querySelectorAll('.view-btn');
  viewButtons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = tiendaTab.querySelector(`.view-btn[data-columns="${defaultCols}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Event delegation for tienda
  if (!tiendaTab.dataset.listenersAttached) {
    tiendaTab.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('view-btn')) {
        const cols = target.getAttribute('data-columns');
        changeColumns(parseInt(cols));
      } else if (target.classList.contains('btn-minus')) {
        const productCard = target.closest('.product-card');
        const qtyEl = productCard.querySelector('.quantity');
        const productId = parseInt(qtyEl.id.split('-')[1]);
        changeQuantity(productId, -1);
      } else if (target.classList.contains('btn-plus')) {
        const productCard = target.closest('.product-card');
        const qtyEl = productCard.querySelector('.quantity');
        const productId = parseInt(qtyEl.id.split('-')[1]);
        changeQuantity(productId, 1);
      } else if (target.classList.contains('btn-add-cart')) {
        const productCard = target.closest('.product-card');
        const qtyEl = productCard.querySelector('.quantity');
        const productId = parseInt(qtyEl.id.split('-')[1]);
        addToCart(productId);
      }
    });
    tiendaTab.dataset.listenersAttached = 'true';
  }

  // Lazy loading con Intersection Observer
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  document.querySelectorAll('.lazy').forEach(img => imageObserver.observe(img));

  // Responsive con ResizeObserver
  const resizeObserver = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    const cols = width >= 992 ? 3 : width >= 600 ? 2 : 1;
    changeColumns(cols);
  });

  resizeObserver.observe(document.documentElement);

  // Guardar productos para el carrito
  window.productos = productos;

  // Preload de primeras 5 imágenes para velocidad (no crítico)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      productos.slice(0, 5).forEach(p => {
        if (p.imagen) new Image().src = p.imagen;
      });
    });
  } else {
    setTimeout(() => {
      productos.slice(0, 5).forEach(p => {
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
