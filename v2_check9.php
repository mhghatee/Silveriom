<?php function search($dir) { foreach(scandir($dir) as $f) { if($f=="."||$f=="..") continue; $p="$dir/$f"; if(is_dir($p)) search($p); elseif($f=="api.php") echo "$p
"; } } search("/home/h417440"); ?>
