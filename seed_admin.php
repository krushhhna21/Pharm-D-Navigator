<?php
// seed_admin.php - one-time setup to create an admin user
// Delete this file after creating your first admin.
header('Content-Type: text/html; charset=utf-8');
require __DIR__ . '/backend/api/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim($_POST['username'] ?? '');
  $password = $_POST['password'] ?? '';
  if (!$username || !$password) {
    echo "<p>Username and password are required.</p>";
  } else {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    try {
      $stmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
      $stmt->execute([$username, $hash]);
      echo "<p>Admin user <strong>".htmlspecialchars($username)."</strong> created. You can now <a href='public/admin-login.html'>login here</a>.</p>";
      exit;
    } catch (Exception $e) {
      echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
  }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Seed Admin - SCOP Resource Hub</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; }
    form { max-width: 420px; padding: 1rem; border: 1px solid #ddd; border-radius: 12px; }
    label { display: block; margin-top: 0.75rem; }
    input[type=text], input[type=password] { width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 8px; }
    button { margin-top: 1rem; padding: 0.6rem 1rem; border-radius: 8px; border: none; background: #0a7; color: #fff; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Seed Admin</h1>
  <p>Create the first admin account. <strong>Delete this file after use.</strong></p>
  <form method="post">
    <label>Username</label>
    <input name="username" type="text" required>
    <label>Password</label>
    <input name="password" type="password" required>
    <button type="submit">Create Admin</button>
  </form>
</body>
</html>
