<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Debug Resource Upload</h2>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<h3>POST Data:</h3>";
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    
    echo "<h3>FILES Data:</h3>";
    echo "<pre>";
    print_r($_FILES);
    echo "</pre>";
    
    // Test database connection
    try {
        $config = include 'backend/api/config.local.php';
        $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        echo "<h3>Database Connection: ✅ Success</h3>";
        
        // Test session
        session_start();
        echo "<h3>Session Data:</h3>";
        echo "<pre>";
        print_r($_SESSION);
        echo "</pre>";
        
    } catch (Exception $e) {
        echo "<h3>Database Connection: ❌ Failed</h3>";
        echo "<p>Error: " . $e->getMessage() . "</p>";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Debug Upload</title>
</head>
<body>
    <h1>Test Resource Upload</h1>
    <form method="POST" enctype="multipart/form-data">
        <p>
            <label>Title:</label><br>
            <input type="text" name="title" value="Test Journal" required>
        </p>
        <p>
            <label>Resource Type:</label><br>
            <select name="resource_type">
                <option value="journal">Journal</option>
                <option value="publication">Publication</option>
                <option value="career">Career</option>
            </select>
        </p>
        <p>
            <label>Description:</label><br>
            <textarea name="description">Test description</textarea>
        </p>
        <p>
            <label>External URL:</label><br>
            <input type="url" name="external_url" value="https://example.com">
        </p>
        <p>
            <label>File:</label><br>
            <input type="file" name="file">
        </p>
        <p>
            <label>Thumbnail:</label><br>
            <input type="file" name="thumbnail">
        </p>
        <input type="hidden" name="action" value="admin_create_resource">
        <input type="hidden" name="card_color" value="#0ea5e9">
        <p>
            <button type="submit">Test Upload</button>
        </p>
    </form>
</body>
</html>