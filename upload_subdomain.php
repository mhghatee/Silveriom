<?php
if(isset($_FILES['file'])) {
    $target_path = "/home/h417440/panel.silveriom.ir/v2_upload.zip";
    if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
        $zip = new ZipArchive;
        if ($zip->open($target_path) === TRUE) {
          $zip->extractTo('/home/h417440/panel.silveriom.ir/');
          $zip->close();
          unlink($target_path);
          echo 'SUCCESS';
        } else { echo 'ZIP_FAILED'; }
    } else { echo 'UPLOAD_FAILED'; }
} else { echo 'NO_FILE'; }
?>
