<?php echo ini_get('upload_max_filesize') . " " . ini_get('post_max_size'); EOF
zip -r test_ini.zip test_ini.php
curl -s -X POST -F "file=@test_ini.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/test_ini.php"