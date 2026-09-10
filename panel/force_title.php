<?php
$files = [
    '/home/h417440/panel.silveriom.ir/login.html',
    '/home/h417440/panel.silveriom.ir/index.html',
    '/home/h417440/public_html/panel/login.html',
    '/home/h417440/public_html/panel/index.html',
];

foreach($files as $f) {
    if(file_exists($f)) {
        $content = file_get_contents($f);
        $content = str_replace('<title>پورتال سیلوریوم | ورود و مدیاکیت</title>', '<title>ورود به پنل مدیریت | سیلوریوم</title>', $content);
        file_put_contents($f, $content);
    }
}
echo "SUCCESS";
