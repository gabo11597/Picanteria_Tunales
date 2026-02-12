/**
 * TIENDA JAVASCRIPT - ALPHA STORE
 * Animaciones y funcionalidades de la tienda
 */

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initCategoryInteractions();
    initScrollEffects();
});

function initAnimations() {
    // Animación de entrada de categorías
    animateCategories();
    
    // Animación de botones
    animateButtons();
    
    // Animación de stats
    animateStats();
}

function animateCategories() {
    const categories = document.querySelectorAll('.category-card');
    
    categories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(50px) scale(0.9)';
        
        setTimeout(() => {
            category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
    });
}

function animateButtons() {
    const buttons = document.querySelectorAll('.btn-category, .btn-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
        
        // Efecto de brillo
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function animateStats() {
    // Si hay estadísticas, animarlas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                    }
                    
                    target.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : '');
                }, 30);
                
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function initCategoryInteractions() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Aquí puedes agregar lógica para filtrar productos
            const categoryName = this.querySelector('h3').textContent;
            console.log('Categoría seleccionada:', categoryName);
        });
        
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.category-image');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.category-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

function initScrollEffects() {
    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const container = document.querySelector('.tienda-container');
        
        if (container) {
            container.style.transform = `translateY(${scrolled * 0.1}px)`;
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
    const animatedElements = document.querySelectorAll('.shop-header, .shop-cta');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
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
