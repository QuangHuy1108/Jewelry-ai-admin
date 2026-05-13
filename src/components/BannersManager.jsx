import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: 'discount',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(list);
    });
    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      imageUrl: '',
      link: 'discount',
      order: banners.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      imageUrl: item.imageUrl || item.image || '',
      link: item.link || 'discount',
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      try {
        await deleteDoc(doc(db, 'banners', id));
      } catch (err) {
        alert('Error deleting banner: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        imageUrl: formData.imageUrl,
        image: formData.imageUrl, // backward compatibility
        link: formData.link,
        order: parseInt(formData.order, 10) || 0,
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'banners', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'banners'), payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving banner: ' + err.message);
    }
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">Promotional Banners</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Configure carousel banners displayed on the home feed header</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Create Banner</span>
        </button>
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Banner Visual Preview</th>
              <th>Title / Campaign</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No active banners configured. Click "Create Banner" to start.
                </td>
              </tr>
            ) : (
              banners.map((b, idx) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--gold-primary)' }}>#{b.order || idx + 1}</td>
                  <td>
                    {b.imageUrl || b.image ? (
                      <img 
                        src={b.imageUrl || b.image} 
                        alt={b.title} 
                        style={{ width: '180px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                      />
                    ) : (
                      <div style={{ width: '180px', height: '80px', background: '#27272a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Placeholder
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{b.title || 'Untitled Offer'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '4px' }}>Target Action: {b.link || 'Catalog'}</div>
                  </td>
                  <td>
                    <span className={`badge ${b.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                      {b.isActive !== false ? 'Live Carousel' : 'Archived'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => openEditModal(b)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(b.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit Promotional Banner' : 'Create New Banner'}</h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Campaign Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. 20% OFF Valentine Collection" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="https://example.com/banner.jpg" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Recommended resolution: 1200x500 pixels for rich fidelity display.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Link/Target Action</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. discount, category, catalog" 
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Priority Order</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={formData.order}
                  onChange={e => setFormData({...formData, order: e.target.value})}
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span style={{ fontSize: '0.95rem' }}>Active & Visible in Mobile App</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Publish Banner'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
