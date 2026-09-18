<?php
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

function getConfig() {
    static $config = null;
    if ($config === null) {
        $config = require_once __DIR__ . '/auth-config.php';
    }
    return $config;
}

function base32_decode($data) {
    $data = strtoupper($data);
    $data = str_replace(['=', ' '], '', $data);
    $map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $result = '';
    $buffer = 0;
    $bits = 0;
    for ($i = 0; $i < strlen($data); $i++) {
        $value = strpos($map, $data[$i]);
        if ($value === false) continue;
        $buffer = ($buffer << 5) | $value;
        $bits += 5;
        while ($bits >= 8) {
            $bits -= 8;
            $result .= chr(($buffer >> $bits) & 0xFF);
            $buffer &= (1 << $bits) - 1;
        }
    }
    return $result;
}

function generateTOTP($secret, $time = null) {
    $secret = base32_decode($secret);
    if ($time === null) {
        $time = floor(time() / 30);
    }
    $time = pack('J', $time);
    $hash = hash_hmac('sha1', $time, $secret, true);
    $offset = ord($hash[19]) & 0x0F;
    $code = (ord($hash[$offset]) & 0x7F) << 24
          | (ord($hash[$offset + 1]) & 0xFF) << 16
          | (ord($hash[$offset + 2]) & 0xFF) << 8
          | (ord($hash[$offset + 3]) & 0xFF);
    return str_pad($code % 1000000, 6, '0', STR_PAD_LEFT);
}

function verifyTOTP($secret, $code, $window = 1) {
    $config = getConfig();
    $time = floor(time() / 30);
    for ($i = -$window; $i <= $window; $i++) {
        if (generateTOTP($secret, $time + $i) === $code) {
            return true;
        }
    }
    return false;
}

function isAuthenticated() {
    if (!isset($_SESSION['facturador_autorizado']) || $_SESSION['facturador_autorizado'] !== true) {
        return false;
    }
    $config = getConfig();
    if (isset($_SESSION['auth_time']) && (time() - $_SESSION['auth_time']) > $config['session_timeout']) {
        session_unset();
        session_destroy();
        return false;
    }
    return true;
}

function requireAuth() {
    if (!isAuthenticated()) {
        header('Location: /login.html');
        exit;
    }
}

function getRemainingAttempts($phone) {
    $config = getConfig();
    if (!isset($_SESSION['attempts'][$phone])) return 5;
    $attempts = $_SESSION['attempts'][$phone];
    $now = time();
    $validAttempts = array_filter($attempts, function($t) use ($now, $config) {
        return ($now - $t) < $config['attempt_window'];
    });
    return max(0, 5 - count($validAttempts));
}

function recordAttempt($phone) {
    if (!isset($_SESSION['attempts'])) $_SESSION['attempts'] = [];
    if (!isset($_SESSION['attempts'][$phone])) $_SESSION['attempts'][$phone] = [];
    $_SESSION['attempts'][$phone][] = time();
}

function isLockedOut($phone) {
    if (!isset($_SESSION['attempts'][$phone])) return false;
    $config = getConfig();
    $recent = array_filter($_SESSION['attempts'][$phone], function($t) use ($config) {
        return (time() - $t) < $config['lockout_duration'];
    });
    return count($recent) >= $config['max_attempts'];
}

function clearAttempts($phone) {
    if (isset($_SESSION['attempts'][$phone])) {
        unset($_SESSION['attempts'][$phone]);
    }
}