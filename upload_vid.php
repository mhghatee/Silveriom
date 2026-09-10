<?php
$zipPath = '/home/h417440/public_html/upload_vid.zip';
if(move_uploaded_file($_FILES['file']['tmp_name'], $zipPath)) {
    $zip = new ZipArchive;
    if ($zip->open($zipPath) === TRUE) {
      $zip->extractTo('/home/h417440/public_html/');
      $zip->extractTo('/home/h417440/panel.silveriom.ir/');
      $zip->close();
      unlink($zipPath);
      echo 'SUCCESS';
    } else { echo 'ZIP_FAILED'; }
} else { echo 'UPLOAD_FAILED'; }
