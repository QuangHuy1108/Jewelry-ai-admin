import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0
  });

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

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Real-time business performance analytics</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div key={idx} className="glass-panel stat-card">
              <div className="stat-info">
                <span className="stat-label">{card.label}</span>
                <span className="stat-value">{card.value}</span>
              </div>
              <div className="stat-icon">
                <IconComp size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', color: 'var(--gold-primary)' }}>
          System Insights
        </h2>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Orders Awaiting Fulfillment</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>{stats.pendingOrders}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>System Health</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>Optimal</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sync Status</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>Live Connection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
