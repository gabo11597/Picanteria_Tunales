/**
 * CONFIGURACIÓN GLOBAL
 * Lee los JSONs y configura variables globales
 */

let config = {};
let products = [];
let contactInfo = {};

// Cargar configuración desde JSON
async function loadConfig() {
    try {
        // Cargar config
        const configRes = await fetch('../data/config.json');
        config = await configRes.json();
        
        // Aplicar estilos dinámicos SIN sobreescribir gradientes
        const style = document.createElement('style');
        style.textContent = `
            :root {
                /* Mantener gradientes modernos del CSS */
                --user-color-primary: ${config.diseno.colorPrimario};
                --user-color-secondary: ${config.diseno.colorSecundario};
                --user-color-accent: ${config.diseno.colorAcento};
            }
        `;
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('Error cargando config:', error);
    }
}

// Cargar productos desde JSON
async function loadProducts() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        products = data.products || [];
    } catch (error) {
        console.error('Error cargando productos:', error);
        products = [];
    }
}

// Cargar información de contacto
async function loadContactInfo() {
    try {
        const response = await fetch('../data/config.json');
        const data = await response.json();
        contactInfo = data.contacto || {};
    } catch (error) {
        console.error('Error cargando contacto:', error);
    }
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadProducts();
    await loadContactInfo();
    
    // Aplicar grid
    const gridClass = `products-grid-${config.layout.columnas || 3}`;
    const container = document.getElementById('productsContainer');
    if (container) {
        container.classList.add('products-grid-' + config.layout.columnas, 'products-container');
    }
});
