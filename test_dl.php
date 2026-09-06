<?php
$url = "https://raw.githubusercontent.com/mhghatee/silveriom/main/favicon.png?v=9999";
$c = file_get_contents($url);
if ($c === FALSE) {
    echo "FAILED";
} else {
    echo "SUCCESS " . strlen($c);
}
?>
