<?php
$target = '../panel.silveriom.ir/test.txt';
file_put_contents($target, 'Hello Subdomain');
if(file_exists($target)){
    echo "SUCCESS_WRITE\n";
    echo file_get_contents($target);
} else {
    echo "FAIL_WRITE\n";
}
?>
