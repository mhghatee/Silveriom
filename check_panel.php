<?php echo file_get_contents('/home/h417440/public_html/panel/auth.js'); EOF
zip -r check_panel.zip check_panel.php
curl -s -X POST -F "file=@check_panel.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/check_panel.php" | grep "const data = { success: true"