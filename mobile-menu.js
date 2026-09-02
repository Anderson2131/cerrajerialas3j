// Menú Móvil Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('mobile-menu-open');
            body.classList.toggle('mobile-menu-open');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('mobile-menu-open');
                body.classList.remove('mobile-menu-open');
            }
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = nav.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('mobile-menu-open');
                body.classList.remove('mobile-menu-open');
            });
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('mobile-menu-open');
                body.classList.remove('mobile-menu-open');
            }
        });
    }
});
