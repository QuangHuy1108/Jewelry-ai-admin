import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const translations = {
  en: {
    title: "Coupons & Offers",
    subtitle: "Issue vouchers, control discount percentages, and establish usage constraints",
    createCoupon: "Create Coupon",
    thPromoCode: "Promo Code",
    thCampaign: "Campaign Tagline",
    thDiscount: "Discount Value",
    thMinSpend: "Min Spend",
    thRedemptions: "Redemptions",
    thStatus: "Status",
    thActions: "Actions",
    noCoupons: 'No promotional vouchers configured. Click "Create Coupon" to begin.',
    generalOffer: "General Offer",
    active: "Active",
    cappedOut: "Capped Out",
    expired: "Expired",
    editPromo: "Edit Promo Code",
    issueNew: "Issue New Coupon",
    couponCodeLabel: "Coupon Code *",
    discountValLabel: "Discount Value (%) *",
    campaignTitleLabel: "Campaign Tagline / Title *",
    minOrderLabel: "Minimum Order Threshold ($)",
    maxRedemptionsLabel: "Maximum Redemptions Cap",
    activeRedeemable: "Active Redeemable State",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    issueCode: "Issue Code",
    confirmDelete: "Are you sure you want to delete this promo code?",
    alertDeleteErr: "Error deleting coupon: ",
    alertToggleErr: "Error updating coupon state: ",
    alertSaveErr: "Error saving coupon: "
  },
  vi: {
    title: "Mã Giảm Giá & Ưu Đãi",
    subtitle: "Phát hành voucher, kiểm soát tỷ lệ giảm giá và thiết lập giới hạn sử dụng",
    createCoupon: "Tạo Mã Giảm Giá",
    thPromoCode: "Mã Khuyến Mãi",
    thCampaign: "Chiến dịch",
    thDiscount: "Mức Giảm",
    thMinSpend: "Đơn Tối Thiểu",
    thRedemptions: "Đã Dùng",
    thStatus: "Trạng thái",
    thActions: "Hành động",
    noCoupons: 'Chưa cấu hình voucher khuyến mãi nào. Hãy bấm "Tạo Mã Giảm Giá" để bắt đầu.',
    generalOffer: "Ưu đãi chung",
    active: "Hoạt động",
    cappedOut: "Hết lượt",
    expired: "Hết hạn",
    editPromo: "Sửa Mã Khuyến Mãi",
    issueNew: "Phát Hành Mã Mới",
    couponCodeLabel: "Mã Khuyến Mãi *",
    discountValLabel: "Phần Trăm Giảm Giá (%) *",
    campaignTitleLabel: "Tên Chiến Dịch / Tiêu Đề *",
    minOrderLabel: "Giá Trị Đơn Hàng Tối Thiểu ($)",
    maxRedemptionsLabel: "Giới Hạn Lượt Sử Dụng",
    activeRedeemable: "Kích Hoạt Cho Phép Sử Dụng",
    cancel: "Hủy",
    saveChanges: "Lưu thay đổi",
    issueCode: "Phát hành mã",
    confirmDelete: "Bạn có chắc chắn muốn hủy bỏ và xóa mã khuyến mãi này không?",
    alertDeleteErr: "Lỗi xóa mã giảm giá: ",
    alertToggleErr: "Lỗi cập nhật trạng thái mã giảm giá: ",
    alertSaveErr: "Lỗi lưu mã giảm giá: "
  }
};

export default function CouponsManager({ locale = 'en' }) {
  const t = translations[locale] || translations.en;

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
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
      } catch (err) {
        alert(t.alertDeleteErr + err.message);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'coupons', id), { isActive: !currentStatus });
    } catch (err) {
      alert(t.alertToggleErr + err.message);
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
          <span>{t.createCoupon}</span>
        </button>
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>{t.thPromoCode}</th>
              <th>{t.thCampaign}</th>
              <th>{t.thDiscount}</th>
              <th>{t.thMinSpend}</th>
              <th>{t.thRedemptions}</th>
              <th>{t.thStatus}</th>
              <th>{t.thActions}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  {t.noCoupons}
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
                      {c.title || t.generalOffer}
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
                          {c.isActive !== false && !isCapped ? t.active : (isCapped ? t.cappedOut : t.expired)}
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
              <h3 className="modal-title">{editingId ? t.editPromo : t.issueNew}</h3>
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
                  <label className="form-label">{t.couponCodeLabel}</label>
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
                  <label className="form-label">{t.discountValLabel}</label>
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
                <label className="form-label">{t.campaignTitleLabel}</label>
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
                  <label className="form-label">{t.minOrderLabel}</label>
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
                  <label className="form-label">{t.maxRedemptionsLabel}</label>
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
                  <span style={{ fontSize: '0.95rem' }}>{t.activeRedeemable}</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>{t.cancel}</button>
                <button type="submit" className="btn btn-primary">{editingId ? t.saveChanges : t.issueCode}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
