import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import ProductsManager from './components/ProductsManager';
import CategoriesManager from './components/CategoriesManager';
import BannersManager from './components/BannersManager';
import OrdersManager from './components/OrdersManager';
import CouponsManager from './components/CouponsManager';
import UsersManager from './components/UsersManager';
import SellerApplicationsManager from './components/SellerApplicationsManager';
import Login from './components/Login';
import ArMediaHub from './components/ArMediaHub';
import AiCustomDesigns from './components/AiCustomDesigns';
import VendorFinancials from './components/VendorFinancials';
import LiveSupport from './components/LiveSupport';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify admin status
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        if (adminDoc.exists()) {
          setUser(currentUser);
        } else {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        Loading secure portal...
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'products':
        return <ProductsManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'banners':
        return <BannersManager />;
      case 'orders':
        return <OrdersManager />;
      case 'coupons':
        return <CouponsManager />;
      case 'users':
        return <UsersManager />;
      case 'seller-applications':
        return <SellerApplicationsManager />;
      case 'ar-media-hub':
        return <ArMediaHub />;
      case 'ai-custom-designs':
        return <AiCustomDesigns />;
      case 'vendor-financials':
        return <VendorFinancials />;
      case 'live-support':
        return <LiveSupport />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
