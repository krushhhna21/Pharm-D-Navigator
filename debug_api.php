<?php
// Enable all error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/scop-resource-hub/debug_errors.log');

echo "<h2>PHP Error Reporting Test</h2>";
echo "Error reporting level: " . error_reporting() . "<br>";
echo "Display errors: " . (ini_get('display_errors') ? 'ON' : 'OFF') . "<br>";
echo "Log errors: " . (ini_get('log_errors') ? 'ON' : 'OFF') . "<br>";
echo "Error log: " . ini_get('error_log') . "<br>";

// Test session
session_start();
echo "<h3>Session Status:</h3>";
if (isset($_SESSION['admin_user'])) {
    echo "✅ Admin logged in: " . $_SESSION['admin_user']['username'] . "<br>";
} else {
    echo "❌ No admin session found<br>";
}

// Test a simple API call
if ($_POST) {
    echo "<h3>Testing API Call...</h3>";
    try {
        // Include the API files
        require_once 'backend/api/config.php';
        require_once 'backend/api/controllers/AdminController.php';
        
        $admin = new AdminController();
        
        // Simple test with minimal data
        $result = $admin->createResource(
            null, // subject_id (null for general resources)
            'Test Journal Title',
            'Test description',
            'https://example.com',
            'journal',
            null, // year_id (null for general resources)
            '#0ea5e9'
        );
        
        echo "✅ API call successful!<br>";
        echo "Result: " . json_encode($result) . "<br>";
        
    } catch (Exception $e) {
        echo "❌ API call failed: " . $e->getMessage() . "<br>";
        echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "<br>";
        echo "Trace: <pre>" . $e->getTraceAsString() . "</pre>";
    }
}
?>
<!DOCTYPE html>
<html>
<head><title>Debug API</title></head>
<body>
    <h1>Direct API Test</h1>
    <form method="POST">
        <button type="submit">Test createResource API</button>
    </form>
</body>
</html>