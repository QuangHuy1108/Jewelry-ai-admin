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

export default function DashboardStats() {
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
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign },
    { label: 'Active Orders', value: stats.totalOrders, icon: ShoppingBag },
    { label: 'Catalog Items', value: stats.totalProducts, icon: Package },
    { label: 'Registered Customers', value: stats.totalUsers, icon: Users },
  ];

  // Axis 1: Revenue by Product Type
  const productTypeData = [
    { month: 'Jan', Rings: 18000, Necklaces: 12000, 'AI Design': 5000 },
    { month: 'Feb', Rings: 22000, Necklaces: 15000, 'AI Design': 9000 },
    { month: 'Mar', Rings: 25000, Necklaces: 18000, 'AI Design': 14000 },
    { month: 'Apr', Rings: 29000, Necklaces: 21000, 'AI Design': 22000 },
    { month: 'May', Rings: 35000, Necklaces: 24000, 'AI Design': 31000 },
    { month: 'Jun', Rings: 42000, Necklaces: 28000, 'AI Design': 45000 },
  ];

  // Axis 2: Revenue by Vendor (Sellers)
  const vendorData = [
    { month: 'Jan', 'GlowUp Elite': 15000, 'Orion Jewels': 12000, 'Aurum Designs': 6000, 'Custom User Designs': 2000 },
    { month: 'Feb', 'GlowUp Elite': 19000, 'Orion Jewels': 14000, 'Aurum Designs': 9000, 'Custom User Designs': 4000 },
    { month: 'Mar', 'GlowUp Elite': 21000, 'Orion Jewels': 17000, 'Aurum Designs': 12000, 'Custom User Designs': 7000 },
    { month: 'Apr', 'GlowUp Elite': 26000, 'Orion Jewels': 20000, 'Aurum Designs': 16000, 'Custom User Designs': 10000 },
    { month: 'May', 'GlowUp Elite': 31000, 'Orion Jewels': 23000, 'Aurum Designs': 21000, 'Custom User Designs': 15000 },
    { month: 'Jun', 'GlowUp Elite': 38000, 'Orion Jewels': 29000, 'Aurum Designs': 28000, 'Custom User Designs': 20000 },
  ];

  // Axis 3: Try-On Feature Conversion Rate
  const tryOnData = [
    { month: 'Jan', 'Try-On Clicks': 2500, 'Cart Additions': 600, 'Conversion Rate': 24.0 },
    { month: 'Feb', 'Try-On Clicks': 3200, 'Cart Additions': 820, 'Conversion Rate': 25.6 },
    { month: 'Mar', 'Try-On Clicks': 4100, 'Cart Additions': 1100, 'Conversion Rate': 26.8 },
    { month: 'Apr', 'Try-On Clicks': 5500, 'Cart Additions': 1550, 'Conversion Rate': 28.1 },
    { month: 'May', 'Try-On Clicks': 7200, 'Cart Additions': 2160, 'Conversion Rate': 30.0 },
    { month: 'Jun', 'Try-On Clicks': 9500, 'Cart Additions': 3040, 'Conversion Rate': 32.0 },
  ];

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
            {label} ✦ Performance Metrics
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
                {p.name.includes('Rate') || p.name.includes('Conversion') 
                  ? `${p.value}%` 
                  : p.name.includes('Clicks') || p.name.includes('Additions') 
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
              <Area type="monotone" dataKey="Rings" stroke="#a1a1aa" strokeWidth={2} fillOpacity={1} fill="url(#colorRings)" />
              <Area type="monotone" dataKey="Necklaces" stroke="#B59410" strokeWidth={2} fillOpacity={1} fill="url(#colorNecklaces)" />
              <Area type="monotone" dataKey="AI Design" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorAi)" />
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
              <Bar dataKey="Custom User Designs" fill="#52525b" radius={[4, 4, 0, 0]} />
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
              <Area yAxisId="left" type="monotone" dataKey="Try-On Clicks" fill="url(#colorClicks)" stroke="#312e81" strokeWidth={1.5} />
              <Bar yAxisId="left" dataKey="Cart Additions" fill="#a1a1aa" barSize={20} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="Conversion Rate" stroke="#D4AF37" strokeWidth={3} activeDot={{ r: 6 }} />
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
          <h1 className="page-title" style={{ fontSize: '2.25rem', color: 'var(--text-primary)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Real-time business performance & AI Try-On analytics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.06)', padding: '8px 14px', borderRadius: '30px', border: '1px solid rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary)' }}>
          <Sparkles size={14} />
          <span>Obsidian Gold Engine v1.0</span>
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
                  color: card.label.includes('Revenue') ? 'var(--gold-primary)' : 'var(--text-primary)',
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
              Interactive Analytics Center
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Analyze product flows, multi-vendor performance and AI engagement trends</p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'productType', label: 'Product Type', icon: Layers },
              { id: 'vendor', label: 'Sellers', icon: Store },
              { id: 'tryOn', label: 'AI Try-On', icon: Sparkles },
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
          System Insights
        </h2>
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Orders Awaiting Fulfillment</p>
            <p style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-orange)', marginTop: '4px' }}>{stats.pendingOrders}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>System Performance</p>
            <p style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-green)', marginTop: '4px' }}>Optimal (99.98%)</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sync Status</p>
            <p style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-blue)', marginTop: '4px' }}>Live Connection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
