<?php
$host = 'localhost';
$db   = 'h417440_panel';
$user = 'h417440_panel';
$pass = 'Mhg@H@7479#';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // 1. Create Tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS venues (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        region VARCHAR(100),
        foot_traffic_estimate INT,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS inventory_assets (
        id VARCHAR(50) PRIMARY KEY,
        code VARCHAR(50),
        title VARCHAR(255),
        tariff VARCHAR(100),
        dimensions VARCHAR(100),
        views VARCHAR(100),
        print_type VARCHAR(100),
        audience VARCHAR(100),
        status VARCHAR(50),
        image TEXT,
        type VARCHAR(100),
        location VARCHAR(100),
        display_pages VARCHAR(100),
        tag VARCHAR(100),
        impact VARCHAR(100),
        specs TEXT,
        avail VARCHAR(100),
        `desc` TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255),
        brand VARCHAR(255),
        phone VARCHAR(50),
        cart JSON,
        lead_status VARCHAR(50) DEFAULT 'New',
        created_at VARCHAR(100)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS content_entries (
        id VARCHAR(50) PRIMARY KEY,
        author_id VARCHAR(50),
        content_type VARCHAR(50),
        title VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        body_content TEXT,
        metadata JSON,
        published_at TIMESTAMP NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS legacy_store (
        store_key VARCHAR(50) PRIMARY KEY,
        store_value JSON
    )");

    echo "Tables created successfully.\n";

    // 2. Import Data from JSON
    $jsonFile = 'data/silveriom_db.json';
    if(file_exists($jsonFile)) {
        $data = json_decode(file_get_contents($jsonFile), true);

        // Import Inventory
        if(!empty($data['mediaInventory'])) {
            $stmt = $pdo->prepare("INSERT IGNORE INTO inventory_assets (id, code, title, tariff, dimensions, views, print_type, audience, status, image, type, location, display_pages, tag, impact, specs, avail, `desc`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            foreach($data['mediaInventory'] as $inv) {
                $stmt->execute([
                    $inv['id'] ?? uniqid(),
                    $inv['code'] ?? '',
                    $inv['title'] ?? '',
                    $inv['tariff'] ?? '',
                    $inv['dimensions'] ?? '',
                    $inv['views'] ?? '',
                    $inv['print_type'] ?? '',
                    $inv['audience'] ?? '',
                    $inv['status'] ?? '',
                    $inv['image'] ?? '',
                    $inv['type'] ?? '',
                    $inv['location'] ?? '',
                    $inv['display_pages'] ?? '',
                    $inv['tag'] ?? '',
                    $inv['impact'] ?? '',
                    $inv['specs'] ?? '',
                    $inv['avail'] ?? '',
                    $inv['desc'] ?? ''
                ]);
            }
            echo "Imported mediaInventory.\n";
        }

        // Import Inquiries
        if(!empty($data['inquiries'])) {
            $stmt = $pdo->prepare("INSERT IGNORE INTO leads (id, name, brand, phone, cart, created_at) VALUES (?,?,?,?,?,?)");
            foreach($data['inquiries'] as $lead) {
                $stmt->execute([
                    $lead['id'] ?? uniqid(),
                    $lead['name'] ?? '',
                    $lead['brand'] ?? '',
                    $lead['phone'] ?? '',
                    json_encode($lead['cart'] ?? []),
                    $lead['created_at'] ?? ''
                ]);
            }
            echo "Imported inquiries.\n";
        }

        // Import other keys to legacy_store
        $storeStmt = $pdo->prepare("INSERT INTO legacy_store (store_key, store_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE store_value = VALUES(store_value)");
        $keysToStore = ['settings', 'aboutUs', 'metrics', 'venues', 'portfolio', 'users', 'audience'];
        foreach($keysToStore as $key) {
            if(isset($data[$key])) {
                $storeStmt->execute([$key, json_encode($data[$key])]);
            }
        }
        echo "Imported legacy store.\n";
        
        // Backup old JSON just in case
        rename($jsonFile, $jsonFile . '.bak_' . time());
        echo "Data migrated and original JSON backed up.\n";
    } else {
        echo "No data file found to migrate.\n";
    }

} catch(Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
