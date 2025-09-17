document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Salir si el elemento no existe

    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + (parseFloat(getComputedStyle(cards[0]).marginRight) * 2);
    let scrollPosition = 0;

    // Duplicar las tarjetas para crear el efecto infinito
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    function startCarousel() {
        setInterval(() => {
            scrollPosition += cardWidth;
            track.style.transform = `translateX(-${scrollPosition}px)`;

            // Si llegamos a la mitad del carrusel (donde están las copias), reiniciamos la posición
            if (scrollPosition >= cardWidth * cards.length) {
                scrollPosition = 0;
                track.style.transition = 'none'; // Desactivar la transición para el reinicio
                track.style.transform = `translateX(-${scrollPosition}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-in-out'; // Reactivar la transición
                }, 10);
            }
        }, 3000); // El carrusel se mueve cada 3 segundos
    }

    startCarousel();
});