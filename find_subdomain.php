<?php
echo "Current dir: " . __DIR__ . "\n";
echo "Contents of ../:\n";
print_r(scandir(__DIR__ . '/..'));
