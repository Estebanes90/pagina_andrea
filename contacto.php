<?php
// contacto.php — formulario que carga site key desde .env

require __DIR__ . '/vendor/autoload.php'; // si usas composer
use Dotenv\Dotenv;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

// Obtiene site key (vacía si no está definida)
$siteKey = getenv('RECAPTCHA_SITE_KEY') ?: '';
$showModal = isset($_GET['success']) && $_GET['success'] == '1';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contacto – Andrea Fusco</title>
  <link rel="icon" href="assets/images/logo.png" type="image/png" />
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style_elegante.css" />
</head>
<body class="bg-[#f0f6ff] text-gray-800" id="top">

  <!-- Navbar dinámico -->
  <div id="navbar-placeholder"></div>

  <main class="max-w-3xl mx-auto py-12 px-6">
    <h2 class="text-3xl font-semibold mb-6 text-blue-900 border-b border-gray-400 pb-2 text-center shadow-md transition duration-300 hover:shadow-lg">
      Contacto
    </h2>

    <p class="text-center text-lg text-gray-700 mb-8">
      Entablemos un diálogo. Utilice este medio para contactarse con <strong>Andrea Fusco</strong>, solicitar información o realizar consultas sobre el contenido de este sitio.
    </p>

    <!-- Formulario -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <form id="contactForm" action="enviar.php" method="POST" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre y Apellido</label>
            <input type="text" id="name" name="nombre" required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700">Asunto</label>
          <input type="text" id="subject" name="asunto"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea id="message" name="mensaje" rows="5" required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
        </div>

        <button type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Enviar mensaje
        </button>

        <p id="status" class="text-center mt-4 text-sm"></p>
      </form>
    </div>
  </main>

  <!-- Footer dinámico -->
  <div id="footer-placeholder"></div>

  <script src="https://kit.fontawesome.com/d4be720107.js" crossorigin="anonymous"></script>
  <script src="script.js"></script>
  
  <!-- Google reCAPTCHA v3: se inyecta la site key desde .env -->
  <?php if ($siteKey): ?>
  <script src="https://www.google.com/recaptcha/api.js?render=<?php echo htmlspecialchars($siteKey); ?>"></script>
  <script>
  grecaptcha.ready(function() {
    document.getElementById("contactForm").addEventListener("submit", function(event) {
      event.preventDefault();
      grecaptcha.execute("<?php echo htmlspecialchars($siteKey); ?>", {action: "submit"}).then(function(token) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "g-recaptcha-response";
        input.value = token;
        document.getElementById("contactForm").appendChild(input);
        document.getElementById("contactForm").submit();
      });
    });
  });
  </script>
  <?php else: ?>
  <!-- Si no hay site key, formulario funcionará sin reCAPTCHA (solo para desarrollo) -->
  <?php endif; ?>

      <!-- Modal de agradecimiento -->
    <div id="thankYouModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
        <h3 class="text-xl font-semibold mb-2">¡Gracias por contactarme!</h3>
        <p>Tu mensaje ha sido enviado correctamente. A la brevedad me pondré en contacto contigo.</p>
        <button id="closeModal" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Cerrar</button>
      </div>
    </div>

    <script>
      function showThankYouModal() {
        const modal = document.getElementById('thankYouModal');
        modal.classList.remove('hidden');
        document.getElementById('contactForm').reset();

        document.getElementById('closeModal').addEventListener('click', function() {
          modal.classList.add('hidden');
        });

        // Ocultar automáticamente después de 5 segundos
        //setTimeout(() => modal.classList.add('hidden'), 5000);
      }

      <?php if($showModal): ?>
        document.addEventListener("DOMContentLoaded", showThankYouModal);
      <?php endif; ?>
    </script>


</body>
</html>
