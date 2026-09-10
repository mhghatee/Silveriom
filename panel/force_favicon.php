<?php
// We want exactly the main site's favicon.
// The main site's favicon is /home/h417440/public_html/favicon.png
$src = '/home/h417440/public_html/favicon.png';
$dest_sub_png = '/home/h417440/panel.silveriom.ir/favicon.png';
$dest_sub_ico = '/home/h417440/panel.silveriom.ir/favicon.ico';
$dest_main_ico = '/home/h417440/public_html/favicon.ico';

copy($src, $dest_sub_png);
copy($src, $dest_sub_ico);
copy($src, $dest_main_ico);

// We also need to fix the title in auth.js!
$auth_js = '/home/h417440/panel.silveriom.ir/auth.js';
if(file_exists($auth_js)) {
    $content = file_get_contents($auth_js);
    $content = str_replace("document.title = 'مدیاکیت سیلوریوم';", "document.title = 'ورود به پنل مدیریت | سیلوریوم';", $content);
    file_put_contents($auth_js, $content);
}

// And fix the title in public_html/panel/auth.js
$auth_js2 = '/home/h417440/public_html/panel/auth.js';
if(file_exists($auth_js2)) {
    $content = file_get_contents($auth_js2);
    $content = str_replace("document.title = 'مدیاکیت سیلوریوم';", "document.title = 'ورود به پنل مدیریت | سیلوریوم';", $content);
    file_put_contents($auth_js2, $content);
}

echo "SUCCESS";
