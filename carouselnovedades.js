
/*document.addEventListener('DOMContentLoaded', function () {
    // Configuración de Swiper
    const swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1024: {
                spaceBetween: 40,
            }
        },
    });

    // Lógica para mostrar/ocultar texto en las tarjetas
    const toggleButtons = document.querySelectorAll('.toggle-text');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.carousel-card');
            const previewText = card.querySelector('.preview-text');
            const fullText = card.querySelector('.full-text');

            if (fullText.style.display === 'none' || fullText.style.display === '') {
                previewText.style.display = 'none';
                fullText.style.display = 'block';
                this.textContent = 'Mostrar menos';
                swiper.autoplay.stop();
            } else {
                fullText.style.display = 'none';
                previewText.style.display = 'block';
                this.textContent = 'Seguir leyendo';
                swiper.autoplay.start();
            }
        });
    });
});*/

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const cards = Array.from(track.children);
  const cardStyle = getComputedStyle(cards[0]);
  const cardMargin = parseFloat(cardStyle.marginRight) + parseFloat(cardStyle.marginLeft);
  const cardWidth = cards[0].offsetWidth + cardMargin;
  
  let scrollPosition = 0;
  let carouselInterval;

  // Duplicar tarjetas para lograr el carrusel infinito
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Movimiento automático (suave)
  function startCarousel() {
    carouselInterval = setInterval(() => {
      scrollPosition += 1;
      track.style.transform = `translateX(-${scrollPosition}px)`;

      if (scrollPosition >= cardWidth * cards.length) {
        track.style.transition = 'none';
        scrollPosition = 0;
        track.style.transform = `translateX(0)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.05s linear';
        }, 20);
      }
    }, 25);  // Lento, ajustado para suavidad
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }

  startCarousel();

  // Botones Prev y Next
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function moveNext() {
    stopCarousel();
    scrollPosition += cardWidth;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${scrollPosition}px)`;
    resetAutoplay();
  }

  function movePrev() {
    stopCarousel();
    scrollPosition -= cardWidth;
    if (scrollPosition < 0) scrollPosition = cardWidth * cards.length;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${scrollPosition}px)`;
    resetAutoplay();
  }

  nextBtn.addEventListener('click', moveNext);
  prevBtn.addEventListener('click', movePrev);

  // Reanudar autoplay tras 5 segundos sin interacción
  let autoplayTimeout;
  function resetAutoplay() {
    clearTimeout(autoplayTimeout);
    autoplayTimeout = setTimeout(() => {
      if (!carouselInterval) startCarousel();
    }, 5000);
  }

  // Detener el carrusel con hover en las tarjetas
  track.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('mouseenter', stopCarousel);
    card.addEventListener('mouseleave', resetAutoplay);
  });

  // Toggle "Seguir leyendo"
  track.querySelectorAll('.carousel-card').forEach(card => {
    const button = card.querySelector('.toggle-text');
    const preview = card.querySelector('.preview-text');
    const full = card.querySelector('.full-text');

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (full.style.display === 'none') {
        full.style.display = 'block';
        preview.style.display = 'none';
        button.textContent = 'Mostrar menos';
        stopCarousel();
      } else {
        full.style.display = 'none';
        preview.style.display = 'block';
        button.textContent = 'Seguir leyendo';
        resetAutoplay();
      }
    });
  });

  // Clic fuera para cerrar textos y reanudar
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.carousel-card')) {
      track.querySelectorAll('.carousel-card').forEach(card => {
        const button = card.querySelector('.toggle-text');
        const preview = card.querySelector('.preview-text');
        const full = card.querySelector('.full-text');

        if (full.style.display === 'block') {
          full.style.display = 'none';
          preview.style.display = 'block';
          button.textContent = 'Seguir leyendo';
        }
      });
      resetAutoplay();
    }
  });

  // Hacer que el carrusel sea movible en pantallas touch
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 50) {
      moveNext(); // Desplazar hacia la izquierda
    }

    if (touchEndX - touchStartX > 50) {
      movePrev(); // Desplazar hacia la derecha
    }
  });
});

