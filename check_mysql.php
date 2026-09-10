<?php
if (in_array('mysql', PDO::getAvailableDrivers())) {
    echo "MYSQL_ENABLED\n";
} else {
    echo "MYSQL_DISABLED\n";
}
?>
