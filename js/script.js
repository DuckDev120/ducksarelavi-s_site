(() => {
  'use strict';

  document.documentElement.classList.add('page-enter-active');
  setTimeout(() => {
    document.documentElement.classList.remove('page-enter', 'page-enter-active');
  }, 600);

  const typeEl = document.getElementById('type-target');
  if (typeEl) {
    let phrases = [];
    try {
      const attr = typeEl.getAttribute('data-phrases') || '[]';
      phrases = Array.isArray(attr) ? attr : JSON.parse(attr);
    } catch (e) {
      phrases = ["Hi, I'm Lavi", 'I build websites', 'I playing Minecraft', 'I design cool stuff', "I'm a duck"];
    }

    let i = 0, j = 0, deleting = false;
    const speed = { type: 55, back: 34, hold: 1200, gap: 250 };

    const tick = () => {
      const phrase = phrases[i % phrases.length] || '';
      if (!deleting) {
        j++;
        typeEl.textContent = phrase.slice(0, j);
        if (j >= phrase.length) {
          deleting = true;
          setTimeout(tick, speed.hold);
          return;
        }
        setTimeout(tick, speed.type);
      } else {
        j--;
        typeEl.textContent = phrase.slice(0, j);
        if (j <= 0) {
          deleting = false;
          i++;
          setTimeout(tick, speed.gap);
          return;
        }
        setTimeout(tick, speed.back);
      }
    };
    tick();
  }

  const duckNodes = document.querySelectorAll('.hero-ducks .duck');
  if (duckNodes.length) {
    duckNodes.forEach((node, idx) => {
      const body = node.querySelector('.duck-body');
      if (!body) return;

      const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const blink = () => {
        body.classList.add('duck--blink');
        setTimeout(() => body.classList.remove('duck--blink'), 140);
        setTimeout(blink, rnd(1400, 4200));
      };
      setTimeout(blink, 600 + idx * 300);
    });

    duckNodes.forEach((node) => {
      node.addEventListener('click', () => {
        if (node.classList.contains('patted')) return;
        node.classList.add('patted');
        setTimeout(() => node.classList.remove('patted'), 600);
      });
    });
  }

  const root = document.getElementById('ambient-lights');
  if (root && !root.dataset.initialized) {
    root.dataset.initialized = '1';

    const isMobile = matchMedia('(max-width: 768px)').matches;
    const cfg = {
      count: isMobile ? 3 : 5,
      colors: ['#FFD94C', '#6FA7FF', '#FFFFFF']
    };
    const pick = (arr) => arr[(Math.random() * arr.length) | 0];
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < cfg.count; i++) {
      const el = document.createElement('div');
      el.className = 'ambient-light';
      const size = rnd(isMobile ? 160 : 220, isMobile ? 360 : 520);
      const blur = rnd(18, 60);
      const opacity = (Math.random() * (0.45 - 0.22) + 0.22).toFixed(2);
      const dur = rnd(14, 22) + 's';
      const color = pick(cfg.colors);

      el.style.setProperty('--size', size + 'px');
      el.style.setProperty('--blur', blur + 'px');
      el.style.setProperty('--opacity', opacity);
      el.style.setProperty('--color', color);
      el.style.setProperty('--dur', dur);

      const x = rnd(10, 90) + 'vw';
      const y = rnd(10, 90) + 'vh';
      el.style.left = x;
      el.style.top = y;
      el.style.translate = '-50% -50%';

      root.appendChild(el);

      const dx = (Math.random() < 0.5 ? -1 : 1) * rnd(20, 50);
      const dy = (Math.random() < 0.5 ? -1 : 1) * rnd(10, 30);
      el.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: `translate(${dx}px, ${dy}px)` }
        ],
        { duration: rnd(4000, 7000), easing: 'ease-in-out', fill: 'forwards' }
      );
    }
  }
})();

let currentOffset = 0;

function moveSlide(direction) {
  const track = document.querySelector(".gallery-track");
  const imageWidth = track.children[0].offsetWidth + 16;
  currentOffset += direction * imageWidth;
  track.scrollTo({
    left: currentOffset,
    behavior: "smooth"
  });
}

function openModal(src) {
  document.getElementById("modalImg").src = src;
  document.getElementById("imageModal").style.display = "flex";
}


function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <span id="toast-msg"></span>
      <button class="toast-close" onclick="closeToast()">✕</button>
    `;
    document.body.appendChild(toast);
  }

  document.getElementById("toast-msg").innerText = message;
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    closeToast();
  }, 4000);
}

function closeToast() {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.remove("show");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtns = document.querySelectorAll(".btn-download");
  downloadBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Download started! Check your downloads.");
    });
  });

  // === Scroll Fade-In Animation ===
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = document.querySelectorAll('section, article, .card, .project-hero, .project-text, .gallery, .plugin-details');

  animatedElements.forEach(el => {
    el.classList.add('fade-on-scroll');
    observer.observe(el);
  });
});

function copyCode(btn) {
  const wrapper = btn.closest('.code-wrapper');
  const code = wrapper.querySelector('code').innerText;

  navigator.clipboard.writeText(code).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
      Copied!
    `;
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  });
}
