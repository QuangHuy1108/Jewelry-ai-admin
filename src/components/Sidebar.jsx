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
  MessageSquare,
  Settings
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
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
    { id: 'settings', label: 'Settings', icon: Settings },
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
    </aside>
  );
}

