export type Permission = 
  | 'manage_users'
  | 'manage_products'
  | 'manage_categories'
  | 'manage_orders'
  | 'manage_customers'
  | 'manage_inventory'
  | 'manage_promotions'
  | 'manage_banners'
  | 'manage_settings'
  | 'view_analytics'
  | 'manage_admins'
  | 'system_settings'
  | 'view_reports'
  | 'manage_content'
  | 'manage_media';

export type Role = 'super_admin' | 'admin' | 'manager' | 'user';

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    permissions: [
      'manage_users',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_inventory',
      'manage_promotions',
      'manage_banners',
      'manage_settings',
      'view_analytics',
      'manage_admins',
      'system_settings',
      'view_reports',
      'manage_content',
      'manage_media'
    ],
    description: 'Full system access with all permissions'
  },
  admin: {
    role: 'admin',
    permissions: [
      'manage_users',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_inventory',
      'manage_promotions',
      'manage_banners',
      'view_analytics',
      'view_reports',
      'manage_content',
      'manage_media'
    ],
    description: 'Administrative access with most permissions'
  },
  manager: {
    role: 'manager',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_inventory',
      'manage_promotions',
      'manage_banners',
      'view_analytics',
      'view_reports',
      'manage_content',
      'manage_media'
    ],
    description: 'Management access for content and operations'
  },
  user: {
    role: 'user',
    permissions: [
      'view_analytics'
    ],
    description: 'Basic user access with limited permissions'
  }
};

export function hasPermission(userRole: Role, requiredPermission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.permissions.includes(requiredPermission);
}

export function hasAnyPermission(userRole: Role, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role]?.permissions || [];
}

export function canManageUsers(userRole: Role): boolean {
  return hasPermission(userRole, 'manage_users');
}

export function canManageAdmins(userRole: Role): boolean {
  return hasPermission(userRole, 'manage_admins');
}

export function isSuperAdmin(userRole: Role): boolean {
  return userRole === 'super_admin';
}

export function isAdminOrHigher(userRole: Role): boolean {
  return ['super_admin', 'admin'].includes(userRole);
}

export function isManagerOrHigher(userRole: Role): boolean {
  return ['super_admin', 'admin', 'manager'].includes(userRole);
}

