#!/bin/bash

# SCOP Resource Hub - Quick Setup Script
# This script helps set up the project for development

echo "🚀 SCOP Resource Hub - Quick Setup"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "schema.sql" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Setup Options:"
echo "1. Local development (XAMPP)"  
echo "2. Hosting deployment"
echo "3. Create admin user"
echo "4. Set file permissions"

read -p "Select option (1-4): " option

case $option in
    1)
        echo "🔧 Setting up for local development..."
        if [ -f "backend/api/config.local.php" ]; then
            cp backend/api/config.local.php backend/api/config.php
            echo "✅ Local config copied"
        else
            echo "❌ config.local.php not found"
        fi
        ;;
    2)
        echo "🌐 Setting up for hosting..."
        if [ -f "backend/api/config.hosting.php" ]; then
            cp backend/api/config.hosting.php backend/api/config.php
            echo "✅ Hosting config copied"
            echo "⚠️  Don't forget to update database credentials in config.php"
        else
            echo "❌ config.hosting.php not found"
        fi
        ;;
    3)
        echo "👤 Creating admin user..."
        read -p "Enter admin username (default: admin): " username
        username=${username:-admin}
        
        read -s -p "Enter admin password: " password
        echo ""
        
        if command -v php &> /dev/null; then
            php -r "
            require_once 'backend/api/db.php';
            \$hash = password_hash('$password', PASSWORD_BCRYPT);
            \$stmt = \$pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)');
            \$stmt->execute(['$username', \$hash]);
            echo '✅ Admin user created successfully\n';
            "
        else
            echo "❌ PHP not found in PATH. Please create admin user manually."
        fi
        ;;
    4)
        echo "📁 Setting file permissions..."
        if [ -d "backend/uploads" ]; then
            chmod 755 backend/uploads
            chmod 644 backend/api/config.php 2>/dev/null || true
            echo "✅ Permissions set"
        else
            echo "❌ Upload directory not found"
        fi
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📖 Next steps:"
echo "- For local: http://localhost/Pharm-D-Navigator/public/index.html" 
echo "- Admin: http://localhost/Pharm-D-Navigator/public/admin-login.html"
echo "- Documentation: README.md and DEPLOYMENT.md"
echo ""
echo "🔐 Default admin credentials: admin / admin123 (change immediately!)"