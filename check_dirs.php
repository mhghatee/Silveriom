<?php
echo "=== PUBLIC_HTML ===\n";
$dirs = glob('*', GLOB_ONLYDIR);
print_r($dirs);
echo "\n=== ROOT ===\n";
$dirs2 = glob('../*', GLOB_ONLYDIR);
print_r($dirs2);
?>
