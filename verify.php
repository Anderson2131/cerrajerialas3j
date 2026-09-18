<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    session_start();
}

require_once __DIR__ . '/session.php';

$config = getConfig();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /login.html?error=invalid');
    exit;
}

$phone = isset($_POST['phone']) ? preg_replace('/[^0-9+]/', '', $_POST['phone']) : '';
$totpCode = isset($_POST['totp_code']) ? preg_replace('/[^0-9]/', '', $_POST['totp_code']) : '';

if (isset($_POST['totp_code'])) {
    if (isLockedOut($phone)) {
        header('Location: /login.html?error=locked');
        exit;
    }

    if (strlen($totpCode) !== 6 || !ctype_digit($totpCode)) {
        recordAttempt($phone);
        header('Location: /login.html?error=invalid');
        exit;
    }

    if (!verifyTOTP($config['totp_secret'], $totpCode)) {
        $expected = generateTOTP($config['totp_secret']);
        echo "DEBUG: expected=$expected, got=$totpCode, secret=" . $config['totp_secret'] . ", config_type=" . gettype($config);
        exit;
    }

    clearAttempts($phone);
    session_regenerate_id(true);
    $_SESSION['facturador_autorizado'] = true;
    $_SESSION['auth_time'] = time();
    $_SESSION['auth_phone'] = $phone;
    $_SESSION['last_activity'] = time();

    header('Location: /facturacion.php');
    exit;
} else {
    if (empty($phone)) {
        header('Location: /login.html?error=invalid');
        exit;
    }

    if ($phone !== $config['authorized_phone']) {
        header('Location: /login.html?error=invalid');
        exit;
    }

    if (isLockedOut($phone)) {
        header('Location: /login.html?error=locked');
        exit;
    }

    $_SESSION['auth_phone'] = $phone;
    header('Location: /login.html?info=totp&phone=' . urlencode($phone));
    exit;
}