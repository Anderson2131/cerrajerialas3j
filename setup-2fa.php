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

require_once __DIR__ . '/session.php';

if (!isset($_SESSION['setup_mode']) || $_SESSION['setup_mode'] !== true) {
    header('Location: /login.html');
    exit;
}

$config = getConfig();

function generateSecret($length = 20) {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $secret = '';
    for ($i = 0; $i < $length; $i++) {
        $secret .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $secret;
}

function generateQRCodeURL($secret, $label = 'CerrajeriaLas3J') {
    return 'otpauth://totp/' . urlencode($label) . '?secret=' . $secret . '&issuer=CerrajeriaLas3J&period=30&digits=6';
}

if (!isset($_SESSION['setup_secret'])) {
    $_SESSION['setup_secret'] = generateSecret();
    $_SESSION['setup_verified'] = false;
}

$secret = $_SESSION['setup_secret'];
$qrUrl = generateQRCodeURL($secret);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['verify_totp'])) {
    $code = isset($_POST['verify_code']) ? preg_replace('/[^0-9]/', '', $_POST['verify_code']) : '';
    if (strlen($code) === 6 && ctype_digit($code) && verifyTOTP($_SESSION['setup_secret'], $code)) {
        $configFile = '<?php\nreturn [\n';
        $configFile .= "    'authorized_phone' => '" . addslashes($config['authorized_phone']) . "',\n";
        $configFile .= "    'totp_secret' => '" . addslashes($secret) . "',\n";
        $configFile .= "    'session_timeout' => " . $config['session_timeout'] . ",\n";
        $configFile .= "    'max_attempts' => " . $config['max_attempts'] . ",\n";
        $configFile .= "    'attempt_window' => " . $config['attempt_window'] . ",\n";
        $configFile .= "    'lockout_duration' => " . $config['lockout_duration'] . ",\n";
        $configFile .= "];\n";
        file_put_contents(__DIR__ . '/auth-config.php', $configFile);
        $_SESSION['setup_verified'] = true;
        unset($_SESSION['setup_mode']);
        unset($_SESSION['setup_secret']);
        $success = true;
    } else {
        $verifyError = 'El código no es válido. Intente de nuevo.';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurar Autenticación - Cerrajería Las 3J</title>
    <link rel="stylesheet" href="style.css?v=13">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .setup-container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 28px;
            padding: 40px 30px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
            text-align: center;
        }
        .setup-container h2 { color: #fff; font-size: 22px; margin-bottom: 10px; }
        .setup-container p { color: rgba(255, 255, 255, 0.6); font-size: 14px; margin-bottom: 20px; }
        .qr-code { background: #fff; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px; }
        .secret-display {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            word-break: break-all;
            color: #FCD34D;
            font-family: monospace;
            font-size: 16px;
        }
        .verify-form { margin-top: 20px; }
        .verify-form input {
            width: 100%;
            padding: 14px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
            font-size: 18px;
            text-align: center;
            font-family: 'Poppins', sans-serif;
            margin-bottom: 15px;
        }
        .verify-form input:focus { outline: none; border-color: #F59E0B; }
        .btn-verify {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #D97706, #F59E0B);
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
        }
        .btn-verify:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4); }
        .success-message {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #86efac;
            padding: 15px;
            border-radius: 12px;
            font-size: 14px;
        }
        .error-msg { color: #fca5a5; font-size: 14px; margin-bottom: 10px; }
        .steps { text-align: left; margin-bottom: 20px; }
        .steps li { color: rgba(255, 255, 255, 0.7); font-size: 13px; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .steps li::before { content: '✓'; position: absolute; left: 0; color: #F59E0B; }
    </style>
</head>
<body>
    <div class="setup-container">
        <h2><i class="fas fa-shield-alt"></i> Configurar Autenticación</h2>
        <p>Escanea el código QR con Google Authenticator y verifica el código de 6 dígitos</p>

        <?php if (isset($success)): ?>
            <div class="success-message">
                <i class="fas fa-check-circle"></i> Autenticación configurada exitosamente. Serás redirigido...
            </div>
            <script>setTimeout(function(){ window.location.href = '/login.html'; }, 2000);</script>
        <?php else: ?>
            <div class="steps">
                <li>Descarga Google Authenticator</li>
                <li>Escanea el código QR</li>
                <li>Introduce el código de 6 dígitos</li>
            </div>

            <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=<?php echo urlencode($qrUrl); ?>" alt="QR Code TOTP" style="width: 200px; height: 200px;">
            </div>

            <div class="secret-display">
                <strong>Clave manual:</strong><br><?php echo $secret; ?>
            </div>

            <?php if (isset($verifyError)): ?>
                <div class="error-msg"><?php echo $verifyError; ?></div>
            <?php endif; ?>

            <form method="POST" class="verify-form">
                <input type="text" name="verify_code" placeholder="000000" maxlength="6" inputmode="numeric" required>
                <button type="submit" name="verify_totp" class="btn-verify">
                    <i class="fas fa-check-circle"></i> Verificar y Guardar
                </button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>