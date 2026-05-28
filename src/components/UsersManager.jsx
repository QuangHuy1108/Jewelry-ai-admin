import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { User, Mail, Calendar, DollarSign, Shield, ShieldAlert, Search, Phone } from 'lucide-react';

const translations = {
  en: {
    title: "User Base & Customer Records",
    subtitle: "Review registered user accounts, wallet holdings, and role delegations",
    searchPlaceholder: "Search accounts by name or email address...",
    thCustomer: "Customer",
    thEmail: "Email Address",
    thPhone: "Phone",
    thRegistered: "Registered",
    thRole: "Role",
    thStatus: "Status",
    noUsers: "No users recorded matching search pattern.",
    anonymousUser: "Anonymous User",
    unregistered: "Unregistered OAuth",
    activeSession: "Active Session",
    administrator: "Administrator",
    customer: "Customer",
    online: "● Online",
    offline: "○ Offline",
    offlineSeen: "○ Offline · "
  },
  vi: {
    title: "Danh Sách Khách Hàng",
    subtitle: "Xem thông tin tài khoản người dùng, số dư ví và phân quyền hệ thống",
    searchPlaceholder: "Tìm kiếm tài khoản theo tên hoặc địa chỉ email...",
    thCustomer: "Khách hàng",
    thEmail: "Địa chỉ email",
    thPhone: "Số điện thoại",
    thRegistered: "Ngày đăng ký",
    thRole: "Vai trò",
    thStatus: "Trạng thái",
    noUsers: "Không tìm thấy người dùng nào khớp với từ khóa tìm kiếm.",
    anonymousUser: "Khách hàng ẩn danh",
    unregistered: "Đăng nhập OAuth",
    activeSession: "Đang hoạt động",
    administrator: "Quản trị viên",
    customer: "Khách hàng",
    online: "● Trực tuyến",
    offline: "○ Ngoại tuyến",
    offlineSeen: "○ Ngoại tuyến · "
  }
};

export default function UsersManager({ locale = 'en' }) {
  const t = translations[locale] || translations.en;

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
          <h1 className="page-title">{t.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{t.subtitle}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
        />
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>{t.thCustomer}</th>
              <th>{t.thEmail}</th>
              <th>{t.thPhone}</th>
              <th>{t.thRegistered}</th>
              <th>{t.thRole}</th>
              <th>{t.thStatus}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  {t.noUsers}
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const isAdmin = !!admins[u.id];
                const dateStr = u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : t.activeSession;

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                          {u.avatar || u.photoURL || u.image ? (
                            <img src={u.avatar || u.photoURL || u.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <User size={18} color="var(--gold-primary)" />
                            </div>
                          )}
                          {/* Online indicator dot */}
                          <span style={{
                            position: 'absolute', bottom: '0', right: '0',
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: u.isOnline ? '#22c55e' : '#6b7280',
                            border: '2px solid var(--bg-surface)',
                          }} />
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{u.displayName || u.name || t.anonymousUser}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Mail size={14} />
                        <span>{u.email || t.unregistered}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Phone size={14} />
                        <span>{u.phone || u.phoneNumber || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Calendar size={14} />
                        <span>{dateStr}</span>
                      </div>
                    </td>
                    <td>
                      {isAdmin ? (
                        <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)' }}>
                          <Shield size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />{t.administrator}
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}>
                          {t.customer}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${u.isOnline ? 'badge-success' : ''}`} style={u.isOnline ? {} : { background: 'var(--bg-surface-hover)', color: 'var(--text-muted)' }}>
                        {u.isOnline ? t.online : `${t.offline}${u.lastSeen?.toDate ? ' · ' + u.lastSeen.toDate().toLocaleDateString() : ''}`}
                      </span>
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
