document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const cards = Array.from(track.children);
  const cardStyle = getComputedStyle(cards[0]);
  const cardMargin = parseFloat(cardStyle.marginRight) + parseFloat(cardStyle.marginLeft);
  const cardWidth = cards[0].offsetWidth + cardMargin;

  // Duplicar tarjetas para loop infinito
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  let scrollPosition = 0;
  let carouselInterval;
  let isPaused = false; // indica si el carrusel está pausado por "Seguir leyendo"

  function startCarousel() {
    if (carouselInterval) return;
    track.style.transition = 'transform 0.05s linear';
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
    }, 15);
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }

  startCarousel();

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function moveNext() {
    scrollPosition += cardWidth;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${scrollPosition}px)`;
    if (!carouselInterval && !isPaused) startCarousel();
  }

  function movePrev() {
    scrollPosition -= cardWidth;
    if (scrollPosition < 0) scrollPosition = cardWidth * cards.length;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${scrollPosition}px)`;
    if (!carouselInterval && !isPaused) startCarousel();
  }

  nextBtn.addEventListener('click', () => {
    moveNext();
    closeAllCards(); // cerrar tarjetas abiertas al usar botones
  });

  prevBtn.addEventListener('click', () => {
    movePrev();
    closeAllCards(); // cerrar tarjetas abiertas al usar botones
  });

  // Toggle "Seguir leyendo"
  track.querySelectorAll('.carousel-card').forEach(card => {
    const button = card.querySelector('.toggle-text');
    const preview = card.querySelector('.preview-text');
    const full = card.querySelector('.full-text');

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      isPaused = true; // pausamos el carrusel
      stopCarousel();

      if (full.style.display === 'none' || full.style.display === '') {
        full.style.display = 'flex';
        preview.style.display = 'none';
        button.textContent = 'Mostrar menos';
      } else {
        full.style.display = 'none';
        preview.style.display = 'block';
        button.textContent = 'Seguir leyendo';
      }
    });
  });

  // Función para cerrar todas las tarjetas abiertas
  function closeAllCards() {
    track.querySelectorAll('.carousel-card').forEach(card => {
      const preview = card.querySelector('.preview-text');
      const full = card.querySelector('.full-text');
      const button = card.querySelector('.toggle-text');

      if (full.style.display === 'flex') {
        full.style.display = 'none';
        preview.style.display = 'block';
        button.textContent = 'Seguir leyendo';
      }
    });
  }

  // Clic fuera de tarjetas para reactivar carrusel y cerrar tarjetas
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.carousel-card')) {
      closeAllCards();
      isPaused = false;
      startCarousel();
    }
  });
});
