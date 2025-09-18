// assets/js/galeria.js
// Funciones globales para que los onclick inline sigan funcionando
window.toggleAlbum = toggleAlbum;
window.toggleSubalbum = toggleSubalbum;

/* -------------------------
   Helpers: show/hide con animación
   ------------------------- */
function isHidden(el) {
  return window.getComputedStyle(el).display === 'none';
}

function animateShow(el, display = 'block', duration = 400) {
  // prepara
  el.style.display = display;
  el.style.overflow = 'hidden';
  el.style.opacity = 0;
  el.style.maxHeight = '0px';
  // Forzar reflow
  el.getBoundingClientRect();

  // animar
  const full = el.scrollHeight + 20; // un poco de margen
  el.style.transition = `max-height ${duration}ms ease, opacity ${duration}ms ease`;
  requestAnimationFrame(() => {
    el.style.maxHeight = full + 'px';
    el.style.opacity = 1;
  });

  // limpiar después de la animación
  const cleanup = () => {
    el.style.removeProperty('max-height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
    el.style.removeProperty('opacity');
    el.removeEventListener('transitionend', cleanup);
  };
  el.addEventListener('transitionend', cleanup);
}

function animateHide(el, duration = 300) {
  // si ya está oculto, nada
  if (isHidden(el)) return;
  // fijar maxHeight actual para animar desde ahí
  el.style.overflow = 'hidden';
  const cur = el.scrollHeight;
  el.style.maxHeight = cur + 'px';
  // forzar reflow
  el.getBoundingClientRect();

  // animar a 0
  el.style.transition = `max-height ${duration}ms ease, opacity ${duration}ms ease`;
  requestAnimationFrame(() => {
    el.style.maxHeight = '0px';
    el.style.opacity = 0;
  });

  const onEnd = () => {
    el.style.display = 'none';
    // limpiar estilos inline que podrían interferir cuando se muestre de nuevo
    el.style.removeProperty('max-height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
    el.style.removeProperty('opacity');
    el.removeEventListener('transitionend', onEnd);
  };
  el.addEventListener('transitionend', onEnd);
}

/* -------------------------
   Toggle álbum principal
   ------------------------- */
function toggleAlbum(id) {
  const target = document.getElementById(id);
  if (!target) {
    console.warn('toggleAlbum: no existe el elemento con id=', id);
    return;
  }

  // Cerramos todas las secciones (excepto la que vamos a abrir si corresponde)
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  sections.forEach(sec => {
    if (sec === target) return; // lo tratamos luego
    // esconder si visible
    if (!isHidden(sec)) {
      animateHide(sec);
      // también ocultar subálbumes dentro (por si quedaron abiertos)
      const subs = sec.querySelectorAll('[id]');
      subs.forEach(s => {
        if (!isHidden(s)) animateHide(s);
      });
    }
  });

  // Alternar target
  if (isHidden(target)) {
    // mostrar con animación (display block)
    animateShow(target, 'block', 420);
    // hacer scroll unos ms después para que la animación empiece
    setTimeout(() => {
      window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    }, 180);
  } else {
    animateHide(target);
  }
}

/* -------------------------
   Toggle subálbum dentro de #conciertos
   ------------------------- */
function toggleSubalbum(id) {
  const target = document.getElementById(id);
  if (!target) {
    console.warn("No existe el subálbum con id=", id);
    return;
  }

  // Obtener todos los subálbumes dentro de #conciertos
  const subalbums = document.querySelectorAll('#conciertos > div[id]');

  // Ocultar todos menos el target
  subalbums.forEach(sa => {
    if (sa !== target && sa.style.display !== 'none') {
      animateHide(sa);
    }
  });

  // Toggle del target
  if (isHidden(target)) {
    animateShow(target, 'block', 360);
    setTimeout(() => {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }, 200);
  } else {
    animateHide(target);
  }
}
