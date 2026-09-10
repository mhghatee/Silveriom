<?php
if (in_array('sqlite', PDO::getAvailableDrivers())) {
    echo "SQLITE_ENABLED\n";
} else {
    echo "SQLITE_DISABLED\n";
}
?>
