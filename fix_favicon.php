<?php
$subdomain_path = realpath(__DIR__ . '/../panel.silveriom.ir');
if ($subdomain_path && is_dir($subdomain_path)) {
    // Copy favicons if they exist
    $files = ['favicon.png', 'favicon.ico', 'apple-touch-icon.png'];
    foreach ($files as $file) {
        if (file_exists(__DIR__ . '/' . $file)) {
            copy(__DIR__ . '/' . $file, $subdomain_path . '/' . $file);
            echo "Copied $file to subdomain.\n";
        }
    }
} else {
    echo "Subdomain path not found.\n";
}
?>
