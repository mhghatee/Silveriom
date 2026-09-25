<?php
echo "Searching for silveriom_db.json backups...\n";
$cmd = "find /home/h417440/ -name '*silveriom_db*' -type f -exec ls -la {} + 2>/dev/null";
echo shell_exec($cmd);
?>
