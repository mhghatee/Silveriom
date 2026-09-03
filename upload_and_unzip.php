<?php
if(isset($_FILES['file'])) {
    $target_path = "./update_small.zip";
    if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
        $zip = new ZipArchive;
        $res = $zip->open('update_small.zip');
        if ($res === TRUE) {
          $zip->extractTo('.');
          $zip->close();
          unlink('update_small.zip');
          echo 'SUCCESS';
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
