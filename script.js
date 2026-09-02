(() => {
  const whatsappForm = document.getElementById("whatsappForm");
  if (whatsappForm) {
    whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre")?.value ?? "";
      const telefono = document.getElementById("telefono")?.value ?? "";
      const servicio = document.getElementById("servicio")?.value ?? "";
      const mensaje = document.getElementById("mensaje")?.value ?? "";

      const texto = encodeURIComponent(
        `Hola, mi nombre es ${nombre}\n📞 Teléfono: ${telefono}\n🔐 Servicio: ${servicio}\n📝 Mensaje: ${mensaje}`.trim(),
      );

      window.open(`https://wa.me/573249610909?text=${texto}`, "_blank");
    });
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  const heroEl = document.querySelector(".hero-swiper");
  if (heroEl && window.Swiper) {
    // eslint-disable-next-line no-new
    new window.Swiper(".hero-swiper", {
      loop: true,
      speed: 900,
      effect: "fade",
      autoplay: { delay: 5500, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const counters = Array.from(document.querySelectorAll(".count[data-count-to]"));
  if (counters.length && "IntersectionObserver" in window) {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const animateCounter = (el) => {
      const target = Number(el.getAttribute("data-count-to") || "0");
      const durationMs = 1100;
      const start = performance.now();
      const from = 0;

      const tick = (now) => {
        const p = Math.min(1, (now - start) / durationMs);
        const v = Math.round(from + (target - from) * easeOutCubic(p));
        el.textContent = String(v);
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          if (el.dataset.animated === "1") continue;
          el.dataset.animated = "1";
          animateCounter(el);
        }
      },
      { threshold: 0.35 },
    );

    counters.forEach((c) => obs.observe(c));
  } else {
    counters.forEach((el) => (el.textContent = String(el.getAttribute("data-count-to") || "0")));
  }

  const faqButtons = Array.from(document.querySelectorAll("[data-faq]"));
  if (faqButtons.length) {
    const panels = Array.from(document.querySelectorAll("[data-faq-panel]"));

    const closeAll = () => {
      faqButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
      panels.forEach((p) => {
        p.classList.remove("is-open");
        p.style.maxHeight = "0px";
      });
    };

    faqButtons.forEach((btn, idx) => {
      btn.setAttribute("aria-expanded", "false");
      const panel = panels[idx];
      if (panel) panel.style.maxHeight = "0px";

      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        closeAll();
        if (isOpen) return;

        btn.setAttribute("aria-expanded", "true");
        if (!panel) return;
        panel.classList.add("is-open");
        panel.style.maxHeight = `${panel.scrollHeight + 24}px`;
      });
    });

    window.addEventListener("resize", () => {
      const openIdx = faqButtons.findIndex((b) => b.getAttribute("aria-expanded") === "true");
      if (openIdx < 0) return;
      const panel = panels[openIdx];
      if (!panel) return;
      panel.style.maxHeight = `${panel.scrollHeight + 24}px`;
    });
  }

  const lightboxTargets = Array.from(document.querySelectorAll("img.brand-logo, img.inline-logo"));
  if (lightboxTargets.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Vista previa de imagen");

    lb.innerHTML = `
      <div class="lightbox-panel" role="document">
        <img class="lightbox-img" alt="Imagen ampliada">
        <div class="lightbox-hint">
          <span class="lightbox-pill"><i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i> Vista ampliada</span>
          <span>Click fuera o <strong>Esc</strong> para cerrar</span>
        </div>
      </div>
    `;

    document.body.appendChild(lb);
    const lbImg = lb.querySelector(".lightbox-img");
    const lbPanel = lb.querySelector(".lightbox-panel");

    const open = (src, alt) => {
      if (lbImg) {
        lbImg.src = src;
        lbImg.alt = alt || "Imagen ampliada";
      }
      lb.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
    };

    const close = () => {
      lb.classList.remove("is-open");
      document.documentElement.style.overflow = "";
      if (lbImg) lbImg.removeAttribute("src");
    };

    lightboxTargets.forEach((img) => {
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", () => open(img.currentSrc || img.src, img.alt));
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(img.currentSrc || img.src, img.alt);
        }
      });
    });

    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });

    lbPanel?.addEventListener("click", (e) => e.stopPropagation());

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lb.classList.contains("is-open")) close();
    });
  }
})();
