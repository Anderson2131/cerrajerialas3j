// Enhanced Navbar Scroll Effects - Premium Glassmorphism
class NavbarScrollEnhancement {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 50;
    this.init();
  }

  init() {
    if (!this.navbar) return;

    // Event listeners
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    window.addEventListener('resize', () => this.handleResize());
    
    // Initial state
    this.updateNavbarState();
    
    // Add smooth transitions
    this.addSmoothTransitions();
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
    const scrollDelta = Math.abs(currentScrollY - this.lastScrollY);

    // Update navbar state based on scroll
    if (currentScrollY > this.scrollThreshold) {
      this.navbar.classList.add('scrolled');
      this.addScrollEffects(scrollDirection, scrollDelta);
    } else {
      this.navbar.classList.remove('scrolled');
      this.removeScrollEffects();
    }

    // Hide/show on scroll direction
    this.handleScrollDirection(scrollDirection, currentScrollY);

    this.lastScrollY = currentScrollY;
  }

  handleScrollDirection(direction, currentScrollY) {
    // No ocultar navbar en móvil para permitir menú hamburguesa
    if (window.innerWidth > 768) {
      if (direction === 'down' && currentScrollY > 100) {
        // Hide navbar when scrolling down
        this.navbar.style.transform = 'translateY(-100%)';
      } else if (direction === 'up' || currentScrollY <= 100) {
        // Show navbar when scrolling up or at top
        this.navbar.style.transform = 'translateY(0)';
      }
    }
  }

  addScrollEffects(direction, delta) {
    // Dynamic blur based on scroll speed
    const blurIntensity = Math.min(delta / 10, 30);
    this.navbar.style.backdropFilter = `blur(${25 + blurIntensity}px) saturate(${180 + blurIntensity * 2}%)`;

    // Dynamic shadow based on scroll position
    const shadowIntensity = Math.min(currentScrollY / 100, 1);
    this.updateShadow(shadowIntensity);

    // Add subtle glow effect on fast scroll
    if (delta > 15) {
      this.addFastScrollGlow();
    }
  }

  removeScrollEffects() {
    this.navbar.style.backdropFilter = 'blur(25px) saturate(180%)';
    this.updateShadow(0);
    this.removeFastScrollGlow();
  }

  updateShadow(intensity) {
    const baseShadow = `0 4px 20px rgba(0, 0, 0, ${0.1 + intensity * 0.1})`;
    const glowShadow = intensity > 0.5 
      ? `0 0 ${40 + intensity * 20}px rgba(217, 119, 6, ${0.03 + intensity * 0.05})`
      : `0 0 40px rgba(217, 119, 6, 0.03)`;
    const insetShadow = `inset 0 1px 0 rgba(255, 255, 255, ${0.1 + intensity * 0.05})`;
    
    this.navbar.style.boxShadow = `${baseShadow}, ${glowShadow}, ${insetShadow}`;
  }

  addFastScrollGlow() {
    this.navbar.style.borderBottom = '1px solid rgba(217, 119, 6, 0.3)';
    this.navbar.style.background = 'rgba(0, 0, 0, 0.85)';
  }

  removeFastScrollGlow() {
    this.navbar.style.borderBottom = '1px solid rgba(217, 119, 6, 0.15)';
    this.navbar.style.background = 'rgba(0, 0, 0, 0.7)';
  }

  handleResize() {
    // Reset navbar state on resize
    this.updateNavbarState();
  }

  updateNavbarState() {
    const isScrolled = window.scrollY > this.scrollThreshold;
    
    if (isScrolled) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  addSmoothTransitions() {
    // Add smooth transitions for all navbar properties
    this.navbar.style.transition = `
      all 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      backdrop-filter 0.3s ease-out,
      box-shadow 0.3s ease-out,
      border-color 0.3s ease-out,
      background 0.3s ease-out
    `;
  }

  // Public methods for external control
  showNavbar() {
    this.navbar.style.transform = 'translateY(0)';
    this.navbar.classList.add('scrolled');
  }

  hideNavbar() {
    this.navbar.style.transform = 'translateY(-100%)';
  }

  resetNavbar() {
    this.navbar.classList.remove('scrolled');
    this.navbar.style.transform = 'translateY(0)';
    this.removeScrollEffects();
  }
}

// Enhanced hover effects for navbar elements
class NavbarHoverEffects {
  constructor() {
    this.init();
  }

  init() {
    this.addLogoEffects();
    this.addButtonEffects();
    this.addNavLinkEffects();
  }

  addLogoEffects() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;

    logo.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.05)';
      logo.style.filter = 'brightness(1.1)';
    });

    logo.addEventListener('mouseleave', () => {
      logo.style.transform = 'scale(1)';
      logo.style.filter = 'brightness(1)';
    });
  }

  addButtonEffects() {
    const buttons = document.querySelectorAll('.nav-whatsapp, .nav-phone');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.02)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  addNavLinkEffects() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(3px)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
      });
    });
  }
}

// Background detection for navbar adaptation
class NavbarBackgroundDetection {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.init();
  }

  init() {
    if (!this.navbar) return;
    
    // Check background sections periodically
    this.checkBackgroundSections();
    window.addEventListener('scroll', () => this.throttle(() => this.checkBackgroundSections(), 100));
  }

  checkBackgroundSections() {
    const navbarRect = this.navbar.getBoundingClientRect();
    const elementsBelow = document.elementsFromPoint(
      navbarRect.left + navbarRect.width / 2,
      navbarRect.bottom + 1
    );

    let hasLightBackground = false;
    
    elementsBelow.forEach(element => {
      if (element === this.navbar) return;
      
      const computedStyle = window.getComputedStyle(element);
      const bgColor = computedStyle.backgroundColor;
      
      // Check if background is light
      if (this.isLightColor(bgColor)) {
        hasLightBackground = true;
      }
    });

    // Adjust navbar based on background
    if (hasLightBackground) {
      this.navbar.classList.add('on-light-background');
    } else {
      this.navbar.classList.remove('on-light-background');
    }
  }

  isLightColor(color) {
    // Convert RGB to luminance
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return false;
    
    const [r, g, b] = rgb.map(Number);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5;
  }

  throttle(func, limit) {
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
  }
}

// Initialize all navbar enhancements
document.addEventListener('DOMContentLoaded', () => {
  new NavbarScrollEnhancement();
  new NavbarHoverEffects();
  new NavbarBackgroundDetection();
});

// Export for global access
window.NavbarScrollEnhancement = NavbarScrollEnhancement;
