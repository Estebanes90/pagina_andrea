<?php
// ----------------------------------------------------
// CONFIGURACIÓN
// ----------------------------------------------------
$tuCorreo = "estebanesco90@gmail.com"; // <-- cambia esto
$API_KEY = "471fcbe46846dedf3b0b05b239db3fe0"; // <-- cambia esto

// ----------------------------------------------------
// CAPTURAR DATOS
// ----------------------------------------------------
$nombre  = trim($_POST['nombre'] ?? '');
$email   = trim($_POST['email'] ?? '');
$asunto  = trim($_POST['asunto'] ?? 'Sin asunto');
$mensaje = trim($_POST['mensaje'] ?? '');

if (!$nombre || !$email || !$mensaje) {
  exit("❌ Faltan campos obligatorios.");
}

// ----------------------------------------------------
// 1️⃣ VERIFICAR CORREO CON MAILBOXLAYER
// ----------------------------------------------------
$verifyUrl = "https://apilayer.net/api/check?access_key=" . $API_KEY . "&email=" . urlencode($email) . "&smtp=1&format=1";

$response = @file_get_contents($verifyUrl);

if (!$response) {
  exit("⚠️ No se pudo verificar el correo (problema de conexión o clave inválida).");
}

$data = json_decode($response, true);

if (empty($data['smtp_check']) || !$data['smtp_check']) {
  exit("⚠️ El correo ingresado no parece existir. Por favor revisa la dirección e inténtalo nuevamente.");
}

// ----------------------------------------------------
// 2️⃣ ENVIAR CORREO LOCAL (mail estándar)
// ----------------------------------------------------
$to = $tuCorreo;
$subject = "📩 Nuevo mensaje desde tu sitio web – $asunto";

$body = "
Nombre: $nombre
Correo: $email
Asunto: $asunto
Mensaje:
$mensaje
";

$headers = "From: $nombre <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
  echo "✅ Mensaje enviado correctamente.";
} else {
  echo "❌ Error al enviar el mensaje. (Posible problema de configuración local)";
}
?>
