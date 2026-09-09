<?php
$source = __DIR__ . '/panel';
$dest = realpath(__DIR__ . '/../panel.silveriom.ir');

if (!$dest || !is_dir($dest)) {
    // If the folder doesn't exist, try creating it just in case
    mkdir(__DIR__ . '/../panel.silveriom.ir', 0755, true);
    $dest = realpath(__DIR__ . '/../panel.silveriom.ir');
}

// 1. Copy files
function copyDir($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while (($file = readdir($dir)) !== false) {
        if ($file != '.' && $file != '..') {
            if (is_dir($src . '/' . $file)) {
                copyDir($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}
copyDir($source, $dest);

// 2. Update api.php in subdomain
$apiFile = $dest . '/api.php';
$apiCode = file_get_contents($apiFile);
$apiCode = str_replace(
    "header('Content-Type: application/json');",
    "header('Content-Type: application/json');\nheader('Access-Control-Allow-Origin: *');\nheader('Access-Control-Allow-Methods: GET, POST, OPTIONS');\nheader('Access-Control-Allow-Headers: Content-Type');\nif (\$_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }",
    $apiCode
);
$apiCode = str_replace("'../data/silveriom_db.json'", "'../public_html/data/silveriom_db.json'", $apiCode);
$apiCode = str_replace("'../data'", "'../public_html/data'", $apiCode);
file_put_contents($apiFile, $apiCode);

// 3. Update HTML/JS files in subdomain
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dest));
foreach ($iterator as $file) {
    if ($file->isFile() && in_array($file->getExtension(), ['html', 'js'])) {
        $content = file_get_contents($file->getPathname());
        $content = str_replace('../assets', 'https://silveriom.ir/assets', $content);
        $content = str_replace('../fonts', 'https://silveriom.ir/fonts', $content);
        $content = str_replace('../css', 'https://silveriom.ir/css', $content);
        $content = str_replace('../js', 'https://silveriom.ir/js', $content);
        file_put_contents($file->getPathname(), $content);
    }
}

// 4. Create .htaccess in public_html/panel
$htaccess = "RewriteEngine On\nRewriteRule ^(.*)$ https://panel.silveriom.ir/$1 [R=301,L]";
file_put_contents($source . '/.htaccess', $htaccess);

echo "MIGRATION_SUCCESS\n";
?>
