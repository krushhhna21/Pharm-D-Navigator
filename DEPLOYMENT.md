# SCOP Resource Hub - Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Hosting account set up with database access
- [ ] Database credentials obtained
- [ ] File upload permissions configured

## 🚀 GitHub Repository Setup

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it `scop-resource-hub` (or your preferred name)
3. Set it as Public or Private based on your needs
4. Don't initialize with README (we already have one)

### 2. Push Your Code
```bash
# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/krushhhna21/Pharm-D-Navigator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Hosting Deployment

### Step 1: Upload Files
1. **Download/Clone** from GitHub to your local machine
2. **Upload all files** to your hosting account's public folder
3. **Ensure proper file structure**:
   ```
   public_html/
   ├── public/           # Frontend files
   ├── backend/          # PHP backend
   ├── schema.sql        # Database schema
   ├── updates.sql       # Schema updates
   └── ...other files
   ```

### Step 2: Database Setup
1. **Create MySQL database** through your hosting control panel
2. **Import schema.sql**:
   - Use phpMyAdmin or hosting database tools
   - Import `schema.sql` first
   - Then import `updates.sql`
3. **Verify tables created**:
   - Should have: users, years, subjects, resources, resource_views, pages

### Step 3: Configure Database Connection
1. **Copy hosting config**:
   ```bash
   cp backend/api/config.hosting.php backend/api/config.php
   ```
2. **Update credentials** in `backend/api/config.php`:
   ```php
   'db_host' => 'your-host.com',
   'db_name' => 'your-database-name',
   'db_user' => 'your-db-username',
   'db_pass' => 'your-db-password',
   ```

### Step 4: Create Admin User
1. **Access seed_admin.php** through browser:
   `https://yourdomain.com/seed_admin.php`
2. **Create admin account**:
   - Username: admin (or preferred)
   - Password: secure-password
3. **Delete seed_admin.php** after use for security

### Step 5: Set Permissions
1. **Upload directory**: Ensure `backend/uploads/` is writable (755 or 775)
2. **Config file**: Secure `backend/api/config.php` (644)
3. **API directory**: Ensure `backend/api/` is accessible

## 🔧 Configuration Options

### Environment-Specific Settings
- **Local Development**: Use `config.local.php`
- **Hosting Environment**: Use `config.hosting.php`
- **Custom Setup**: Modify `config.php` directly

### File Upload Limits
Adjust in `config.php`:
```php
'max_upload_bytes' => 26214400, // 25MB
'allowed_mime_types' => [...], // Supported file types
```

### Security Settings
1. **Change default admin password** immediately
2. **Use HTTPS** in production
3. **Restrict database access** to necessary IPs only
4. **Regular backups** of database and uploaded files

## 🧪 Testing Deployment

### 1. Test Student Portal
- Visit: `https://yourdomain.com/public/index.html`
- Check: Year selection works
- Check: Subject browsing works
- Check: Resource loading works

### 2. Test Admin Dashboard
- Visit: `https://yourdomain.com/public/admin-login.html`
- Login with created credentials
- Check: Dashboard loads properly
- Check: All sections accessible
- Test: File upload functionality

### 3. Test API Endpoints
- Check: `/backend/api/index.php?action=list_years`
- Check: `/backend/api/index.php?action=list_subjects&year_id=1`
- Verify: JSON responses are properly formatted

## 🔄 Updates and Maintenance

### Pushing Updates
1. **Make changes locally**
2. **Test thoroughly**
3. **Commit to git**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Deploy to hosting** via FTP/file manager

### Database Updates
1. **Create migration scripts** for schema changes
2. **Test on staging** environment first
3. **Backup production database** before applying
4. **Apply updates** through phpMyAdmin or scripts

### Backup Strategy
- **Weekly database backups**
- **Monthly full file backups**
- **Store backups** in multiple locations
- **Test backup restoration** periodically

## 🔒 Security Best Practices

### Production Checklist
- [ ] Change default admin credentials
- [ ] Remove/secure seed_admin.php
- [ ] Enable HTTPS
- [ ] Configure proper file permissions
- [ ] Set up regular backups
- [ ] Monitor access logs
- [ ] Keep PHP/MySQL updated

### Monitoring
- **Check error logs** regularly
- **Monitor disk usage** (uploads folder)
- **Review access patterns**
- **Update dependencies** as needed

## 🆘 Troubleshooting

### Common Issues
1. **Database connection errors**:
   - Check credentials in config.php
   - Verify database server is accessible
   - Ensure database exists and has proper permissions

2. **File upload failures**:
   - Check upload directory permissions
   - Verify file size limits
   - Confirm MIME type restrictions

3. **Admin login issues**:
   - Verify admin user exists in database
   - Check password hash format
   - Ensure session handling is working

### Debug Mode
Add to `backend/api/routes.php` for debugging (remove in production):
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## 📞 Support

For deployment assistance:
1. **Check documentation** first
2. **Review GitHub issues** for similar problems
3. **Create new issue** with detailed information
4. **Contact maintainers** if needed

---

**Remember**: Always test in a staging environment before deploying to production!