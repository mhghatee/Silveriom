<?php echo md5(file_get_contents('/home/h417440/panel.silveriom.ir/auth.js')) . " " . md5(file_get_contents('/home/h417440/public_html/panel/auth.js')); EOF
zip -r test_auth.zip test_auth.php
curl -s -X POST -F "file=@test_auth.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/test_auth.php"