@echo off
REM SCOP Resource Hub - Quick Setup Script for Windows
REM This script helps set up the project for development

echo 🚀 SCOP Resource Hub - Quick Setup
echo ====================================

REM Check if we're in the right directory
if not exist "schema.sql" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📋 Setup Options:
echo 1. Local development (XAMPP)
echo 2. Hosting deployment  
echo 3. Create admin user
echo 4. Set file permissions

set /p option="Select option (1-4): "

if "%option%"=="1" (
    echo 🔧 Setting up for local development...
    if exist "backend\api\config.local.php" (
        copy "backend\api\config.local.php" "backend\api\config.php" >nul
        echo ✅ Local config copied
    ) else (
        echo ❌ config.local.php not found
    )
)

if "%option%"=="2" (
    echo 🌐 Setting up for hosting...
    if exist "backend\api\config.hosting.php" (
        copy "backend\api\config.hosting.php" "backend\api\config.php" >nul
        echo ✅ Hosting config copied
        echo ⚠️ Don't forget to update database credentials in config.php
    ) else (
        echo ❌ config.hosting.php not found
    )
)

if "%option%"=="3" (
    echo 👤 Creating admin user...
    set /p username="Enter admin username (default: admin): "
    if "%username%"=="" set username=admin
    
    set /p password="Enter admin password: "
    
    where php >nul 2>nul
    if %errorlevel%==0 (
        php -r "require_once 'backend/api/db.php'; $hash = password_hash('%password%', PASSWORD_BCRYPT); $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'); $stmt->execute(['%username%', $hash]); echo '✅ Admin user created successfully\n';"
    ) else (
        echo ❌ PHP not found in PATH. Please create admin user manually.
    )
)

if "%option%"=="4" (
    echo 📁 Setting file permissions...
    if exist "backend\uploads" (
        icacls "backend\uploads" /grant "Users:(OI)(CI)F" >nul 2>nul
        echo ✅ Permissions set
    ) else (
        echo ❌ Upload directory not found
    )
)

if not "%option%"=="1" if not "%option%"=="2" if not "%option%"=="3" if not "%option%"=="4" (
    echo ❌ Invalid option
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete!
echo.
echo 📖 Next steps:
echo - For local: http://localhost/Pharm-D-Navigator/public/index.html
echo - Admin: http://localhost/Pharm-D-Navigator/public/admin-login.html  
echo - Documentation: README.md and DEPLOYMENT.md
echo.
echo 🔐 Default admin credentials: admin / admin123 (change immediately!)

pause