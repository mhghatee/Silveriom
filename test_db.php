<?php
$host = 'localhost';
$db   = 'h417440_panel';
$user = 'h417440_panel';
$pass = 'Mhg@H@7479#';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "DB_CONNECTION_SUCCESS\n";
} catch (\PDOException $e) {
    echo "DB_CONNECTION_FAILED: " . $e->getMessage() . "\n";
}
?>
