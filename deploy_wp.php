<?php
// One-Click WordPress & Silveriom Installer
header('Content-Type: text/plain; charset=utf-8');

set_time_limit(300);
ini_set('memory_limit', '256M');

echo "=============================================\n";
echo "   SILVERIOM WORDPRESS AUTOMATED INSTALLER   \n";
echo "=============================================\n\n";

$target_dir = '/home/h417440/public_html/wp';
$db_user = 'h417440_mhg';
$db_pass = 'Mhhananeh@7479#';
$possible_dbs = ['h417440_wp', 'wp'];
$db_name = '';

// Step 1: Verify MySQL
echo "1. Checking MySQL connection...\n";
$link = @mysqli_connect('localhost', $db_user, $db_pass);
if (!$link) {
    echo "ERROR: Could not connect to MySQL with user '$db_user'. Error: " . mysqli_connect_error() . "\n";
    exit;
}
echo "   -> Connected to MySQL successfully!\n";

foreach ($possible_dbs as $d) {
    if (@mysqli_select_db($link, $d)) {
        $db_name = $d;
        echo "   -> Found database: $db_name\n";
        break;
    }
}
if (!$db_name) {
    echo "   -> Warning: Specific DB not selected yet. Defaulting to 'h417440_wp'.\n";
    $db_name = 'h417440_wp';
}
mysqli_close($link);

// Step 2: Create directory
echo "\n2. Preparing target directory: $target_dir\n";
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true);
}
echo "   -> Target directory ready.\n";

// Step 3: Download WordPress Core (Persian)
$zip_file = $target_dir . '/wordpress.zip';
if (!file_exists($target_dir . '/wp-load.php')) {
    echo "\n3. Downloading WordPress (Persian core)...\n";
    $wp_url = 'https://fa.wordpress.org/latest-fa_IR.zip';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $wp_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    $data = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code == 200 && $data) {
        file_put_contents($zip_file, $data);
        echo "   -> Downloaded " . strlen($data) . " bytes.\n";

        echo "   -> Extracting WordPress archive...\n";
        $zip = new ZipArchive();
        if ($zip->open($zip_file) === TRUE) {
            $zip->extractTo($target_dir);
            $zip->close();
            @unlink($zip_file);

            // Move files from wordpress/ subfolder to target_dir if extracted inside wordpress/
            if (is_dir($target_dir . '/wordpress')) {
                $files = scandir($target_dir . '/wordpress');
                foreach ($files as $f) {
                    if ($f != '.' && $f != '..') {
                        rename($target_dir . '/wordpress/' . $f, $target_dir . '/' . $f);
                    }
                }
                @rmdir($target_dir . '/wordpress');
            }
            echo "   -> WordPress extracted successfully!\n";
        } else {
            echo "   -> ERROR: Failed to extract ZIP archive.\n";
        }
    } else {
        echo "   -> ERROR: Failed to download WordPress (HTTP $code).\n";
    }
} else {
    echo "\n3. WordPress core already present in $target_dir\n";
}

// Step 4: Generate wp-config.php
echo "\n4. Generating wp-config.php...\n";
$config_sample = $target_dir . '/wp-config-sample.php';
$config_dest = $target_dir . '/wp-config.php';

if (file_exists($config_sample) && !file_exists($config_dest)) {
    $cfg = file_get_contents($config_sample);
    $cfg = str_replace("database_name_here", $db_name, $cfg);
    $cfg = str_replace("username_here", $db_user, $cfg);
    $cfg = str_replace("password_here", $db_pass, $cfg);
    $cfg = str_replace("localhost", "localhost", $cfg);
    file_put_contents($config_dest, $cfg);
    echo "   -> wp-config.php configured and saved!\n";
} else {
    echo "   -> wp-config.php already exists or sample missing.\n";
}

// Step 5: Install Silveriom Theme and Core Plugin from GitHub
echo "\n5. Installing Silveriom Theme and Core Plugin...\n";
$theme_dir = $target_dir . '/wp-content/themes/silveriom-theme';
$plugin_dir = $target_dir . '/wp-content/plugins/silveriom-core';
if (!is_dir($theme_dir)) mkdir($theme_dir, 0755, true);
if (!is_dir($plugin_dir)) mkdir($plugin_dir, 0755, true);

// Fetch theme and plugin files from GitHub
$github_files = [
    'wordpress/wp-content/themes/silveriom-theme/style.css' => $theme_dir . '/style.css',
    'wordpress/wp-content/themes/silveriom-theme/functions.php' => $theme_dir . '/functions.php',
    'wordpress/wp-content/themes/silveriom-theme/header.php' => $theme_dir . '/header.php',
    'wordpress/wp-content/themes/silveriom-theme/footer.php' => $theme_dir . '/footer.php',
    'wordpress/wp-content/themes/silveriom-theme/index.php' => $theme_dir . '/index.php',
    'wordpress/wp-content/themes/silveriom-theme/page.php' => $theme_dir . '/page.php',
    'wordpress/wp-content/plugins/silveriom-core/silveriom-core.php' => $plugin_dir . '/silveriom-core.php'
];

foreach ($github_files as $gh => $local) {
    $raw_url = 'https://raw.githubusercontent.com/mhghatee/Silveriom/main/' . $gh . '?v=' . time();
    $fc = @file_get_contents($raw_url);
    if ($fc) {
        $p = dirname($local);
        if (!is_dir($p)) mkdir($p, 0755, true);
        file_put_contents($local, $fc);
        echo "   -> Installed: " . basename($local) . "\n";
    }
}

echo "\n=============================================\n";
echo "           INSTALLATION COMPLETED!           \n";
echo "=============================================\n";
echo "Open this link in your browser to complete WP initial setup:\n";
echo "https://silveriom.ir/wp/\n";
?>
