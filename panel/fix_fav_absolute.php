<?php
// We want exactly the main site's favicon.
// The main site's favicon is /home/h417440/public_html/favicon.png
$src = '/home/h417440/public_html/favicon.png';
$dest_sub_png = '/home/h417440/panel.silveriom.ir/favicon.png';
$dest_sub_ico = '/home/h417440/panel.silveriom.ir/favicon.ico';

copy($src, $dest_sub_png);
copy($src, $dest_sub_ico);

$files = [
    '/home/h417440/panel.silveriom.ir/login.html',
    '/home/h417440/panel.silveriom.ir/index.html',
    '/home/h417440/panel.silveriom.ir/admin.html',
    '/home/h417440/public_html/panel/login.html',
    '/home/h417440/public_html/panel/index.html',
    '/home/h417440/public_html/panel/admin.html',
];

foreach($files as $f) {
    if(file_exists($f)) {
        $content = file_get_contents($f);
        // Force replace any favicon link to use v=9999 to aggressively bust cache
        $content = preg_replace('/<link rel="icon"[^>]*>/', '<link rel="icon" type="image/png" href="https://panel.silveriom.ir/favicon.png?v=' . time() . '" sizes="any">', $content);
        $content = preg_replace('/<link rel="apple-touch-icon"[^>]*>/', '<link rel="apple-touch-icon" href="https://panel.silveriom.ir/favicon.png?v=' . time() . '">', $content);
        file_put_contents($f, $content);
    }
}
echo "SUCCESS";
