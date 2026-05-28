import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const translations = {
  en: {
    title: "Categories Management",
    subtitle: "Create and reorder navigation taxonomies for the storefront",
    addCategory: "Add Category",
    thOrder: "Order",
    thCover: "Category Cover",
    thName: "Name",
    thStatus: "Status",
    thReorder: "Reorder",
    thActions: "Actions",
    noCategories: 'No categories defined. Click "Add Category" to initialize setup.',
    noCover: "No Cover",
    active: "Active",
    hidden: "Hidden",
    editCategory: "Edit Category",
    addNewCategory: "Add New Category",
    categoryNameLabel: "Category Name *",
    coverUrlLabel: "Cover Image URL *",
    displayOrderLabel: "Display Order",
    visibleLabel: "Visible on Home Feed & Catalog",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    createCategory: "Create Category",
    confirmDelete: "Are you sure you want to delete this category?",
    alertDeleteErr: "Error deleting category: ",
    alertOrderErr: "Error updating order: ",
    alertSaveErr: "Error saving category: "
  },
  vi: {
    title: "Quản Lý Danh Mục",
    subtitle: "Tạo mới và sắp xếp thứ tự danh mục điều hướng cho cửa hàng",
    addCategory: "Thêm Danh Mục",
    thOrder: "Thứ tự",
    thCover: "Ảnh bìa",
    thName: "Tên danh mục",
    thStatus: "Trạng thái",
    thReorder: "Sắp xếp",
    thActions: "Hành động",
    noCategories: 'Chưa có danh mục nào. Bấm "Thêm Danh Mục" để bắt đầu thiết lập.',
    noCover: "Không có ảnh bìa",
    active: "Hoạt động",
    hidden: "Đang ẩn",
    editCategory: "Sửa Danh Mục",
    addNewCategory: "Thêm Danh Mục Mới",
    categoryNameLabel: "Tên Danh Mục *",
    coverUrlLabel: "Đường Dẫn Ảnh Bìa *",
    displayOrderLabel: "Thứ Tự Hiển Thị",
    visibleLabel: "Hiển thị trên Trang chủ & Danh mục",
    cancel: "Hủy",
    saveChanges: "Lưu thay đổi",
    createCategory: "Tạo danh mục",
    confirmDelete: "Bạn có chắc chắn muốn xóa danh mục này?",
    alertDeleteErr: "Lỗi xóa danh mục: ",
    alertOrderErr: "Lỗi cập nhật thứ tự: ",
    alertSaveErr: "Lỗi lưu danh mục: "
  }
};

export default function CategoriesManager({ locale = 'en' }) {
  const t = translations[locale] || translations.en;

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(list);
    });
    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      image: '',
      order: categories.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      image: item.image || '',
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        alert(t.alertDeleteErr + err.message);
      }
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const currentItem = categories[index];
    const targetItem = categories[targetIndex];

    const currentOrder = currentItem.order || index + 1;
    const targetOrder = targetItem.order || targetIndex + 1;

    try {
      await updateDoc(doc(db, 'categories', currentItem.id), { order: targetOrder });
      await updateDoc(doc(db, 'categories', targetItem.id), { order: currentOrder });
    } catch (err) {
      alert(t.alertOrderErr + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        image: formData.image,
        order: parseInt(formData.order, 10) || 0,
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'categories'), payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(t.alertSaveErr + err.message);
    }
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">{t.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{t.subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>{t.addCategory}</span>
        </button>
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>{t.thOrder}</th>
              <th>{t.thCover}</th>
              <th>{t.thName}</th>
              <th>{t.thStatus}</th>
              <th>{t.thReorder}</th>
              <th>{t.thActions}</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  {t.noCategories}
                </td>
              </tr>
            ) : (
              categories.map((c, idx) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--gold-primary)' }}>#{c.order || idx + 1}</td>
                  <td>
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.name} 
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                      />
                    ) : (
                      <div style={{ width: '60px', height: '40px', background: '#27272a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.noCover}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {c.name}
                  </td>
                  <td>
                    <span className={`badge ${c.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                      {c.isActive !== false ? t.active : t.hidden}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px' }} 
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, 'up')}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px' }} 
                        disabled={idx === categories.length - 1}
                        onClick={() => handleMoveOrder(idx, 'down')}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
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
              <h3 className="modal-title">{editingId ? t.editCategory : t.addNewCategory}</h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t.categoryNameLabel}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Diamond Rings" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.coverUrlLabel}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="https://example.com/cover.jpg" 
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.displayOrderLabel}</label>
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
                  <span style={{ fontSize: '0.95rem' }}>{t.visibleLabel}</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>{t.cancel}</button>
                <button type="submit" className="btn btn-primary">{editingId ? t.saveChanges : t.createCategory}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
