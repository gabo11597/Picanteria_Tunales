/**
 * NOSOTROS JAVASCRIPT - PICANTERÍA LOS TUNALES
 * Animaciones y funcionalidades de la sección nosotros
 */

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nosotros - DOM cargado');
    initAnimations();
    initValueAnimations();
    initTeamAnimations();
    initScrollEffects();
});

function initAnimations() {
    // Animación de entrada del header
    animateHeader();
    
    // Animación de stats
    animateStats();
    
    // Animación de avatares
    animateAvatars();
}

function animateHeader() {
    const header = document.querySelector('.about-header');
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

function animateStats() {
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

function animateAvatars() {
    const avatars = document.querySelectorAll('.member-avatar');
    
    avatars.forEach((avatar, index) => {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(180deg)';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function initValueAnimations() {
    const valueItems = document.querySelectorAll('.value-item');
    
    valueItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(360deg)';
                icon.style.color = '#ff6b6b';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = '';
            }
        });
    });
}

function initTeamAnimations() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Mostrar información del miembro
            const name = this.querySelector('h4').textContent;
            const role = this.querySelector('p').textContent;
            console.log('Miembro del equipo:', name, '-', role);
        });
    });
}

function initScrollEffects() {
    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const container = document.querySelector('.nosotros-container');
        
        if (container) {
            container.style.transform = \	ranslateY(\px)\;
        }
    });
    
    // Animación de imagen flotante
    const imagePlaceholder = document.querySelector('.about-image-placeholder');
    if (imagePlaceholder) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            imagePlaceholder.style.transform = \	ranslateY(\px)\;
        });
    }
    
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
    const animatedElements = document.querySelectorAll('.about-story, .about-team');
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

// Efectos de hover en stat boxes
document.querySelectorAll('.stat-box').forEach(box => {
    box.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});
