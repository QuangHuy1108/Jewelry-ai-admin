import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Image, 
  ShoppingCart, 
  Tag, 
  Users,
  Store,
  Box,
  Sparkles,
  CreditCard,
  MessageSquare
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'seller-applications', label: 'Seller Applications', icon: Store },
    { id: 'ar-media-hub', label: 'AR & Media Hub', icon: Box },
    { id: 'ai-custom-designs', label: 'AI Custom Designs', icon: Sparkles },
    { id: 'vendor-financials', label: 'Vendor Financials', icon: CreditCard },
    { id: 'live-support', label: 'Live Chat & Telemetry', icon: MessageSquare },
  ];

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-header">
        <div className="brand-logo-wrapper">
          <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>✦</span>
        </div>
        <span className="brand-title">GlowUp Admin</span>
      </div>

      <ul className="nav-list" style={{ flex: 1 }}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <li 
              key={item.id} 
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>

      {onLogout && (
        <div style={{ padding: '20px' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              background: 'rgba(244, 67, 54, 0.1)',
              color: '#F44336',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
