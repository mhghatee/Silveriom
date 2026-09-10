<?php echo file_get_contents('/home/h417440/panel.silveriom.ir/api.php'); EOF
zip -r read_api_err.zip read_api_err.php
curl -s -X POST -F "file=@read_api_err.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/read_api_err.php"