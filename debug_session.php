<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Admin Session Debug</h2>";

echo "<h3>Session Data:</h3>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

// Check if admin is logged in
$logged_in = isset($_SESSION['admin_user']) && !empty($_SESSION['admin_user']);
echo "<h3>Admin Login Status: " . ($logged_in ? "✅ Logged In" : "❌ Not Logged In") . "</h3>";

if ($logged_in) {
    echo "<p>Admin User: " . $_SESSION['admin_user']['username'] . "</p>";
    echo "<p>Admin ID: " . $_SESSION['admin_user']['id'] . "</p>";
} else {
    echo "<p>No admin session found. Need to login first.</p>";
    echo "<a href='public/admin-login.html'>Go to Admin Login</a>";
}

// Test database connection and show admin users
try {
    $config = include 'backend/api/config.local.php';
    $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "<h3>Admin Users in Database:</h3>";
    $stmt = $pdo->query("SELECT id, username, email FROM users WHERE role = 'admin'");
    $admins = $stmt->fetchAll();
    echo "<pre>";
    print_r($admins);
    echo "</pre>";
    
} catch (Exception $e) {
    echo "<h3>Database Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>