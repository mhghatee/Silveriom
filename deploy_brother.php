<?php
$files = [
    'panel/index.html' => '/home/h417440/panel.silveriom.ir/index.html',
    'panel/login.html' => '/home/h417440/panel.silveriom.ir/login.html',
    'index.html'       => '/home/h417440/public_html/index.html',
    'favicon.png'      => '/home/h417440/public_html/favicon.png'
];
foreach($files as $src => $dest) {
    if(file_exists($src)) {
        copy($src, $dest);
        echo "Copied $src\n";
    }
}
copy('favicon.png', '/home/h417440/panel.silveriom.ir/favicon.png');
echo "SUCCESS";
