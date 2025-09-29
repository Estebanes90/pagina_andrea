document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const basePath = window.location.pathname.includes("/notas/") ? "../" : "./";

  // Cargar navbar
  fetch(basePath + "components/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      // Corregir enlace del logo
      const logo = document.getElementById("logo-link");
      if (logo && basePath === "../") {
        logo.setAttribute("href", "../index.html");
      }

      // Ajustar enlaces del navbar si estamos en subdirectorio
      document.querySelectorAll("#navbar-placeholder .nav-link").forEach(link => {
        const href = link.getAttribute("href");
        if (!href.startsWith("http") && !href.startsWith("../") && basePath === "../") {
          link.setAttribute("href", "../" + href);
        }
      });

      // Activar enlace activo
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPage || linkHref === "./" + currentPage || linkHref === "../" + currentPage) {
          link.classList.add("active");
        }
      });

      // Lógica menú hamburguesa
      const toggle = document.getElementById("menu-toggle");
      const mobileMenu = document.getElementById("mobile-menu");
      if (toggle && mobileMenu) {
        toggle.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }
    });

  // Cargar footer
  fetch(basePath + "components/footer.html")
    .then(res => res.text())
    .then(data => {
      const footer = document.getElementById("footer-placeholder");
      console.log("Footer data:", data); 
      if (footer) {
        footer.innerHTML = data;

        // Actualizar el año en el footer
        document.getElementById("year").textContent = new Date().getFullYear();

        // Lógica para el botón "Volver arriba"
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
          backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });

          // Mostrar u ocultar el botón "Volver arriba" según el scroll
          window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
              backToTop.style.display = 'block';
            } else {
              backToTop.style.display = 'none';
            }
          });
        }
      }
    });
});
