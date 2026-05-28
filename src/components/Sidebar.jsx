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

const sidebarTranslations = {
  en: {
    dashboard: "Dashboard",
    products: "Products",
    categories: "Categories",
    banners: "Banners",
    orders: "Orders",
    coupons: "Coupons",
    users: "Users",
    sellerApplications: "Seller Applications",
    arMediaHub: "AR & Media Hub",
    aiCustomDesigns: "AI Custom Designs",
    vendorFinancials: "Vendor Financials",
    liveSupport: "Live Chat & Telemetry",
    settings: "Settings"
  },
  vi: {
    dashboard: "Bảng Điều Khiển",
    products: "Sản Phẩm",
    categories: "Danh Mục",
    banners: "Banners Quảng Cáo",
    orders: "Đơn Hàng",
    coupons: "Mã Giảm Giá",
    users: "Người Dùng",
    sellerApplications: "Đăng Ký Đối Tác",
    arMediaHub: "Trung Tâm AR & 3D",
    aiCustomDesigns: "Thiết Kế AI Khách Hàng",
    vendorFinancials: "Tài Chính Đối Tác",
    liveSupport: "Hỗ Trợ & Đo Lường",
    settings: "Thiết Lập"
  }
};

export default function Sidebar({ currentTab, setCurrentTab, locale = 'en' }) {
  const t = sidebarTranslations[locale] || sidebarTranslations.en;
  
  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'products', label: t.products, icon: Package },
    { id: 'categories', label: t.categories, icon: Layers },
    { id: 'banners', label: t.banners, icon: Image },
    { id: 'orders', label: t.orders, icon: ShoppingCart },
    { id: 'coupons', label: t.coupons, icon: Tag },
    { id: 'users', label: t.users, icon: Users },
    { id: 'seller-applications', label: t.sellerApplications, icon: Store },
    { id: 'ar-media-hub', label: t.arMediaHub, icon: Box },
    { id: 'ai-custom-designs', label: t.aiCustomDesigns, icon: Sparkles },
    { id: 'vendor-financials', label: t.vendorFinancials, icon: CreditCard },
    { id: 'live-support', label: t.liveSupport, icon: MessageSquare },
    { id: 'settings', label: t.settings, icon: Settings },
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

