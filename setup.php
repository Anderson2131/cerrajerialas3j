<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);
session_start();

require_once __DIR__ . '/session.php';

if (!isset($_GET['key']) || $_GET['key'] !== 'setup-2fa-cerrajerialas3j-2026') {
    header('Location: /login.html');
    exit;
}

$_SESSION['setup_mode'] = true;
header('Location: /setup-2fa.php');
exit;