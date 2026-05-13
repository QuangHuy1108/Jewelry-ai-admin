import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    discount: '',
    minSpend: '',
    maxUses: '',
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(list);
    });
    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      code: '',
      title: '',
      discount: '',
      minSpend: '',
      maxUses: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      code: item.code || '',
      title: item.title || '',
      discount: item.discount || '',
      minSpend: item.minSpend || '',
      maxUses: item.maxUses || '',
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to revoke and delete this promo code?')) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
      } catch (err) {
        alert('Error deleting coupon: ' + err.message);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'coupons', id), { isActive: !currentStatus });
    } catch (err) {
      alert('Error updating coupon state: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        title: formData.title,
        discount: parseFloat(formData.discount) || 0,
        minSpend: parseFloat(formData.minSpend) || 0,
        maxUses: parseInt(formData.maxUses, 10) || 100,
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'coupons', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        payload.usedCount = 0;
        await addDoc(collection(db, 'coupons'), payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving coupon: ' + err.message);
    }
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">Coupons & Offers</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Issue vouchers, control discount percentages, and establish usage constraints</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Campaign Tagline</th>
              <th>Discount Value</th>
              <th>Min Spend</th>
              <th>Redemptions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No promotional vouchers configured. Click "Create Coupon" to begin.
                </td>
              </tr>
            ) : (
              coupons.map(c => {
                const used = c.usedCount || 0;
                const max = c.maxUses || '∞';
                const isCapped = typeof c.maxUses === 'number' && used >= c.maxUses;

                return (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary)', padding: '4px 10px', borderRadius: '6px', border: '1px dashed var(--gold-primary)' }}>
                        {c.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                      {c.title || 'General Offer'}
                    </td>
                    <td>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                        {c.discount <= 100 ? `${c.discount}% OFF` : `$${c.discount} OFF`}
                      </span>
                    </td>
                    <td>
                      ${parseFloat(c.minSpend || 0).toFixed(2)}
                    </td>
                    <td>
                      <span style={{ color: isCapped ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                        {used} / {max}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleToggleActive(c.id, c.isActive)}
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          cursor: 'pointer',
                          padding: 0 
                        }}
                      >
                        <span className={`badge ${c.isActive !== false && !isCapped ? 'badge-success' : 'badge-danger'}`}>
                          {c.isActive !== false && !isCapped ? 'Active' : (isCapped ? 'Capped Out' : 'Expired')}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => openEditModal(c)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(c.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit Promo Code' : 'Issue New Coupon'}</h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Coupon Code *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. GLOWUP20" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Discount Value (%) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    placeholder="20" 
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Campaign Tagline / Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. VIP Welcome Special Offer" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Minimum Order Threshold ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    placeholder="100" 
                    value={formData.minSpend}
                    onChange={e => setFormData({...formData, minSpend: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Maximum Redemptions Cap</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="100" 
                    value={formData.maxUses}
                    onChange={e => setFormData({...formData, maxUses: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span style={{ fontSize: '0.95rem' }}>Active Redeemable State</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Issue Code'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
