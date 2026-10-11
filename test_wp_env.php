<?php
// Test WordPress environment & MySQL on server
header('Content-Type: text/plain; charset=utf-8');

echo "=== SERVER INFO ===\n";
echo "PHP Version: " . phpversion() . "\n";
echo "User: " . get_current_user() . "\n";
echo "DocRoot: " . $_SERVER['DOCUMENT_ROOT'] . "\n";

echo "\n=== MYSQL CONNECTION TEST ===\n";
$user = "h417440";
$pass = "Mhhananeh@7479#";

// Test mysqli connection
$link = @mysqli_connect("localhost", $user, $pass);
if ($link) {
    echo "MySQL Connection: SUCCESS!\n";
    $res = mysqli_query($link, "SHOW DATABASES");
    echo "Databases:\n";
    while ($row = mysqli_fetch_array($res)) {
        echo " - " . $row[0] . "\n";
    }
    mysqli_close($link);
} else {
    echo "MySQL Direct Connect: FAILED (" . mysqli_connect_error() . ")\n";
}

echo "\n=== DIRECTORY WRITE TEST ===\n";
$wp_dir = $_SERVER['DOCUMENT_ROOT'] . '/wp';
if (!is_dir($wp_dir)) {
    if (@mkdir($wp_dir, 0755, true)) {
        echo "Created directory: $wp_dir (SUCCESS)\n";
    } else {
        echo "Failed to create directory: $wp_dir\n";
    }
} else {
    echo "Directory already exists: $wp_dir\n";
}

echo "\n=== EXEC / CLI TEST ===\n";
if (function_exists('exec')) {
    echo "exec() is ENABLED\n";
    $uapi_test = @exec('uapi SubDomain get_subdomains 2>&1');
    echo "uapi output: " . substr($uapi_test, 0, 100) . "\n";
} else {
    echo "exec() is DISABLED\n";
}
?>
