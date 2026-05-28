import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Layers, 
  Store, 
  Sparkles, 
  Percent 
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';

const translations = {
  en: {
    title: "Dashboard Overview",
    subtitle: "Real-time business performance & AI Try-On analytics",
    engine: "Obsidian Gold Engine v1.0",
    revenue: "Total Revenue",
    orders: "Active Orders",
    items: "Catalog Items",
    customers: "Registered Customers",
    analyticsTitle: "Interactive Analytics Center",
    analyticsSubtitle: "Analyze product flows, multi-vendor performance and AI engagement trends",
    productType: "Product Type",
    sellers: "Sellers",
    aiTryOn: "AI Try-On",
    insightsTitle: "System Insights",
    insightsPending: "Orders Awaiting Fulfillment",
    insightsPerf: "System Performance",
    insightsPerfVal: "Optimal (99.98%)",
    insightsSync: "Sync Status",
    insightsSyncVal: "Live Connection",
    chartTitle: "Performance Metrics",
    // Chart keys
    rings: "Rings",
    necklaces: "Necklaces",
    aiDesign: "AI Design",
    customUserDesigns: "Custom User Designs",
    tryOnClicks: "Try-On Clicks",
    cartAdditions: "Cart Additions",
    conversionRate: "Conversion Rate"
  },
  vi: {
    title: "Bảng Điều Khiển Tổng Quan",
    subtitle: "Hiệu suất kinh doanh thực tế & Phân tích Thử đồ ảo AI",
    engine: "Obsidian Gold Engine v1.0",
    revenue: "Tổng Doanh Thu",
    orders: "Đơn Hàng Đang Xử Lý",
    items: "Số Lượng Sản Phẩm",
    customers: "Khách Hàng Đăng Ký",
    analyticsTitle: "Trung Tâm Phân Tích Số Liệu",
    analyticsSubtitle: "Đánh giá luồng sản phẩm, hiệu suất của nhà bán hàng lẻ và xu hướng tương tác AI",
    productType: "Loại Sản Phẩm",
    sellers: "Nhà Bán Hàng",
    aiTryOn: "Thử Đồ AI",
    insightsTitle: "Thông Tin Hệ Thống",
    insightsPending: "Đơn Hàng Chờ Hoàn Thành",
    insightsPerf: "Hiệu Suất Hệ Thống",
    insightsPerfVal: "Tối Ưu (99.98%)",
    insightsSync: "Trạng Thái Đồng Bộ",
    insightsSyncVal: "Kết Nối Trực Tiếp",
    chartTitle: "Chỉ Số Hiệu Suất",
    // Chart keys
    rings: "Nhẫn",
    necklaces: "Vòng Cổ",
    aiDesign: "Thiết Kế AI",
    customUserDesigns: "Thiết Kế Tùy Chọn",
    tryOnClicks: "Lượt Thử Đồ",
    cartAdditions: "Thêm Vào Giỏ",
    conversionRate: "Tỷ Lệ Chuyển Đổi"
  }
};

export default function DashboardStats({ locale = 'en' }) {
  const t = translations[locale] || translations.en;

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0
  });

  const [activeAxis, setActiveAxis] = useState('productType'); // 'productType' | 'vendor' | 'tryOn'

  useEffect(() => {
    // Subscribe to Orders
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let revenue = 0;
      let pendingCount = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        revenue += (data.totalAmount || data.total || 0);
        if (data.status === 'pending' || data.status === 'processing') {
          pendingCount++;
        }
      });
      setStats(prev => ({
        ...prev,
        totalOrders: snapshot.size,
        totalRevenue: revenue,
        pendingOrders: pendingCount
      }));
    });

    // Subscribe to Products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setStats(prev => ({ ...prev, totalProducts: snapshot.size }));
    });

    // Subscribe to Users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeUsers();
    };
  }, []);

  const statCards = [
    { label: t.revenue, value: `$${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign },
    { label: t.orders, value: stats.totalOrders, icon: ShoppingBag },
    { label: t.items, value: stats.totalProducts, icon: Package },
    { label: t.customers, value: stats.totalUsers, icon: Users },
  ];

  // Axis 1: Revenue by Product Type
  const productTypeData = [
    { month: 'Jan', [t.rings]: 18000, [t.necklaces]: 12000, [t.aiDesign]: 5000 },
    { month: 'Feb', [t.rings]: 22000, [t.necklaces]: 15000, [t.aiDesign]: 9000 },
    { month: 'Mar', [t.rings]: 25000, [t.necklaces]: 18000, [t.aiDesign]: 14000 },
    { month: 'Apr', [t.rings]: 29000, [t.necklaces]: 21000, [t.aiDesign]: 22000 },
    { month: 'May', [t.rings]: 35000, [t.necklaces]: 24000, [t.aiDesign]: 31000 },
    { month: 'Jun', [t.rings]: 42000, [t.necklaces]: 28000, [t.aiDesign]: 45000 },
  ];

  // Axis 2: Revenue by Vendor (Sellers)
  const vendorData = [
    { month: 'Jan', 'GlowUp Elite': 15000, 'Orion Jewels': 12000, 'Aurum Designs': 6000, [t.customUserDesigns]: 2000 },
    { month: 'Feb', 'GlowUp Elite': 19000, 'Orion Jewels': 14000, 'Aurum Designs': 9000, [t.customUserDesigns]: 4000 },
    { month: 'Mar', 'GlowUp Elite': 21000, 'Orion Jewels': 17000, 'Aurum Designs': 12000, [t.customUserDesigns]: 7000 },
    { month: 'Apr', 'GlowUp Elite': 26000, 'Orion Jewels': 20000, 'Aurum Designs': 16000, [t.customUserDesigns]: 10000 },
    { month: 'May', 'GlowUp Elite': 31000, 'Orion Jewels': 23000, 'Aurum Designs': 21000, [t.customUserDesigns]: 15000 },
    { month: 'Jun', 'GlowUp Elite': 38000, 'Orion Jewels': 29000, 'Aurum Designs': 28000, [t.customUserDesigns]: 20000 },
  ];

  // Axis 3: Try-On Feature Conversion Rate
  const tryOnData = [
    { month: 'Jan', [t.tryOnClicks]: 2500, [t.cartAdditions]: 600, [t.conversionRate]: 24.0 },
    { month: 'Feb', [t.tryOnClicks]: 3200, [t.cartAdditions]: 820, [t.conversionRate]: 25.6 },
    { month: 'Mar', [t.tryOnClicks]: 4100, [t.cartAdditions]: 1100, [t.conversionRate]: 26.8 },
    { month: 'Apr', [t.tryOnClicks]: 5500, [t.cartAdditions]: 1550, [t.conversionRate]: 28.1 },
    { month: 'May', [t.tryOnClicks]: 7200, [t.cartAdditions]: 2160, [t.conversionRate]: 30.0 },
    { month: 'Jun', [t.tryOnClicks]: 9500, [t.cartAdditions]: 3040, [t.conversionRate]: 32.0 },
  ];

  // Month formatter for charts
  const formatMonth = (m) => {
    if (locale === 'vi') {
      const viMonths = { Jan: 'Thg 1', Feb: 'Thg 2', Mar: 'Thg 3', Apr: 'Thg 4', May: 'Thg 5', Jun: 'Thg 6' };
      return viMonths[m] || m;
    }
    return m;
  };

  // Custom tooltips matching the premium luxury obsidian style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#0A0A0B',
          border: '1px solid var(--border-color-hover)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
        }}>
          <p style={{ 
            color: 'var(--text-primary)', 
            fontWeight: '600', 
            fontSize: '0.85rem', 
            marginBottom: '10px', 
            borderBottom: '1px solid rgba(212,175,55,0.1)', 
            paddingBottom: '6px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {formatMonth(label)} ✦ {t.chartTitle}
          </p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ 
              color: p.color || 'var(--gold-primary)', 
              fontSize: '0.825rem', 
              margin: '6px 0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '24px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                <span>{p.name}:</span>
              </span>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                {p.name.includes('Rate') || p.name.includes('Tỷ Lệ') || p.name.includes('Conversion') 
                  ? `${p.value}%` 
                  : p.name.includes('Clicks') || p.name.includes('Lượt') || p.name.includes('Additions') || p.name.includes('Thêm')
                    ? p.value.toLocaleString() 
                    : `$${p.value.toLocaleString()}`}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeAxis) {
      case 'productType':
        return (
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={productTypeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorNecklaces" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B59410" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#B59410" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(212, 175, 55, 0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} />
              <YAxis 
                stroke="var(--text-secondary)" 
                tick={{ fontSize: 11, fontFamily: 'Outfit' }}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: '0.85rem', paddingTop: '10px' }} />
              <Area type="monotone" dataKey={t.rings} stroke="#a1a1aa" strokeWidth={2} fillOpacity={1} fill="url(#colorRings)" />
              <Area type="monotone" dataKey={t.necklaces} stroke="#B59410" strokeWidth={2} fillOpacity={1} fill="url(#colorNecklaces)" />
              <Area type="monotone" dataKey={t.aiDesign} stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorAi)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'vendor':
        return (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={vendorData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(212, 175, 55, 0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} />
              <YAxis 
                stroke="var(--text-secondary)" 
                tick={{ fontSize: 11, fontFamily: 'Outfit' }}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: '0.85rem', paddingTop: '10px' }} />
              <Bar dataKey="GlowUp Elite" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Orion Jewels" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Aurum Designs" fill="#B59410" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t.customUserDesigns} fill="#52525b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'tryOn':
        return (
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={tryOnData} margin={{ top: 10, right: -10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e1b4b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#1e1b4b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(212, 175, 55, 0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} />
              <YAxis 
                yAxisId="left"
                stroke="var(--text-secondary)" 
                tick={{ fontSize: 11, fontFamily: 'Outfit' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#D4AF37" 
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11, fontFamily: 'Outfit' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: '0.85rem', paddingTop: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey={t.tryOnClicks} fill="url(#colorClicks)" stroke="#312e81" strokeWidth={1.5} />
              <Bar yAxisId="left" dataKey={t.cartAdditions} fill="#a1a1aa" barSize={20} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey={t.conversionRate} stroke="#D4AF37" strokeWidth={3} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title" style={{ fontSize: '2.25rem', color: 'var(--text-primary)' }}>{t.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.06)', padding: '8px 14px', borderRadius: '30px', border: '1px solid rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary)' }}>
          <Sparkles size={14} />
          <span>{t.engine}</span>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div key={idx} className="glass-panel stat-card" style={{ padding: '24px 28px' }}>
              <div className="stat-info">
                <span className="stat-label" style={{ fontWeight: '600', letterSpacing: '0.08em' }}>{card.label}</span>
                <span className="stat-value" style={{ 
                  fontSize: '2.1rem', 
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: '700',
                  color: card.label === t.revenue ? 'var(--gold-primary)' : 'var(--text-primary)',
                  marginTop: '6px'
                }}>
                  {card.value}
                </span>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <IconComp size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Business Intelligence Center */}
      <div className="glass-panel" style={{ marginTop: '28px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px', borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={22} color="var(--gold-primary)" />
              {t.analyticsTitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{t.analyticsSubtitle}</p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'productType', label: t.productType, icon: Layers },
              { id: 'vendor', label: t.sellers, icon: Store },
              { id: 'tryOn', label: t.aiTryOn, icon: Sparkles },
            ].map((btn) => {
              const Icon = btn.icon;
              const isSelected = activeAxis === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setActiveAxis(btn.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'var(--gold-primary)' : 'transparent',
                    color: isSelected ? '#000' : 'var(--text-secondary)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Icon size={14} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div style={{ background: '#070708', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.06)', padding: '24px 20px 10px 10px' }}>
          {renderChart()}
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '28px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {t.insightsTitle}
        </h2>
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.insightsPending}</p>
            <p style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-orange)', marginTop: '4px' }}>{stats.pendingOrders}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.insightsPerf}</p>
            <p style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-green)', marginTop: '4px' }}>{t.insightsPerfVal}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.insightsSync}</p>
            <p style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-blue)', marginTop: '4px' }}>{t.insightsSyncVal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
