<?php
function rrmdir($dir) { 
  if (is_dir($dir)) { 
    $objects = scandir($dir);
    foreach ($objects as $object) { 
      if ($object != "." && $object != "..") { 
        if (is_dir($dir. DIRECTORY_SEPARATOR .$object) && !is_link($dir."/".$object))
          rrmdir($dir. DIRECTORY_SEPARATOR .$object);
        else
          unlink($dir. DIRECTORY_SEPARATOR .$object); 
      } 
    }
    rmdir($dir); 
  } 
}
rrmdir('/home/h417440/panel.silveriom.ir/assets');
symlink('/home/h417440/public_html/assets', '/home/h417440/panel.silveriom.ir/assets');
echo "Deleted copied assets and created symlink.";
