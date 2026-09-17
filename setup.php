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

if (!isset($_GET['key']) || $_GET['key'] !== 'setup-2fa-' . md5(__FILE__)) {
    header('Location: /login.html');
    exit;
}

$_SESSION['setup_mode'] = true;
header('Location: /setup-2fa.php');
exit;