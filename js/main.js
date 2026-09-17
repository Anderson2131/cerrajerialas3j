// JavaScript Premium - Versión Completa Antes de Optimización Móvil

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });

    // Inicializar Swiper Hero Slider
    initHeroSlider();
    
    // Inicializar contador animado
    initCounters();
    
    // Inicializar FAQ
    initFAQ();
    
    // Inicializar formulario WhatsApp
    initWhatsAppForm();
    
    // Inicializar smooth scrolling
    initSmoothScroll();
    
    // Inicializar efectos parallax
    initParallax();
    
    // Inicializar year actual
    updateYear();
    
    // Inicializar efectos de scroll
    initScrollEffects();
    
    // Inicializar menú móvil
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú móvil al hacer click en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});

// Hero Slider con Swiper
function initHeroSlider() {
    const heroSwiper = new Swiper('.hero-swiper', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChange: function() {
                // Reiniciar animaciones AOS en cada slide
                AOS.refresh();
            }
        }
    });
}

// Contador animado para estadísticas
function initCounters() {
    const counters = document.querySelectorAll('.count');
    const speed = 200;
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-count-to');
                const increment = target / speed;
                
                const updateCount = () => {
                    const current = +counter.innerText;
                    
                    if (current < target) {
                        counter.innerText = Math.ceil(current + increment);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                countObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        countObserver.observe(counter);
    });
}

// Sistema de FAQ con acordeón
function initFAQ() {
    const faqItems = document.querySelectorAll('[data-faq]');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            const panel = this.nextElementSibling;
            const icon = this.querySelector('.faq-ico i');
            
            // Cerrar todos los demás items
            faqItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.classList.remove('active');
                    otherItem.nextElementSibling.classList.remove('show');
                    otherItem.querySelector('.faq-ico i').classList.remove('fa-minus');
                    otherItem.querySelector('.faq-ico i').classList.add('fa-plus');
                }
            });
            
            // Toggle current item
            this.classList.toggle('active');
            panel.classList.toggle('show');
            
            if (isActive) {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
}

// Formulario WhatsApp con validación avanzada
function initWhatsAppForm() {
    const form = document.getElementById('whatsappForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            // Validación
            if (!validateForm(nombre, telefono, servicio)) {
                return;
            }
            
            // Construir mensaje WhatsApp
            const whatsappMessage = buildWhatsAppMessage(nombre, telefono, servicio, mensaje);
            
            // Abrir WhatsApp
            const whatsappUrl = `https://wa.me/573249610909?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Opcional: Mostrar confirmación
            showFormConfirmation();
        });
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Validación de formulario
function validateForm(nombre, telefono, servicio) {
    let isValid = true;
    
    // Validar nombre
    if (nombre.length < 3) {
        showFieldError('nombre', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    // Validar teléfono
    const phoneRegex = /^[0-9+\s-]{10,}$/;
    if (!phoneRegex.test(telefono)) {
        showFieldError('telefono', 'Ingresa un número de teléfono válido');
        isValid = false;
    }
    
    // Validar servicio
    if (servicio === 'Selecciona un servicio') {
        showFieldError('servicio', 'Selecciona un servicio');
        isValid = false;
    }
    
    return isValid;
}

// Validación de campo individual
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch(field.id) {
        case 'nombre':
            isValid = value.length >= 3;
            break;
        case 'telefono':
            const phoneRegex = /^[0-9+\s-]{10,}$/;
            isValid = phoneRegex.test(value);
            break;
        case 'servicio':
            isValid = value !== 'Selecciona un servicio';
            break;
    }
    
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field.id, 'Campo inválido');
    }
    
    return isValid;
}

// Mostrar error en campo
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    
    // Eliminar error anterior si existe
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Crear mensaje de error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Limpiar error de campo
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Construir mensaje WhatsApp
function buildWhatsAppMessage(nombre, telefono, servicio, mensaje) {
    let whatsappMessage = `🔐 *Cerrajería Las 3 J - Solicitud de Servicio*\n\n`;
    whatsappMessage += `👤 *Nombre:* ${nombre}\n`;
    whatsappMessage += `📱 *Teléfono:* ${telefono}\n`;
    whatsappMessage += `🔧 *Servicio:* ${servicio}\n`;
    
    if (mensaje) {
        whatsappMessage += `📝 *Mensaje:* ${mensaje}\n`;
    }
    
    whatsappMessage += `\n🚀 *Atención inmediata 24/7*`;
    
    return whatsappMessage;
}

// Mostrar confirmación de formulario
function showFormConfirmation() {
    const form = document.getElementById('whatsappForm');
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        animation: slideDown 0.5s ease;
    `;
    confirmation.innerHTML = `
        <h3 style="margin-bottom: 10px;">✅ ¡Mensaje enviado!</h3>
        <p>Te contactaremos lo antes posible.</p>
    `;
    
    form.parentNode.insertBefore(confirmation, form);
    
    // Resetear formulario
    form.reset();
    
    // Remover confirmación después de 5 segundos
    setTimeout(() => {
        confirmation.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => {
            confirmation.remove();
        }, 500);
    }, 5000);
}

// Smooth scrolling avanzado
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
}

// Efectos parallax
function initParallax() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = heroSection.querySelectorAll('[data-aos]');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Actualizar año actual
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Efectos de scroll avanzados
function initScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effects
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scroll hacia abajo
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scroll hacia arriba
                header.style.transform = 'translateY(0)';
            }
            
            // Background opacity
            if (scrollTop > 50) {
                header.style.background = 'linear-gradient(135deg, rgba(11,18,40,0.98) 0%, rgba(15,27,61,0.95) 50%, rgba(30,64,175,0.92) 100%)';
            } else {
                header.style.background = 'linear-gradient(135deg, rgba(11,18,40,0.95) 0%, rgba(15,27,61,0.92) 50%, rgba(30,64,175,0.88) 100%)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Animación de elementos al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.slide-up, .slide-in-left, .slide-in-right');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = elementTop + element.offsetHeight;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar al cargar
}

// Toggle menú móvil
function toggleMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    console.log('toggleMobileMenu called', { mobileMenuToggle, navMenu });
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open');
        console.log('Classes toggled', {
            toggleActive: mobileMenuToggle.classList.contains('active'),
            menuActive: navMenu.classList.contains('active')
        });
    } else {
        console.error('Elementos no encontrados', { mobileMenuToggle, navMenu });
    }
}

// Cerrar menú móvil (si existe)
function closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
    }
}

// Preload de imágenes
function preloadImages() {
    const images = [
        'img/baner1.jpg',
        'img/baner2.jpg',
        'img/baner3.jpg',
        'img/logo.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lazy loading de imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Optimización de rendimiento
function optimizePerformance() {
    // Preload imágenes críticas
    preloadImages();
    
    // Lazy loading para imágenes no críticas
    initLazyLoading();
    
    // Reducir animaciones en dispositivos de bajo rendimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('[data-aos]').forEach(element => {
            element.setAttribute('data-aos-duration', '0');
        });
    }
}

// Manejo de errores
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Error global:', e.error);
        // Enviar a servicio de monitoreo si es necesario
    });
    
    // Capturar errores de promesas no manejadas
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada:', e.reason);
        e.preventDefault();
    });
}

// Utilidades
const utils = {
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Formatear número
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Validar email
    isValidEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Inicializar optimizaciones de rendimiento
optimizePerformance();

// Inicializar manejo de errores
initErrorHandling();

// Exportar utilidades para uso global
window.utils = utils;

// Animaciones CSS adicionales
const additionalCSS = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    input.error, select.error, textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;

// Inyectar CSS adicional si no existe
if (!document.querySelector('#additional-styles')) {
    const style = document.createElement('style');
    style.id = 'additional-styles';
    style.textContent = additionalCSS;
    document.head.appendChild(style);
}

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

console.log('🚀 Cerrajería Las 3 J - JavaScript Premium cargado exitosamente');
