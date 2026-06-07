// Slider Premium para Testimonios de Clientes
class ClientsTestimonialSlider {
  constructor() {
    this.slider = document.querySelector('.testimonials-slider-saas');
    this.cards = document.querySelectorAll('.testimonial-saas-card');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    this.isTransitioning = false;
    
    this.init();
  }

  init() {
    if (!this.slider || this.cards.length === 0) return;

    // Event listeners
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Touch events para móvil
    this.addTouchEvents();
    
    // Auto-play
    this.startAutoPlay();
    
    // Pausar auto-play en hover
    this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

    // Animación inicial
    this.animateInitialCards();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    
    this.currentSlide = this.currentSlide === 0 ? this.cards.length - 1 : this.currentSlide - 1;
    this.updateSlider();
  }

  nextSlide() {
    if (this.isTransitioning) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.cards.length;
    this.updateSlider();
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;
    
    this.currentSlide = index;
    this.updateSlider();
  }

  updateSlider() {
    this.isTransitioning = true;
    
    // Actualizar cards
    this.cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next');
      
      if (index === this.currentSlide) {
        card.classList.add('active');
      } else if (index === (this.currentSlide - 1 + this.cards.length) % this.cards.length) {
        card.classList.add('prev');
      } else if (index === (this.currentSlide + 1) % this.cards.length) {
        card.classList.add('next');
      }
    });

    // Actualizar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });

    // Resetear estado de transición
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  addTouchEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoPlay();
    }, { passive: true });

    this.slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    this.slider.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const diff = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      isDragging = false;
      this.startAutoPlay();
    }, { passive: true });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  animateInitialCards() {
    this.cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(100px) scale(0.8)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0) scale(1)';
        
        if (index === 0) {
          card.classList.add('active');
        }
      }, index * 200);
    });
  }
}

// Animación Count-up para estadísticas - DESACTIVADA para evitar NaN y mejorar rendimiento
class CountUpAnimation {
  constructor() {
    // Desactivado - números estáticos para evitar lag
    return;
  }

  init() {
    return;
  }

  animateNumber(element) {
    return;
  }
}

// Efectos hover premium para cards de clientes - OPTIMIZADO: Simplificados para mejorar rendimiento
class ClientCardsEffects {
  constructor() {
    this.featuredCard = document.querySelector('.featured-client-saas');
    this.statCards = document.querySelectorAll('.stat-saas-card');
    this.testimonialCards = document.querySelectorAll('.testimonial-saas-card');
    this.init();
  }

  init() {
    this.addFeaturedCardEffects();
    this.addStatCardsEffects();
    this.addTestimonialCardsEffects();
  }

  addFeaturedCardEffects() {
    if (!this.featuredCard) return;

    this.featuredCard.addEventListener('mouseenter', () => {
      this.featuredCard.style.transform = 'translateY(-5px)';
      this.featuredCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    });

    this.featuredCard.addEventListener('mouseleave', () => {
      this.featuredCard.style.transform = '';
      this.featuredCard.style.boxShadow = '';
    });
  }

  addStatCardsEffects() {
    this.statCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.zIndex = '10';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.zIndex = '';
      });
    });
  }

  addTestimonialCardsEffects() {
    this.testimonialCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

// Inicializar todos los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ClientsTestimonialSlider();
  new CountUpAnimation();
  new ClientCardsEffects();
});

// Exportar para uso global
window.ClientsTestimonialSlider = ClientsTestimonialSlider;
window.CountUpAnimation = CountUpAnimation;
window.ClientCardsEffects = ClientCardsEffects;
