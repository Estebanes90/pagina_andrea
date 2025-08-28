
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
          link.classList.add("bg-blue-300", "shadow", "rounded-lg", "font-semibold");
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
      if (footer) {
        footer.innerHTML = data;
      }
    });
});
