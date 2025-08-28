// Carga dinámica del navbar
fetch("./components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-placeholder").innerHTML = html;
  })
  .catch(err => console.error("Error cargando navbar:", err));

// Carga dinámica del footer
fetch("./components/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-placeholder").innerHTML = html;
  })
  .catch(err => console.error("Error cargando footer:", err));
