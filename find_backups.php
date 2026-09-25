<?php
echo "Searching for silveriom_db backups using PHP...\n";
function searchDir($dir) {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f == '.' || $f == '..') continue;
        $path = $dir . '/' . $f;
        if (is_dir($path)) {
            // skip common large dirs to avoid timeout
            if (strpos($path, '/home/h417440/public_html/assets') !== false) continue;
            searchDir($path);
        } else {
            if (strpos($f, 'silveriom_db') !== false || strpos($f, 'db') !== false) {
                if (filesize($path) > 1000 && strpos($f, '.json') !== false) {
                    echo $path . " (" . filesize($path) . " bytes) - " . date("Y-m-d H:i:s", filemtime($path)) . "\n";
                }
            }
        }
    }
}
searchDir('/home/h417440/public_html');
searchDir('/home/h417440/panel.silveriom.ir');
?>
