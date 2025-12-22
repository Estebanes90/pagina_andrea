<?php
require __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ----------------------------------------------------
// Cargar variables de entorno
// ----------------------------------------------------
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

// ----------------------------------------------------
// Capturar datos del formulario
// ----------------------------------------------------
$nombre  = trim($_POST['nombre'] ?? '');
$email   = trim($_POST['email'] ?? '');
$asunto  = trim($_POST['asunto'] ?? 'Sin asunto');
$mensaje = trim($_POST['mensaje'] ?? '');
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

if (!$nombre || !$email || !$mensaje) {
    exit("❌ Faltan campos obligatorios.");
}

// ----------------------------------------------------
// Validar reCAPTCHA v3
// ----------------------------------------------------
$recaptchaSecret = getenv('RECAPTCHA_SECRET_KEY') ?: '';
$recaptchaMinScore = 0.5;

if ($recaptchaSecret && $recaptchaResponse) {
    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret' => $recaptchaSecret,
        'response' => $recaptchaResponse,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $verify = curl_exec($ch);
    curl_close($ch);
    $captchaData = json_decode($verify, true);

    if (empty($captchaData['success']) || !$captchaData['success'] || ($captchaData['score'] ?? 0) < $recaptchaMinScore) {
        exit("⚠️ Verificación reCAPTCHA fallida.");
    }
}

// ----------------------------------------------------
// Preparar PHPMailer
// ----------------------------------------------------
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USER') ?: 'estebanesco90@gmail.com';
    $mail->Password   = getenv('SMTP_PASS') ?: 'rwmt mapw clzr pzzo';
    $mail->SMTPSecure = getenv('SMTP_SECURE') ?: 'tls';
    $mail->Port       = getenv('SMTP_PORT') ?: 587;

    // Usar el correo autenticado como From, y Reply-To del visitante
    $mail->setFrom($mail->Username, 'Formulario Web Andrea Fusco');
    $mail->addReplyTo($email, $nombre);
    $mail->addAddress(getenv('TO_EMAIL') ?: 'estebanesco90@gmail.com');

    $mail->Subject = $asunto;
    $mail->Body    = "Nombre: $nombre\nCorreo: $email\nAsunto: $asunto\nMensaje:\n$mensaje\n\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'desconocida');

    $mail->send();
    //echo "<script>alert('✅ Mensaje enviado correctamente.'); window.location.href='contacto.php';</script>";
    // Redirigir a la misma página con flag para mostrar modal
    header("Location: contacto.php?success=1");
    exit();
} catch (Exception $e) {
    echo "<script>alert('❌ Error al enviar el mensaje: {$mail->ErrorInfo}'); window.history.back();</script>";
}
