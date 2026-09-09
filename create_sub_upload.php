<?php
$script = <<<'EOD'
<?php
if(isset($_FILES['file'])) {
    $target_path = "../panel.silveriom.ir/update_panel.zip";
    if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
        $zip = new ZipArchive;
        $res = $zip->open($target_path);
        if ($res === TRUE) {
          $zip->extractTo('../panel.silveriom.ir/');
          $zip->close();
          unlink($target_path);
          echo 'SUCCESS_SUBDOMAIN';
        } else {
          echo 'ZIP_FAILED';
        }
    } else {
        echo 'UPLOAD_FAILED';
    }
} else {
    echo 'NO_FILE';
}
?>
EOD;
file_put_contents('upload_to_subdomain.php', $script);
echo "Created upload_to_subdomain.php\n";
?>
