import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Store, Search, CheckCircle, XCircle, Clock, ExternalLink, CreditCard, Phone, Mail, User, Link2, Hash } from 'lucide-react';

export default function SellerApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Wait for auth to be ready, then subscribe to real-time updates
    let unsubFirestore = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // Subscribe regardless of auth (rules allow public read)
      unsubFirestore = onSnapshot(
        collection(db, 'seller_applications'),
        (snapshot) => {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => {
            const at = a.createdAt?.toDate?.() || new Date(0);
            const bt = b.createdAt?.toDate?.() || new Date(0);
            return bt - at;
          });
          setApplications(list);
        },
        (error) => {
          console.error('Seller applications listener error:', error);
        }
      );
    });
    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const filtered = applications.filter(app => {
    const matchSearch = `${app.fullName || ''} ${app.email || ''} ${app.referralCode || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || app.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const handleApprove = async (app) => {
    setProcessing(true);
    try {
      await updateDoc(doc(db, 'seller_applications', app.id), {
        status: 'approved',
        rejectionReason: '',
        reviewedAt: Timestamp.now(),
        reviewedBy: 'admin',
      });
      setSelectedApp(null);
    } catch (e) {
      alert('Failed to approve: ' + e.message);
    }
    setProcessing(false);
  };

  const handleReject = async (app) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    setProcessing(true);
    try {
      await updateDoc(doc(db, 'seller_applications', app.id), {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        reviewedAt: Timestamp.now(),
        reviewedBy: 'admin',
      });
      setSelectedApp(null);
      setRejectionReason('');
    } catch (e) {
      alert('Failed to reject: ' + e.message);
    }
    setProcessing(false);
  };

  const statusBadge = (status) => {
    const config = {
      pending: { bg: 'rgba(255,152,0,0.12)', color: '#FF9800', label: 'Pending Review', Icon: Clock },
      approved: { bg: 'rgba(76,175,80,0.12)', color: '#4CAF50', label: 'Approved', Icon: CheckCircle },
      rejected: { bg: 'rgba(244,67,54,0.12)', color: '#F44336', label: 'Rejected', Icon: XCircle },
    };
    const c = config[status] || config.pending;
    return (
      <span className="badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}40`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <c.Icon size={12} /> {c.label}
      </span>
    );
  };

  const formatDate = (ts) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">Seller Applications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Review and manage seller partnership requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { key: 'all', label: 'Total', color: 'var(--text-primary)', icon: Store },
          { key: 'pending', label: 'Pending', color: '#FF9800', icon: Clock },
          { key: 'approved', label: 'Approved', color: '#4CAF50', icon: CheckCircle },
          { key: 'rejected', label: 'Rejected', color: '#F44336', icon: XCircle },
        ].map(s => (
          <div key={s.key}
            className="glass-panel"
            onClick={() => setFilter(s.key)}
            style={{ padding: '16px 20px', cursor: 'pointer', border: filter === s.key ? `2px solid ${s.color}` : '1px solid transparent', transition: 'all .2s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '1.6rem', fontWeight: '700', color: s.color }}>{counts[s.key]}</p>
              </div>
              <s.icon size={24} color={s.color} style={{ opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="glass-panel" style={{ padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by name, email, or referral code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Platform</th>
              <th>Referral Code</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No applications found.
                </td>
              </tr>
            ) : (
              filtered.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {app.avatarUrl ? (
                        <img src={app.avatarUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="var(--gold-primary)" />
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{app.fullName || 'Unknown'}</span>
                        <br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}>
                      {app.mainPlatform || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: 'var(--gold-primary)', fontFamily: 'monospace' }}>
                      {app.referralCode || '—'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatDate(app.createdAt)}</td>
                  <td>{statusBadge(app.status)}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                      onClick={() => { setSelectedApp(app); setRejectionReason(''); }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '600px', maxHeight: '85vh', overflowY: 'auto', padding: '32px', position: 'relative' }}>
            <button
              onClick={() => setSelectedApp(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
            >✕</button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Application Review</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>{statusBadge(selectedApp.status)}</p>

            {/* Personal Info */}
            <SectionTitle icon={User} title="Personal Information" />
            <DetailRow icon={User} label="Full Name" value={selectedApp.fullName} />
            <DetailRow icon={Phone} label="Phone" value={selectedApp.phone} />
            <DetailRow icon={Mail} label="Email" value={selectedApp.email} />

            {/* Marketing */}
            <SectionTitle icon={Link2} title="Marketing Channels" />
            <DetailRow icon={Store} label="Platform" value={selectedApp.mainPlatform} />
            <DetailRow icon={ExternalLink} label="Channel Link" value={selectedApp.channelLink} isLink />
            <DetailRow icon={Hash} label="Referral Code" value={selectedApp.referralCode} highlight />

            {/* Payment */}
            <SectionTitle icon={CreditCard} title="Payment Details" />
            <DetailRow icon={CreditCard} label="Bank" value={selectedApp.bankName} />
            <DetailRow icon={CreditCard} label="Account #" value={selectedApp.accountNumber} />
            <DetailRow icon={User} label="Holder Name" value={selectedApp.accountHolderName} />

            {/* ID */}
            {(selectedApp.citizenId || selectedApp.taxId) && (
              <>
                <SectionTitle icon={User} title="Identification" />
                <DetailRow icon={User} label="Citizen ID" value={selectedApp.citizenId || '—'} />
                <DetailRow icon={Hash} label="Tax ID" value={selectedApp.taxId || '—'} />
              </>
            )}

            {/* Actions */}
            {selectedApp.status === 'pending' && (
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button
                    disabled={processing}
                    onClick={() => handleApprove(selectedApp)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: '#4CAF50', color: '#fff', fontWeight: '600', fontSize: '0.95rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      opacity: processing ? 0.6 : 1,
                    }}
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    disabled={processing}
                    onClick={() => handleReject(selectedApp)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: '#F44336', color: '#fff', fontWeight: '600', fontSize: '0.95rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      opacity: processing ? 0.6 : 1,
                    }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
                <textarea
                  placeholder="Rejection reason (required to reject)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.9rem',
                    border: '1px solid var(--border-glass)', background: 'var(--bg-surface-hover)',
                    color: 'var(--text-primary)', resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {selectedApp.status === 'rejected' && selectedApp.rejectionReason && (
              <div style={{ marginTop: '20px', padding: '14px', borderRadius: '10px', background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)' }}>
                <p style={{ fontSize: '0.8rem', color: '#F44336', fontWeight: '600', marginBottom: '4px' }}>Rejection Reason</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedApp.rejectionReason}</p>
              </div>
            )}

            {selectedApp.status !== 'pending' && (
              <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Reviewed on {formatDate(selectedApp.reviewedAt)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', marginBottom: '12px' }}>
      <Icon size={16} color="var(--gold-primary)" />
      <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, isLink, highlight }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', paddingLeft: '4px' }}>
      <Icon size={14} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', width: '100px', flexShrink: 0 }}>{label}</span>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
          {value} <ExternalLink size={12} style={{ display: 'inline', verticalAlign: '-1px' }} />
        </a>
      ) : (
        <span style={{
          fontSize: '0.9rem', fontWeight: highlight ? '700' : '500',
          color: highlight ? 'var(--gold-primary)' : 'var(--text-primary)',
          fontFamily: highlight ? 'monospace' : 'inherit',
        }}>
          {value || '—'}
        </span>
      )}
    </div>
  );
}
