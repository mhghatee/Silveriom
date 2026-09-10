<?php
// Copy assets/favicon.png to panel root as favicon.png and favicon.ico
$src = '/home/h417440/public_html/assets/favicon.png';
$dest_sub_png = '/home/h417440/panel.silveriom.ir/favicon.png';
$dest_sub_ico = '/home/h417440/panel.silveriom.ir/favicon.ico';

if(file_exists($src)) {
    copy($src, $dest_sub_png);
    copy($src, $dest_sub_ico);
    echo "SUCCESS_ASSETS";
} else {
    echo "ASSETS_FAVICON_NOT_FOUND";
}
