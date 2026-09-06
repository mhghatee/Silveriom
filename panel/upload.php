<?php
// Fix the favicon and sync_all
file_put_contents("../favicon.png", file_get_contents("https://raw.githubusercontent.com/mhghatee/Silveriom/main/favicon.png"));
file_put_contents("../sync_all.php", file_get_contents("https://raw.githubusercontent.com/mhghatee/Silveriom/main/sync_all.php"));
echo "Fixed favicon and sync_all.php!";
?>
