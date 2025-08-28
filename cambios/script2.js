document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  //const basePath = location.pathname.includes("/notas/") ? "../" : "";
  // Cargar navbar
  fetch("components/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      // Activar lógica para marcar el enlace activo
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");

        // Si es navegación por páginas
        if (linkHref === currentPage) {
          link.classList.add("bg-blue-300", "shadow", "rounded-lg", "font-semibold");
        }

        // Si es navegación por anclas
        if (linkHref.startsWith("#")) {
          link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(linkHref);
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
              navLinks.forEach(l => l.classList.remove("active"));
              link.classList.add("active");
            }
          });
        }
      });

       // Agrega lógica del botón hamburguesa después de insertar el navbar
      const toggle = document.getElementById("menu-toggle");
      const mobileMenu = document.getElementById("mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});

  // Cargar footer si existe
  fetch("components/footer.html")
  //fetch(`${basePath}components/footer.html`)
    .then(res => res.text())
    .then(data => {
      const footer = document.getElementById("footer-placeholder");
      if (footer) {
        footer.innerHTML = data;
      }
    });
});
