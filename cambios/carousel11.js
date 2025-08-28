document.addEventListener("DOMContentLoaded", function () {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".carousel-images img");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.add("hidden");
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.remove("hidden");
        slide.classList.add("active");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  showSlide
