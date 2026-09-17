// Funcionalidad Accordion Premium para Cards de Cobertura
class CoverageAccordion {
  constructor() {
    this.accordionItems = document.querySelectorAll('.accordion-item');
    this.init();
  }

  init() {
    if (this.accordionItems.length === 0) return;

    // Agregar evento click a cada card
    this.accordionItems.forEach(item => {
      const header = item.querySelector('.tech-feature-header');
      
      // Click en toda la card
      header.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleAccordion(item);
      });

      // Click específico en la flecha
      const arrow = item.querySelector('.accordion-arrow');
      if (arrow) {
        arrow.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleAccordion(item);
        });
      }
    });

    // Agregar efectos hover mejorados
    this.addHoverEffects();
    
    // Animación inicial
    this.addInitialAnimation();
  }

  toggleAccordion(currentItem) {
    const isActive = currentItem.classList.contains('active');
    const accordionContent = currentItem.querySelector('.accordion-content');
    
    // Cerrar todas las demás cards
    this.accordionItems.forEach(item => {
      if (item !== currentItem) {
        item.classList.remove('active');
        const content = item.querySelector('.accordion-content');
        if (content) {
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
        }
      }
    });

    // Toggle de la card actual
    if (isActive) {
      // Cerrar
      currentItem.classList.remove('active');
      accordionContent.style.maxHeight = '0px';
      accordionContent.style.opacity = '0';
    } else {
      // Abrir
      currentItem.classList.add('active');
      
      // Calcular altura dinámicamente
      const inner = accordionContent.querySelector('.accordion-inner');
      const scrollHeight = inner.scrollHeight;
      
      accordionContent.style.maxHeight = scrollHeight + 'px';
      accordionContent.style.opacity = '1';
      
      // Smooth scroll a la card si es necesario
      this.scrollToCard(currentItem);
    }

    // Efectos visuales adicionales
    this.addVisualEffects(currentItem, !isActive);
  }

  addHoverEffects() {
    this.accordionItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
          this.addHoverGlow(item);
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          this.removeHoverGlow(item);
        }
      });
    });
  }

  addHoverGlow(item) {
    item.style.transform = 'translateY(-3px) scale(1.02)';
    item.style.boxShadow = `
      0 15px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(255, 140, 0, 0.2),
      0 0 50px rgba(255, 140, 0, 0.1)
    `;
  }

  removeHoverGlow(item) {
    if (!item.classList.contains('active')) {
      item.style.transform = '';
      item.style.boxShadow = '';
    }
  }

  addVisualEffects(item, isOpening) {
    if (isOpening) {
      // Efecto de apertura
      this.createPulseEffect(item);
      
      // Animación del icono
      const icon = item.querySelector('.tech-feature-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
          icon.style.transform = '';
        }, 300);
      }

      // Efecto en el contenido
      const content = item.querySelector('.accordion-content');
      if (content) {
        this.animateContentEntry(content);
      }
    }
  }

  createPulseEffect(item) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border: 2px solid rgba(255, 140, 0, 0.3);
      border-radius: 16px;
      pointer-events: none;
      animation: accordion-pulse 0.6s ease-out;
      z-index: 1;
    `;
    
    item.appendChild(pulse);
    
    setTimeout(() => {
      pulse.remove();
    }, 600);
  }

  animateContentEntry(content) {
    const inner = content.querySelector('.accordion-inner');
    const items = inner.querySelectorAll('.stat-mini, .detail-item, .feature-badge');
    
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 + (index * 50));
    });
  }

  scrollToCard(item) {
    const rect = item.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - 100;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  addInitialAnimation() {
    // Animación de entrada para las cards
    this.accordionItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 200 + (index * 100));
    });
  }

  // Método para actualizar dinámicamente el contenido
  updateAccordionContent(accordionId, newContent) {
    const item = document.querySelector(`[data-accordion="${accordionId}"]`);
    if (item) {
      const content = item.querySelector('.accordion-inner');
      if (content) {
        content.innerHTML = newContent;
        
        // Recalcular altura si está activo
        if (item.classList.contains('active')) {
          const accordionContent = item.querySelector('.accordion-content');
          const scrollHeight = content.scrollHeight;
          accordionContent.style.maxHeight = scrollHeight + 'px';
        }
      }
    }
  }

  // Método para abrir una card específica
  openAccordion(accordionId) {
    const item = document.querySelector(`[data-accordion="${accordionId}"]`);
    if (item && !item.classList.contains('active')) {
      this.toggleAccordion(item);
    }
  }

  // Método para cerrar todas las cards
  closeAllAccordions() {
    this.accordionItems.forEach(item => {
      item.classList.remove('active');
      const content = item.querySelector('.accordion-content');
      if (content) {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      }
    });
  }
}

// Agregar estilos CSS dinámicos para animaciones
const accordionStyles = `
  @keyframes accordion-pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0;
    }
  }
  
  .accordion-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .accordion-item .tech-feature-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .accordion-item .accordion-arrow {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = accordionStyles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new CoverageAccordion();
});

// Exportar para uso global
window.CoverageAccordion = CoverageAccordion;
