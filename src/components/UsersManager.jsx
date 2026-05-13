import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { User, Mail, Calendar, DollarSign, Shield, ShieldAlert, Search } from 'lucide-react';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Listen to customers/users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(list);
    });

    // Listen to admins collection mapping
    const unsubscribeAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
      const adminMap = {};
      snapshot.forEach(doc => {
        adminMap[doc.id] = doc.data();
      });
      setAdmins(adminMap);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAdmins();
    };
  }, []);

  const filteredUsers = users.filter(u => {
    const searchStr = `${u.email || ''} ${u.displayName || ''} ${u.name || ''}`.toLowerCase();
    return searchStr.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">User Base & Customer Records</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Review registered user accounts, wallet holdings, and role delegations</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search accounts by name or email address..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
        />
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email Address</th>
              <th>Registered Timestamp</th>
              <th>Wallet Balance</th>
              <th>Role Privilege</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No users recorded matching search pattern.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const isAdmin = !!admins[u.id];
                const dateStr = u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'Active Session';
                const bal = u.walletBalance !== undefined ? u.walletBalance : (u.wallet || 0);

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {u.photoURL || u.image ? (
                          <img src={u.photoURL || u.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={18} color="var(--gold-primary)" />
                          </div>
                        )}
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{u.displayName || u.name || 'Anonymous User'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Mail size={14} />
                        <span>{u.email || 'Unregistered OAuth'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Calendar size={14} />
                        <span>{dateStr}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 'bold', color: bal > 0 ? 'var(--gold-primary)' : 'var(--text-primary)' }}>
                        ${parseFloat(bal).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      {isAdmin ? (
                        <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)' }}>
                          <Shield size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} /> Administrator
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}>
                          Customer
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-success">Verified Active</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
