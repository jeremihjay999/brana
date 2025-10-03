# BRANA KIDS Super Admin Setup Guide

## Overview
This guide explains how to set up and use the super admin system for the BRANA KIDS e-commerce platform.

## Super Admin Features

### 🔐 **Role Hierarchy**
- **Super Admin**: Full system access with all permissions
- **Admin**: Administrative access with most permissions
- **Manager**: Management access for content and operations
- **User**: Basic user access with limited permissions

### 🛡️ **Super Admin Permissions**
- Manage all users (create, edit, delete, assign roles)
- Manage all products, categories, orders, customers
- Access system settings and analytics
- Manage other administrators
- Full database access
- System configuration

## Setup Instructions

### 1. Create Super Admin Account

#### Option A: Using the Web Interface
1. Navigate to `/admin/create-super-admin`
2. Enter the secret key: `BRANA_KIDS_SUPER_ADMIN_2024`
3. Click "Create Super Admin"
4. Note the generated credentials

#### Option B: Using the API
```bash
curl -X POST http://localhost:3000/api/admin/create-super-admin \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "BRANA_KIDS_SUPER_ADMIN_2024"}'
```

### 2. Default Super Admin Credentials
- **Email**: `superadmin@branakids.co.ke`
- **Password**: `SuperAdmin123!`

⚠️ **Important**: Change the default password immediately after first login!

### 3. Access Super Admin Dashboard
1. Go to `/admin/login`
2. Login with super admin credentials
3. Navigate to "Super Admin" in the sidebar
4. Access the comprehensive dashboard

## Super Admin Dashboard Features

### 📊 **System Overview**
- Total users count and role distribution
- Active/pending user statistics
- System uptime and status
- Recent activity log

### 👥 **User Management**
- View all users with detailed information
- Create new users with specific roles
- Approve/reject pending users
- Assign/remove admin privileges
- Activate/deactivate user accounts

### 🔧 **System Administration**
- Role-based permission management
- System configuration
- Database management tools
- Security settings

## Role Management

### Creating New Users
1. Go to Users page
2. Click "Create New User"
3. Fill in user details
4. Select appropriate role
5. Set initial status

### Role Permissions

#### Super Admin
- All permissions
- Can create other super admins
- System-wide access

#### Admin
- Manage users, products, orders
- Access analytics and reports
- Cannot create super admins

#### Manager
- Manage products and content
- View analytics
- Limited user management

#### User
- Basic access only
- View analytics

## Security Best Practices

### 🔒 **Password Security**
- Use strong, unique passwords
- Enable two-factor authentication (if available)
- Regular password updates

### 🛡️ **Access Control**
- Limit super admin accounts
- Regular access audits
- Monitor user activities

### 🔍 **Monitoring**
- Review recent activity logs
- Monitor failed login attempts
- Track permission changes

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/logout` - Logout
- `POST /api/admin/auth/signup` - Register new user

### User Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Super Admin
- `POST /api/admin/create-super-admin` - Create super admin

## Troubleshooting

### Common Issues

#### Cannot Access Super Admin Dashboard
- Verify you're logged in as super admin
- Check role permissions
- Clear browser cache

#### User Creation Fails
- Verify required fields are filled
- Check email uniqueness
- Ensure proper permissions

#### Permission Denied Errors
- Verify user role has required permissions
- Check API authentication
- Review role hierarchy

### Support
For technical support or questions about the super admin system, contact the development team.

## File Structure

```
app/
├── admin/
│   ├── super-admin/
│   │   └── page.tsx          # Super admin dashboard
│   ├── create-super-admin/
│   │   └── page.tsx          # Super admin creation page
│   └── users/
│       └── page.tsx          # User management page
├── api/admin/
│   ├── create-super-admin/
│   │   └── route.ts          # Super admin creation API
│   └── users/
│       └── route.ts          # User management API
lib/
└── permissions.ts            # Role and permission definitions
scripts/
└── create-super-admin.js     # Super admin creation script
```

## Security Notes

- The super admin creation endpoint is protected by a secret key
- All API endpoints require proper authentication
- Role-based access control is enforced throughout the system
- Sensitive operations are logged for audit purposes

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: BRANA KIDS Development Team

