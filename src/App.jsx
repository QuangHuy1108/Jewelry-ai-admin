import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import ProductsManager from './components/ProductsManager';
import CategoriesManager from './components/CategoriesManager';
import BannersManager from './components/BannersManager';
import OrdersManager from './components/OrdersManager';
import CouponsManager from './components/CouponsManager';
import UsersManager from './components/UsersManager';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

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
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
