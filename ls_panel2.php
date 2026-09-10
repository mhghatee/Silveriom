<?php echo json_encode(scandir('/home/h417440/panel.silveriom.ir/')); EOF
zip -r ls_panel2.zip ls_panel2.php
curl -s -X POST -F "file=@ls_panel2.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/ls_panel2.php"