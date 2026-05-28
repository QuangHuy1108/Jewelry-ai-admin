import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const translations = {
  en: {
    title: "Promotional Banners",
    subtitle: "Configure carousel banners displayed on the home feed header",
    createBanner: "Create Banner",
    thOrder: "Order",
    thPreview: "Banner Visual Preview",
    thCampaign: "Title / Campaign",
    thStatus: "Status",
    thActions: "Actions",
    noBanners: 'No active banners configured. Click "Create Banner" to start.',
    liveCarousel: "Live Carousel",
    archived: "Archived",
    editBanner: "Edit Promotional Banner",
    addNewBanner: "Create New Banner",
    campaignLabel: "Campaign Title *",
    bannerUrlLabel: "Banner Image URL *",
    bannerHelp: "Recommended resolution: 1200x500 pixels for rich fidelity display.",
    targetLabel: "Link/Target Action",
    priorityLabel: "Display Priority Order",
    visibleLabel: "Active & Visible in Mobile App",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    publishBanner: "Publish Banner",
    confirmDelete: "Are you sure you want to delete this promotional banner?",
    alertDeleteErr: "Error deleting banner: ",
    alertSaveErr: "Error saving banner: "
  },
  vi: {
    title: "Banner Quảng Cáo",
    subtitle: "Cấu hình banner trình chiếu hiển thị ở đầu trang chủ ứng dụng",
    createBanner: "Tạo Banner",
    thOrder: "Thứ tự",
    thPreview: "Hình ảnh xem trước",
    thCampaign: "Tiêu đề / Chiến dịch",
    thStatus: "Trạng thái",
    thActions: "Hành động",
    noBanners: 'Chưa có banner nào hoạt động. Hãy bấm "Tạo Banner" để bắt đầu.',
    liveCarousel: "Đang Trình Chiếu",
    archived: "Đã Lưu Trữ",
    editBanner: "Sửa Banner Quảng Cáo",
    addNewBanner: "Tạo Banner Mới",
    campaignLabel: "Tiêu Đề Chiến Dịch *",
    bannerUrlLabel: "Đường Dẫn Ảnh Banner *",
    bannerHelp: "Độ phân giải khuyến nghị: 1200x500 pixels để hiển thị sắc nét nhất.",
    targetLabel: "Liên kết / Hành động điều hướng",
    priorityLabel: "Thứ Tự Ưu Tiên Hiển Thị",
    visibleLabel: "Kích hoạt & Hiển thị trên Ứng dụng di động",
    cancel: "Hủy",
    saveChanges: "Lưu thay đổi",
    publishBanner: "Xuất bản Banner",
    confirmDelete: "Bạn có chắc chắn muốn xóa banner quảng cáo này?",
    alertDeleteErr: "Lỗi xóa banner: ",
    alertSaveErr: "Lỗi lưu banner: "
  }
};

export default function BannersManager({ locale = 'en' }) {
  const t = translations[locale] || translations.en;

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
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteDoc(doc(db, 'banners', id));
      } catch (err) {
        alert(t.alertDeleteErr + err.message);
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
          <span>{t.createBanner}</span>
        </button>
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>{t.thOrder}</th>
              <th>{t.thPreview}</th>
              <th>{t.thCampaign}</th>
              <th>{t.thStatus}</th>
              <th>{t.thActions}</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  {t.noBanners}
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
                        {t.thPreview}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{b.title || 'Untitled Offer'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '4px' }}>Target Action: {b.link || 'Catalog'}</div>
                  </td>
                  <td>
                    <span className={`badge ${b.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                      {b.isActive !== false ? t.liveCarousel : t.archived}
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
              <h3 className="modal-title">{editingId ? t.editBanner : t.addNewBanner}</h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t.campaignLabel}</label>
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
                <label className="form-label">{t.bannerUrlLabel}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="https://example.com/banner.jpg" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {t.bannerHelp}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">{t.targetLabel}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. discount, category, catalog" 
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.priorityLabel}</label>
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
                <button type="submit" className="btn btn-primary">{editingId ? t.saveChanges : t.publishBanner}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
