# Contributing to SCOP Resource Hub

Thank you for your interest in contributing to the SCOP Resource Hub! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Provide detailed information about the issue
- Include steps to reproduce the problem
- Mention your environment (PHP version, MySQL version, browser, etc.)

### Feature Requests
- Open an issue to discuss new features
- Explain the use case and benefit to students/administrators
- Consider the impact on the existing system

### Code Contributions

1. **Fork the repository**
   ```bash
   git fork https://github.com/krushhhna21/Pharm-D-Navigator.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Test your changes locally
   - Ensure database compatibility

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## 📝 Development Guidelines

### Code Style
- **PHP**: Follow PSR-12 coding standards
- **JavaScript**: Use consistent indentation (2 spaces)
- **HTML/CSS**: Use semantic markup and BEM methodology where applicable

### Database Changes
- Always provide migration scripts
- Test with existing data
- Document schema changes in comments

### Security Considerations
- Sanitize all user inputs
- Use prepared statements for SQL queries
- Validate file uploads properly
- Implement proper authentication checks

### Testing
- Test all changes in both local and hosting environments
- Verify admin dashboard functionality
- Check student view compatibility
- Test file upload and download features

## 🏗️ Project Structure

```
scop-resource-hub/
├── public/                 # Frontend files
│   ├── index.html         # Student portal
│   ├── admin-login.html   # Admin login
│   ├── admin-dashboard.html # Admin panel
│   └── assets/            # CSS, JS, images
├── backend/               # Backend files
│   ├── api/              # PHP API endpoints
│   └── uploads/          # File storage
├── schema.sql            # Database schema
├── updates.sql           # Schema updates
└── README.md             # Documentation
```

## 🐛 Bug Reports

Include the following information:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: PHP version, MySQL version, browser
- **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features:
- **Use Case**: Explain why this feature is needed
- **User Story**: Describe from user perspective
- **Implementation Ideas**: Suggest how it might work
- **Priority**: Indicate importance level

## 🔍 Review Process

All contributions will be reviewed for:
- **Functionality**: Does it work as intended?
- **Security**: Are there any security concerns?
- **Performance**: Does it impact system performance?
- **Compatibility**: Works with existing features?
- **Documentation**: Is it properly documented?

## 📞 Contact

For questions about contributing:
- Open a GitHub issue for technical questions
- Contact the maintainers for general inquiries

## 🙏 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation where appropriate

Thank you for helping make SCOP Resource Hub better for everyone! 🎓