<?php
$pdo = new PDO("mysql:host=localhost;dbname=h417440_panel;charset=utf8mb4", "h417440_panel", "Mhg@H@7479#", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$stmt = $pdo->query("SELECT id, title, specs FROM inventory_assets LIMIT 5");
print_r($stmt->fetchAll());
?>
