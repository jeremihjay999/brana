import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Admin routes that require authentication and admin role
const adminProtectedRoutes = [
  '/admin',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/customers',
  '/admin/promotions',
  '/admin/inventory',
  '/admin/users',
  '/admin/settings',
  '/admin/banners',
  '/admin/super-admin',
  '/admin/create-super-admin',
];

// Routes that should be accessible even without authentication
const publicRoutes = [
  '/admin/login',
  '/admin/signup',
  '/admin/simple-login',
  '/admin/simple-super-admin',
];

// Check if the path is a protected admin route
const isAdminProtectedRoute = (path: string) => {
  return adminProtectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

// Check if the path is a public route (login/signup)
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path === route);
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip non-admin routes and public admin routes (login/signup)
  if (!path.startsWith('/admin') || isPublicRoute(path)) {
    return NextResponse.next();
  }
  
  // Check for authentication token in cookies
  const token = request.cookies.get('adminToken')?.value;
  
  // If no token and trying to access protected route, redirect to login
  if (!token && isAdminProtectedRoute(path)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  if (token && isAdminProtectedRoute(path)) {
    try {
      // Verify the token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-admin-secret-key'
      );
      
      const { payload } = await jwtVerify(token, secret);
      
      // Check if user has admin or super_admin role
      if (payload.role !== 'admin' && payload.role !== 'super_admin') {
        // Non-admin users are redirected to login with access denied message
        return NextResponse.redirect(
          new URL('/admin/login?error=access_denied', request.url)
        );
      }
      
      // If token is valid and user is admin, continue
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      console.error('Invalid token:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // For all other cases, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', // Match all routes starting with /admin
  ],
}; 