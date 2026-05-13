import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    category: 'Rings',
    description: '',
    material: '18K Yellow Gold',
    stock: '10',
    images: '',
    sizes: '6, 7, 8',
    isBestSeller: false,
    isPopular: false,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(list);
    });
    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      discountPrice: '',
      category: 'Rings',
      description: '',
      material: '18K Yellow Gold',
      stock: '10',
      images: '',
      sizes: '6, 7, 8',
      isBestSeller: false,
      isPopular: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      price: item.price || '',
      discountPrice: item.discountPrice || '',
      category: item.category || 'Rings',
      description: item.description || '',
      material: item.material || '18K Yellow Gold',
      stock: item.stock !== undefined ? item.stock : '10',
      images: Array.isArray(item.images) ? item.images.join(', ') : (item.image || ''),
      sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : (item.sizes || '6, 7, 8'),
      isBestSeller: !!item.isBestSeller,
      isPopular: !!item.isPopular,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const priceNum = parseFloat(formData.price) || 0;
      const discountNum = formData.discountPrice ? parseFloat(formData.discountPrice) : null;
      const stockNum = parseInt(formData.stock, 10) || 0;
      const imagesArr = formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [];
      const sizesArr = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];

      const payload = {
        name: formData.name,
        price: priceNum,
        discountPrice: discountNum,
        category: formData.category,
        description: formData.description,
        material: formData.material,
        stock: stockNum,
        images: imagesArr,
        image: imagesArr[0] || '', // backward compatibility
        sizes: sizesArr,
        isBestSeller: formData.isBestSeller,
        isPopular: formData.isPopular,
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        payload.soldCount = 0;
        payload.rating = 5.0;
        payload.reviewCount = 1;
        await addDoc(collection(db, 'products'), payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">Products Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Add, update, and monitor product catalog inventory</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
        />
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {p.image || (p.images && p.images[0]) ? (
                        <img 
                          src={p.image || p.images[0]} 
                          alt={p.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={20} color="var(--text-muted)" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.material || 'Standard'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--gold-primary)', fontWeight: '500' }}>{p.category}</span>
                  </td>
                  <td>
                    <div>${parseFloat(p.price || 0).toFixed(2)}</div>
                    {p.discountPrice && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>Sale: ${parseFloat(p.discountPrice).toFixed(2)}</div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: p.stock > 5 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
                      {p.stock !== undefined ? p.stock : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                      {p.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => openEditModal(p)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(p.id)}>
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Royal Diamond Solitaire Ring" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Regular Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    required 
                    placeholder="2500" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Discount Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    placeholder="Optional" 
                    value={formData.discountPrice}
                    onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category *</label>
                  <select 
                    className="form-select" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Stock Quantity *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Material Description</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Platinum 950 with VVS1 Diamonds" 
                  value={formData.material}
                  onChange={e => setFormData({...formData, material: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (comma separated) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" 
                  value={formData.images}
                  onChange={e => setFormData({...formData, images: e.target.value})}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Provide accessible public image URLs for premium visual display.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Available Sizes (comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="6, 7, 8, 9" 
                  value={formData.sizes}
                  onChange={e => setFormData({...formData, sizes: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  rows="3" 
                  placeholder="Detailed description detailing premium elegance and craftsmanship..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isBestSeller} 
                    onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
                  />
                  <span>Best Seller Badge</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isPopular} 
                    onChange={e => setFormData({...formData, isPopular: e.target.checked})}
                  />
                  <span>Popular Product</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span>Active Catalog</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
