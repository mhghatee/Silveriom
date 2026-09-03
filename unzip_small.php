<?php
$zip = new ZipArchive;
$res = $zip->open('update_small.zip');
if ($res === TRUE) {
  $zip->extractTo('.');
  $zip->close();
  echo 'ok';
} else {
  echo 'failed';
}
?>
