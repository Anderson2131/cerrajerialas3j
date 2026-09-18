<?php
$totpSecret = getenv('TOTP_SECRET') ?: 'JBSWY3DPEHPK3PXP';
return [
    'authorized_phone' => '3249610909',
    'totp_secret' => $totpSecret,
    'session_timeout' => 3600,
    'max_attempts' => 5,
    'attempt_window' => 300,
    'lockout_duration' => 300,
];