'use client';

import { useState, useEffect } from 'react';

export default function TestSuperAdminPage() {
  const [loginResult, setLoginResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSuperAdminLogin = async () => {
    setLoading(true);
    setLoginResult(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'superadmin@gmail.com',
          password: 'superadmin123'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginResult({
          success: true,
          message: 'Super admin login successful!',
          data: {
            hasToken: !!data.token,
            userRole: data.user?.role,
            userEmail: data.user?.email,
            userName: data.user?.name
          }
        });

        // Store the token for testing
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('userInfo', JSON.stringify(data.user));
        }
      } else {
        setLoginResult({
          success: false,
          message: 'Login failed',
          error: data.error || 'Unknown error'
        });
      }
    } catch (error) {
      setLoginResult({
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testAdminAccess = async () => {
    try {
      const response = await fetch('/admin');
      const html = await response.text();
      
      if (html.includes('Admin Login')) {
        setLoginResult(prev => ({
          ...prev,
          adminAccess: 'Redirected to login (expected without token)'
        }));
      } else {
        setLoginResult(prev => ({
          ...prev,
          adminAccess: 'Access granted to admin dashboard'
        }));
      }
    } catch (error) {
      setLoginResult(prev => ({
        ...prev,
        adminAccess: 'Error testing admin access'
      }));
    }
  };

  useEffect(() => {
    // Auto-test on page load
    testSuperAdminLogin();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          Super Admin System Test
        </h1>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Test Results
          </h2>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.2rem' }}>Testing super admin login...</div>
            </div>
          )}

          {loginResult && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: loginResult.success ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${loginResult.success ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.5rem',
                color: loginResult.success ? '#166534' : '#dc2626'
              }}>
                <span style={{ marginRight: '0.5rem' }}>
                  {loginResult.success ? '✅' : '❌'}
                </span>
                <strong>{loginResult.message}</strong>
              </div>

              {loginResult.data && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  backgroundColor: 'white', 
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Login Details:
                  </h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    <div><strong>Has Token:</strong> {loginResult.data.hasToken ? 'Yes' : 'No'}</div>
                    <div><strong>User Role:</strong> {loginResult.data.userRole}</div>
                    <div><strong>User Email:</strong> {loginResult.data.userEmail}</div>
                    <div><strong>User Name:</strong> {loginResult.data.userName}</div>
                  </div>
                </div>
              )}

              {loginResult.error && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#fef2f2', 
                  borderRadius: '0.25rem',
                  border: '1px solid #fecaca',
                  color: '#dc2626'
                }}>
                  <strong>Error:</strong> {loginResult.error}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={testSuperAdminLogin}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#22c55e',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Testing...' : 'Test Super Admin Login'}
            </button>

            <button
              onClick={testAdminAccess}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Test Admin Access
            </button>

            <a
              href="/admin/login"
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              Go to Admin Login
            </a>
          </div>

          {loginResult?.adminAccess && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}>
              <strong>Admin Access Test:</strong> {loginResult.adminAccess}
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Super Admin Credentials
          </h3>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            <div><strong>Email:</strong> superadmin@gmail.com</div>
            <div><strong>Password:</strong> superadmin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

