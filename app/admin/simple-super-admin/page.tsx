'use client';

import { useState } from 'react';

export default function SimpleSuperAdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateSuperAdmin = async () => {
    if (!secretKey) {
      alert('Please enter the secret key');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/create-super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to create super admin');
      }
    } catch (err) {
      alert('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              margin: '0 auto 1rem', 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🛡️
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
              Create Super Admin
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Create the initial super administrator account for BRANA KIDS
            </p>
          </div>

          {result && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#16a34a', marginRight: '0.5rem' }}>✅</span>
                <strong style={{ color: '#166534' }}>{result.message}</strong>
              </div>
              {result.credentials && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  backgroundColor: 'white', 
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db'
                }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    Login Credentials:
                  </p>
                  <p style={{ fontSize: '0.875rem' }}>Email: {result.credentials.email}</p>
                  <p style={{ fontSize: '0.875rem' }}>Password: {result.credentials.password}</p>
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Secret Key
            </label>
            <input
              type="password"
              placeholder="Enter secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Contact system administrator for the secret key
            </p>
          </div>

          <button
            onClick={handleCreateSuperAdmin}
            disabled={loading || !secretKey}
            style={{
              width: '100%',
              backgroundColor: loading || !secretKey ? '#9ca3af' : '#22c55e',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading || !secretKey ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Super Admin'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              This action can only be performed once
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

