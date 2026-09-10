<?php
function copy_dir($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                copy_dir($src . '/' . $file, $dst . '/' . $file);
            }
            else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

copy_dir('/home/h417440/public_html/panel', '/home/h417440/panel.silveriom.ir');

// Fix paths in api.php and upload.php to point to public_html instead of relying on relative paths
$api_path = '/home/h417440/panel.silveriom.ir/api.php';
if(file_exists($api_path)) {
    $api_content = file_get_contents($api_path);
    $api_content = str_replace("'../data/silveriom_db.json'", "'/home/h417440/public_html/data/silveriom_db.json'", $api_content);
    $api_content = str_replace('__DIR__ . "/../data/silveriom_db.json"', "'/home/h417440/public_html/data/silveriom_db.json'", $api_content);
    file_put_contents($api_path, $api_content);
}

$upload_path = '/home/h417440/panel.silveriom.ir/upload.php';
if(file_exists($upload_path)) {
    $up_content = file_get_contents($upload_path);
    $up_content = str_replace("'../assets/uploads/'", "'/home/h417440/public_html/assets/uploads/'", $up_content);
    $up_content = str_replace('__DIR__ . "/../assets/uploads/"', "'/home/h417440/public_html/assets/uploads/'", $up_content);
    file_put_contents($upload_path, $up_content);
}

echo "Copy complete!";
