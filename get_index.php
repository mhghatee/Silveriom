<?php echo file_get_contents('/home/h417440/public_html/panel/index.html'); EOF
zip -r get_index.zip get_index.php
curl -s -X POST -F "file=@get_index.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/get_index.php" | head -n 20