import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify admin status
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      
      if (adminDoc.exists()) {
        onLoginSuccess(user);
      } else if (user.email === 'huyadmin@gmail.com') {
        // Auto-heal: If this specific email logs in but doesn't have an admin doc (e.g. account was deleted and recreated), create it.
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          createdAt: new Date(),
          role: 'superadmin'
        });
        onLoginSuccess(user);
      } else {
        // Not an admin, sign out immediately
        await auth.signOut();
        setError('Access denied. This account does not have admin privileges.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-main)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <Lock size={32} color="var(--gold-primary)" />
        </div>

        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
          Admin Portal Access
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
          Please sign in with your administrator credentials to manage the platform.
        </p>

        {error && (
          <div style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            borderRadius: '8px',
            color: '#F44336',
            fontSize: '0.85rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '500' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-surface-hover)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-surface-hover)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--gold-primary)',
              color: '#000',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Verifying...' : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
