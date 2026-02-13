// CONFIG.JS - Configuración y carga de datos

/**
 * Carga los datos de configuración desde archivos JSON
 * @returns {Promise<void>}
 */
async function loadConfigData() {
  try {
    const results = await Promise.allSettled([
      fetch("data/app.json", { cache: "no-store" }).then((r) => r.json()),
      fetch("data/tema.json", { cache: "no-store" }).then((r) => r.json()),
    ]);

    const app = results[0].status === 'fulfilled' ? results[0].value : {};
    const tema = results[1].status === 'fulfilled' ? results[1].value : {};

    window.sharedData = {
      nombre: app?.nombre,
      whatsapp: app?.whatsapp,
      whatsappMensajeBase: app?.whatsappMensajeBase,
    };
    window.empresaData = app?.empresa || {};
    window.socialData = app?.social || {};
    window.ubicacionData = app?.ubicacion || {};
    window.temaData = tema || {};

    // Aplicar colores del tema con batch update
    if (window.temaData?.colores) {
      const root = document.documentElement;
      const updates = Object.entries(window.temaData.colores).map(([key, value]) => {
        const cssKey = '--' + key.charAt(0).toLowerCase() + key.slice(1).replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        return [cssKey, value];
      });

      requestAnimationFrame(() => {
        updates.forEach(([key, value]) => root.style.setProperty(key, value));
      });
    }

    window.nosotrosData = app?.nosotros || {};

    if (!window.ubicacionData.marcador && window.sharedData?.nombre) {
      window.ubicacionData.marcador = window.sharedData.nombre;
    }

    if (window.sharedData?.whatsapp) {
      window.socialData.whatsapp = window.sharedData.whatsapp;
    }

    const siteTitleEl = document.getElementById("site-title");
    if (siteTitleEl && window.sharedData?.nombre) {
      siteTitleEl.textContent = window.sharedData.nombre;
    }
    if (window.sharedData?.nombre) {
      document.title = window.sharedData.nombre;
      console.log(`🏪 ${window.sharedData.nombre} - Listo`);
    }
    const siteTaglineEl = document.getElementById("site-tagline");
    if (siteTaglineEl) {
      siteTaglineEl.textContent = window.empresaData?.slogan || siteTaglineEl.textContent;
    }

    console.log("Datos cargados:", { app, tema });

    // Ocultar spinner simple cuando carga
    const loader = document.getElementById("simple-loader");
    if (loader) {
      loader.style.display = "none";
    }
  } catch (error) {
    console.error("Error cargando configuración:", error);
    console.warn("Usando valores por defecto - revisa archivos JSON");
    
    // Notificación visual para el usuario
    setTimeout(() => {
      if (typeof showNotification === 'function') {
        showNotification("Error al cargar configuración. Usando valores por defecto.");
      }
    }, 100);
  }
}
