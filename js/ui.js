// UI.JS - Interfaz de usuario y navegación

let currentTab = "tienda";

// Cache de elementos DOM para eficiencia
let tabButtons, notificationEl, floatingCartEl;

// Constantes por defecto para evitar duplicación
const DEFAULTS = {
  phone: "+51 54 123456",
  email: "info@picanterialostunales.com"
};

function initCarousel() {
  tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      if (tabId === currentTab) return;

      // Remover active de todos
      document
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));

      // Agregar active al seleccionado
      this.classList.add("active");
      document.getElementById(tabId).classList.add("active");

      currentTab = tabId;

      // Cargar contenido según tab
      if (tabId === "tienda") {
        loadProducts();
      } else if (tabId === "nosotros") {
        loadNosotros();
      } else if (tabId === "ubicacion") {
        loadUbicacion();
      }
    });
  });

  // Cargar el tab activo inicialmente
  const activeTabBtn = document.querySelector('.tab-btn.active');
  if (activeTabBtn) {
    const tab = activeTabBtn.getAttribute('data-tab');
    if (tab === 'tienda') loadProducts();
    else if (tab === 'nosotros') loadNosotros();
    else if (tab === 'ubicacion') loadUbicacion();
  }
}

function createFloatingCart() {
  const floatingCart = document.createElement("div");
  floatingCart.className = "floating-cart";
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

  floatingCart.addEventListener("mouseenter", () => {
    floatingCart.style.transform = "scale(1.05)";
  });

  floatingCart.addEventListener("mouseleave", () => {
    floatingCart.style.transform = "scale(1)";
  });

  floatingCart.addEventListener("click", () => {
    showCartDetails();
  });

  document.body.appendChild(floatingCart);

  floatingCartEl = floatingCart;
}

function showNotification(message) {
  // Usar notificación fija para evitar crear/remover divs
  if (!notificationEl) {
    notificationEl = document.querySelector(".notification");
    if (!notificationEl) {
      notificationEl = document.createElement("div");
      notificationEl.className = "notification";
      document.body.appendChild(notificationEl);
    }
  }
  notificationEl.textContent = message;
  notificationEl.style.display = "block";
  notificationEl.style.opacity = "1";

  // Ocultar después de 3s con RAF para fluidez
  setTimeout(() => {
    requestAnimationFrame(() => {
      notificationEl.style.opacity = "0";
      setTimeout(() => {
        requestAnimationFrame(() => {
          notificationEl.style.display = "none";
        });
      }, 300); // Esperar transición
    });
  }, 2700);
}

function loadNosotros() {
  try {
    const nosotrosTab = document.getElementById("nosotros");
    if (!nosotrosTab) return;

    const nosotrosTitulo =
      window.nosotrosData?.titulo || window.sharedData?.nombre || "";
    const nosotrosSubtitulo =
      window.nosotrosData?.subtitulo || window.empresaData?.slogan || "";
    const nosotrosHistoria =
      window.nosotrosData?.historia ||
      "Somos una picantería familiar con más de 70 años de tradición. Desde nuestros inicios en 1950, nos hemos dedicado a preservar y compartir la rica tradición culinaria arequipeña.";
    nosotrosTab.innerHTML = `
        <div class="nosotros-container">
            <div class="about-header">
                <h2>${nosotrosTitulo}</h2>
                <p>${nosotrosSubtitulo}</p>
            </div>
            <div class="about-content">
                <div class="about-story">
                    <h3>Nuestra Historia</h3>
                    <p>${nosotrosHistoria}</p>
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
  } catch (error) {
    console.error("Error cargando nosotros:", error);
    showNotification("Error al cargar la sección nosotros");
  }
}

function loadUbicacion() {
  try {
    const ubicacionTab = document.getElementById("ubicacion");
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
                            src="https://www.google.com/maps?q=-16.4090,-71.5375&z=15&output=embed" 
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
                            <p>${window.empresaData?.direccion || "Calle Tunales 123, Arequipa"}<br>
                            ${window.empresaData?.telefono || DEFAULTS.phone}<br>
                            ${window.empresaData?.email || DEFAULTS.email}</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="info-content">
                            <h3>Horario</h3>
                            <p>Lunes a Viernes: ${window.empresaData?.horarios?.lunes_viernes || "11:00-22:00"}<br>
                            Sábado y Domingo: ${window.empresaData?.horarios?.sabado_domingo || "10:00-23:00"}</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="info-content">
                            <h3>Contacto</h3>
                            <p>Teléfono: ${window.empresaData?.telefono || "+51 54 123456"}<br>
                            WhatsApp: ${window.sharedData?.whatsapp || window.socialData?.whatsapp || ""}</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="info-content">
                            <h3>Email</h3>
                            <p>${window.empresaData?.email || "info@picanterialostunales.com"}<br>
                            reservas@picanterialostunales.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  } catch (error) {
    console.error("Error cargando ubicacion:", error);
    showNotification("Error al cargar la sección ubicación");
  }
}

function showModal(content) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            ${content}
        </div>
    `;

  document.body.appendChild(modal);

  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
}

function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    modal.remove();
  }
}

function closeCartModal() {
  closeModal();
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("🏪 Iniciando...");
  await loadConfigData();
  initCarousel();
  if (currentTab === "tienda") {
    loadProducts();
  }
  createFloatingCart();
});
