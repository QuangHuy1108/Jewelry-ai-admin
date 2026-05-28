import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Package, Truck, XCircle, Search } from 'lucide-react';

const translations = {
  en: {
    title: "Orders Management",
    subtitle: "Monitor transactional activity, fulfill deliveries, and dispatch notifications",
    searchPlaceholder: "Search Order ID, Customer Name, or Phone...",
    filterLabel: "Filter Status:",
    allStatuses: "All Statuses",
    statusPending: "Pending",
    statusProcessing: "Processing",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    thOrderId: "Order ID / Date",
    thCustomer: "Customer details",
    thTotal: "Total Amount",
    thPayment: "Payment Info",
    thFulfillment: "Fulfillment Status",
    thAction: "Action / Details",
    noOrders: "No orders match the specified filters.",
    guestCustomer: "Guest Customer",
    noPhone: "No phone",
    promoCode: "Promo: ",
    paymentPending: "Pending",
    paymentSuccess: "Success",
    paymentCard: "Card / Online",
    statusLabel: "Status: ",
    hideItems: "Hide Items",
    viewItems: "View Items",
    purchasedItems: "Purchased Catalog Items",
    noCartItems: "No granular cart items stored with this legacy transaction.",
    standardSize: "Standard",
    shippingDetails: "Shipping details",
    addressUnrecorded: "Address unrecorded",
    gatewayTxnRef: "Gateway Txn Ref:",
    alertStatusErr: "Error updating status: "
  },
  vi: {
    title: "Quản Lý Đơn Hàng",
    subtitle: "Giám sát giao dịch mua bán, cập nhật vận chuyển và thông báo cho khách hàng",
    searchPlaceholder: "Tìm mã đơn hàng, tên khách hàng, hoặc số điện thoại...",
    filterLabel: "Lọc trạng thái:",
    allStatuses: "Tất cả trạng thái",
    statusPending: "Chờ xử lý",
    statusProcessing: "Đang giao dịch",
    statusShipped: "Đang vận chuyển",
    statusDelivered: "Đã giao hàng",
    statusCancelled: "Đã hủy đơn",
    thOrderId: "Mã Đơn / Ngày đặt",
    thCustomer: "Khách hàng",
    thTotal: "Tổng Thanh Toán",
    thPayment: "Thanh Toán",
    thFulfillment: "Vận chuyển",
    thAction: "Chi tiết / Thao tác",
    noOrders: "Không có đơn hàng nào khớp với bộ lọc đã chọn.",
    guestCustomer: "Khách vãng lai",
    noPhone: "Không có số điện thoại",
    promoCode: "Mã giảm: ",
    paymentPending: "Chờ thanh toán",
    paymentSuccess: "Đã thanh toán",
    paymentCard: "Thẻ / Chuyển khoản",
    statusLabel: "Trạng thái: ",
    hideItems: "Ẩn chi tiết",
    viewItems: "Xem chi tiết",
    purchasedItems: "Danh Sách Sản Phẩm Mua",
    noCartItems: "Không tìm thấy danh sách sản phẩm trong giỏ hàng.",
    standardSize: "Tiêu chuẩn",
    shippingDetails: "Thông tin giao hàng",
    addressUnrecorded: "Không lưu thông tin địa chỉ",
    gatewayTxnRef: "Mã giao dịch ngân hàng:",
    alertStatusErr: "Lỗi khi cập nhật trạng thái đơn hàng: "
  }
};

export default function OrdersManager({ locale = 'en' }) {
  const t = translations[locale] || translations.en;

  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setOrders(list);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (err) {
      alert(t.alertStatusErr + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge badge-success"><CheckCircle size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} /> {t.statusDelivered}</span>;
      case 'shipped':
        return <span className="badge badge-info"><Truck size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} /> {t.statusShipped}</span>;
      case 'processing':
        return <span className="badge badge-warning"><Package size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} /> {t.statusProcessing}</span>;
      case 'cancelled':
        return <span className="badge badge-danger"><XCircle size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} /> {t.statusCancelled}</span>;
      default:
        return <span className="badge badge-warning" style={{ background: 'rgba(161, 161, 170, 0.15)', color: 'var(--text-secondary)' }}><Clock size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} /> {t.statusPending}</span>;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const searchString = `${o.id} ${o.userId} ${o.deliveryAddress?.fullName || ''} ${o.deliveryAddress?.phoneNumber || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">{t.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{t.subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
          />
        </div>

        <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{t.filterLabel}</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">{t.allStatuses}</option>
            <option value="pending">{t.statusPending}</option>
            <option value="processing">{t.statusProcessing}</option>
            <option value="shipped">{t.statusShipped}</option>
            <option value="delivered">{t.statusDelivered}</option>
            <option value="cancelled">{t.statusCancelled}</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="rich-table">
          <thead>
            <tr>
              <th>{t.thOrderId}</th>
              <th>{t.thCustomer}</th>
              <th>{t.thTotal}</th>
              <th>{t.thPayment}</th>
              <th>{t.thFulfillment}</th>
              <th>{t.thAction}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  {t.noOrders}
                </td>
              </tr>
            ) : (
              filteredOrders.map(o => {
                const isExpanded = expandedId === o.id;
                const orderDate = o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : 'N/A';
                const items = Array.isArray(o.items) ? o.items : [];
                const addr = o.deliveryAddress || {};

                return (
                  <React.Fragment key={o.id}>
                    <tr style={{ background: isExpanded ? 'var(--bg-surface-hover)' : 'transparent', transition: 'background 0.2s' }}>
                      <td>
                        <div style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--gold-primary)', fontSize: '0.95rem' }}>{o.id}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{orderDate}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{addr.fullName || t.guestCustomer}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{addr.phoneNumber || t.noPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          ${parseFloat(o.totalAmount || o.total || 0).toFixed(2)}
                        </div>
                        {o.voucher && o.voucher.code && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)' }}>{t.promoCode}{o.voucher.code}</div>
                        )}
                      </td>
                      <td>
                        <div style={{ textTransform: 'capitalize', fontWeight: '500', fontSize: '0.9rem' }}>
                          {o.paymentMethod || o.paymentGateway || t.paymentCard}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: o.paymentStatus === 'success' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                          {t.statusLabel}{o.paymentStatus === 'success' ? t.paymentSuccess : t.paymentPending}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusBadge(o.status)}
                          <select 
                            value={o.status || 'pending'}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            style={{ 
                              background: 'var(--bg-base)', 
                              color: 'var(--text-primary)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '6px', 
                              padding: '2px 6px', 
                              fontSize: '0.75rem',
                              outline: 'none',
                              cursor: 'pointer' 
                            }}
                          >
                            <option value="pending">{t.statusPending}</option>
                            <option value="processing">{t.statusProcessing}</option>
                            <option value="shipped">{t.statusShipped}</option>
                            <option value="delivered">{t.statusDelivered}</option>
                            <option value="cancelled">{t.statusCancelled}</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => toggleExpand(o.id)}
                        >
                          <span>{isExpanded ? t.hideItems : t.viewItems}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <tr style={{ background: 'var(--bg-base)' }}>
                        <td colSpan="6" style={{ padding: '20px 32px', borderBottom: '2px solid var(--gold-primary)' }}>
                          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                            {/* Items List */}
                            <div style={{ flex: 2, minWidth: '300px' }}>
                              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '0.05em' }}>{t.purchasedItems}</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {items.length === 0 ? (
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.noCartItems}</p>
                                ) : (
                                  items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {item.image ? (
                                          <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                        ) : (
                                          <div style={{ width: '40px', height: '40px', background: '#2a2a30', borderRadius: '6px' }} />
                                        )}
                                        <div>
                                          <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.name || 'Jewelry Product'}</div>
                                          <div style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>Size: {item.selectedSize || item.size || t.standardSize} | Qty: {item.quantity || 1}</div>
                                        </div>
                                      </div>
                                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        ${parseFloat((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                            {/* Delivery Information */}
                            <div style={{ flex: 1, minWidth: '220px', background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '0.05em' }}>{t.shippingDetails}</h4>
                              <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{addr.fullName || 'N/A'}</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{addr.street || addr.address || t.addressUnrecorded}</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{addr.city ? `${addr.city}, ${addr.country || ''}` : ''}</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: '500' }}>📞 {addr.phoneNumber || 'N/A'}</p>
                              {o.transactionId && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{t.gatewayTxnRef}</span>
                                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-blue)' }}>{o.transactionId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
