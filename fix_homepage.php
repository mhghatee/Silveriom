<?php
// Just copy the uploaded index.html to public_html/index.html safely.
$src = '/home/h417440/panel.silveriom.ir/index.html_safe';
$dest = '/home/h417440/public_html/index.html';
if(file_exists($src)) {
    copy($src, $dest);
    echo "SUCCESS_HOMEPAGE";
} else {
    echo "FAILED_MISSING_SRC";
}
