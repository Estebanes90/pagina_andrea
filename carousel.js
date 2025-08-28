// script.js - Carrusel de imágenes con puntos indicadores
document.addEventListener("DOMContentLoaded", function () {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".carousel-images img");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsContainer = document.querySelector(".carousel-dots");

  // Crear los puntos según cantidad de slides
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-600 focus:outline-none";
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.add("hidden");
      slide.classList.remove("active");
      dots[i].classList.remove("bg-gray-800");
      dots[i].classList.add("bg-gray-400");
    });

    slides[index].classList.remove("hidden");
    slides[index].classList.add("active");
    dots[index].classList.remove("bg-gray-400");
    dots[index].classList.add("bg-gray-800");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Mostrar primer slide al cargar
  showSlide(currentSlide);

  // Navegación manual
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Cambio automático cada 4 segundos
  setInterval(nextSlide, 4000);
});

