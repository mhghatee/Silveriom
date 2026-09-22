<?php
$files = [];
if (is_dir('/home/h417440/public_html/assets/uploads')) {
    $files['public_html'] = count(scandir('/home/h417440/public_html/assets/uploads'));
}
if (is_dir('/home/h417440/assets/uploads')) {
    $files['fallback'] = count(scandir('/home/h417440/assets/uploads'));
}
if (is_dir('/home/h417440/panel.silveriom.ir/assets/uploads')) {
    $files['panel_assets'] = count(scandir('/home/h417440/panel.silveriom.ir/assets/uploads'));
}
echo json_encode($files);
