<?php
$dest = realpath(__DIR__ . '/../panel.silveriom.ir') . '/api.php';
copy(__DIR__ . '/layered_api.php', $dest);
echo "Deployed to $dest\n";
?>
