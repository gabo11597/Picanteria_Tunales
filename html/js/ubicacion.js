/**
 * UBICACIÓN JAVASCRIPT - PICANTERÍA LOS TUNALES
 * Animaciones y funcionalidades de la sección ubicación
 */

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ubicacion - DOM cargado');
    initAnimations();
    initMapInteractions();
    initInfoCardAnimations();
    initScrollEffects();
});

function initAnimations() {
    // Animación de entrada del header
    animateHeader();
    
    // Animación del mapa
    animateMap();
    
    // Animación de info cards
    animateInfoCards();
}

function animateHeader() {
    const header = document.querySelector('.location-header');
    const title = header.querySelector('h1');
    
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 200);
    }
}

function animateMap() {
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        mapContainer.style.opacity = '0';
        mapContainer.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            mapContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            mapContainer.style.opacity = '1';
            mapContainer.style.transform = 'scale(1)';
        }, 400);
    }
}

function animateInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(180deg)';
                icon.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #ffd93d 100%)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.background = '';
            }
        });
    });
}

function initMapInteractions() {
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        // Efecto de hover en el mapa
        mapContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)';
        });
        
        mapContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
        
        // Click para fullscreen (opcional)
        mapContainer.addEventListener('click', function() {
            const iframe = this.querySelector('iframe');
            if (iframe) {
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                }
            }
        });
    }
}

function initInfoCardAnimations() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Mostrar información detallada
            const title = this.querySelector('h3').textContent;
            const info = this.querySelector('.info-content p').textContent;
            console.log('Información de contacto:', title, '-', info);
        });
        
        // Animación de entrada de texto
        card.addEventListener('mouseenter', function() {
            const content = this.querySelector('.info-content');
            if (content) {
                content.style.transform = 'translateX(5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const content = this.querySelector('.info-content');
            if (content) {
                content.style.transform = 'translateX(0)';
            }
        });
    });
}

function initScrollEffects() {
    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const container = document.querySelector('.ubicacion-container');
        
        if (container) {
            container.style.transform = \	ranslateY(\px)\;
        }
        
        // Efecto parallax en el mapa
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.style.transform = \	ranslateY(\px)\;
        }
    });
    
    // Animación de elementos al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar elementos para animar
    const animatedElements = document.querySelectorAll('.location-info');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Modal para imagen de fachada
function showFrontImageModal() {
    const modal = document.createElement('div');
    modal.className = 'front-image-modal';
    modal.innerHTML = \
        <div class='front-modal-overlay' onclick='closeFrontImageModal()'></div>
        <div class='front-modal-content'>
            <div class='front-modal-image'>
                <span class='front-modal-emoji'>??</span>
                <div class='front-image-placeholder-modal'>
                    <i class='fas fa-image'></i>
                    <span>Fachada de Picantería Los Tunales</span>
                </div>
            </div>
            <div class='front-modal-info'>
                <h3>Nuestra Picantería</h3>
                <p class='front-modal-description'>
                    Ubicada en el corazón del centro histórico de Arequipa, nuestra picantería es un lugar 
                    donde la tradición se encuentra con el sabor. Nuestra fachada de sillar blanco 
                    representa la arquitectura colonial arequipeña, mientras que nuestro interior 
                    ofrece un ambiente cálido y familiar donde podrás disfrutar de los platos 
                    más auténticos de nuestra gastronomía.
                </p>
                <p class='front-modal-description'>
                    Contamos con un comedor principal con capacidad para 40 personas, nuestro patio 
                    interior con tunales tradicionales donde cocinamos nuestros platos, y un área 
                    especial para eventos familiares donde celebramos nuestras tradiciones culinarias 
                    con música y danzas típicas.
                </p>
                <button class='btn-front-modal-close' onclick='closeFrontImageModal()'>
                    <i class='fas fa-times'></i>
                    CERRAR
                </button>
            </div>
        </div>
    \;
    
    document.body.appendChild(modal);
    
    // Animación de entrada
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeFrontImageModal() {
    const modal = document.querySelector('.front-image-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Comunicación con el contenedor padre
function sendMessageToParent(type, data) {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: type,
            data: data
        }, '*');
    }
}

// Enviar altura al contenedor
function updateHeight() {
    const height = document.body.scrollHeight;
    sendMessageToParent('resize', { height: height });
}

// Actualizar altura cuando cambie el contenido
window.addEventListener('resize', updateHeight);
window.addEventListener('load', updateHeight);

// Notificar cuando esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateHeight, 100);
});

// Función para obtener coordenadas (si se necesita)
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Ubicación actual:', position.coords.latitude, position.coords.longitude);
                // Aquí puedes actualizar el mapa con la ubicación actual
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
            }
        );
    }
}

// Inicializar geolocalización (opcional)
// getCurrentLocation();

// Efecto de pulsación en info cards
setInterval(() => {
    const randomCard = document.querySelectorAll('.info-card')[Math.floor(Math.random() * 6)];
    if (randomCard) {
        randomCard.style.borderColor = 'rgba(255, 107, 107, 0.5)';
        setTimeout(() => {
            randomCard.style.borderColor = '';
        }, 1000);
    }
}, 5000);
