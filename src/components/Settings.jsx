import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Languages, 
  Monitor, 
  Sliders, 
  ShieldAlert, 
  Cloud, 
  Clock, 
  ToggleLeft, 
  ToggleRight, 
  LogOut, 
  Cpu, 
  HelpCircle,
  Check
} from 'lucide-react';

const translations = {
  en: {
    title: "System Settings",
    subtitle: "Customize system visual parameters, language preferences, security consoles, and backups",
    tabInterface: "Interface & Aesthetics",
    tabLocalization: "Language & Locale",
    tabSystem: "Advanced System & Backups",
    
    // Interface Customizer
    brightnessTitle: "Aesthetic Brightness & Density",
    brightnessSubtitle: "Swap context luminance preset variables while preserving Champagne Gold accents",
    presetObsidian: "Deep Obsidian",
    presetObsidianDesc: "AMOLED Black #0A0A0B",
    presetDim: "Mystic Dim",
    presetDimDesc: "Carbon Slate #131316",
    presetSolar: "Solar Light",
    presetSolarDesc: "Ivory Contrast #FAF9F6",
    
    glassTitle: "Backdrop Glassmorphism Blur",
    glassSubtitle: "Fine-tune sidebar and modal background blur. Keep under 12px per performance guard rails.",
    glassWarning: "⚠️ Backdrop blur above 12px exceeds GPU performance guard rules and may introduce visual latency on legacy devices.",
    
    fontScaleTitle: "System Interface Font Scale",
    fontScaleSubtitle: "Adjust core font sizing dynamically across main layout containers.",
    
    // Localization Settings
    langTitle: "Language Selector",
    langSubtitle: "Set global dashboard localized dictionaries. Instantly updates views.",
    langSelect: "Select Preferred Language",
    
    // Advanced System Settings
    sysTitle: "Advanced Operational Flags",
    sysSubtitle: "Manage daily cron processes, inactivity security locks, and platform visibility.",
    backupLabel: "Automated Daily Firestore Backups",
    backupDesc: "Enables nightly schema copies and configuration merges.",
    timeoutLabel: "Inactivity Auto-Lock Timer",
    timeoutDesc: "Triggers automated secure session lockouts during idleness.",
    maintenanceLabel: "System Maintenance Mode",
    maintenanceDesc: "Hides customer mobile app catalogs and displays a luxury notice.",
    
    // Logout Card
    logoutTitle: "Destruct Session Authorization",
    logoutDesc: "Sign out of your active administrative console and delete temporary web session records.",
    logoutBtn: "Terminate Active Session",
    
    // General Alerts
    saveAlert: "Configurations updated successfully!"
  },
  vi: {
    title: "Thiết lập Hệ thống",
    subtitle: "Tùy chỉnh thông số giao diện hiển thị, ngôn ngữ ưu tiên, cấu hình bảo mật và sao lưu dữ liệu",
    tabInterface: "Giao diện & Thẩm mỹ",
    tabLocalization: "Ngôn ngữ & Vùng miền",
    tabSystem: "Cấu hình & Sao lưu Nâng cao",
    
    // Interface Customizer
    brightnessTitle: "Độ sáng & Mật độ Giao diện",
    brightnessSubtitle: "Thay đổi mức độ sáng tối của hệ thống nhưng vẫn giữ nguyên đường nét Vàng Champagne",
    presetObsidian: "Obsidian Siêu tối",
    presetObsidianDesc: "AMOLED Đen sâu #0A0A0B",
    presetDim: "Mờ ảo Huyền bí",
    presetDimDesc: "Đen Slate Carbon #131316",
    presetSolar: "Ánh sáng Thái dương",
    presetSolarDesc: "Trắng ngà Tương phản #FAF9F6",
    
    glassTitle: "Độ mờ Kính mờ (Backdrop Blur)",
    glassSubtitle: "Tinh chỉnh độ mờ nền của sidebar và modals. Giữ dưới 12px để bảo vệ hiệu năng đồ họa.",
    glassWarning: "⚠️ Độ mờ nền trên 12px vượt quá quy tắc hiệu năng GPU và có thể gây giật lag trên các thiết bị cũ.",
    
    fontScaleTitle: "Cỡ chữ Giao diện Hệ thống",
    fontScaleSubtitle: "Điều chỉnh kích thước cỡ chữ hiển thị linh hoạt trên các khung bảng biểu.",
    
    // Localization Settings
    langTitle: "Lựa chọn Ngôn ngữ",
    langSubtitle: "Cấu hình ngôn ngữ cho bảng điều khiển toàn cầu. Cập nhật dữ liệu ngay lập tức.",
    langSelect: "Chọn Ngôn ngữ Ưu tiên",
    
    // Advanced System Settings
    sysTitle: "Tham số Vận hành Nâng cao",
    sysSubtitle: "Quản lý tiến trình sao lưu định kỳ, tự động khóa bảo mật và trạng thái hiển thị của nền tảng.",
    backupLabel: "Tự động Sao lưu Firestore Hàng ngày",
    backupDesc: "Kích hoạt sao lưu tự động cấu trúc bảng dữ liệu và cấu hình hàng đêm.",
    timeoutLabel: "Thời gian Tự động Khóa khi Treo máy",
    timeoutDesc: "Tự động đăng xuất và khóa phiên làm việc an toàn khi không hoạt động.",
    maintenanceLabel: "Chế độ Bảo trì Hệ thống",
    maintenanceDesc: "Tạm thời đóng danh mục trên app mobile của khách hàng và hiện thông báo bảo trì sang trọng.",
    
    // Logout Card
    logoutTitle: "Hủy ủy quyền phiên làm việc",
    logoutDesc: "Đăng xuất khỏi tài khoản quản trị viên và xóa sạch lịch sử phiên làm việc tạm thời trên web.",
    logoutBtn: "Chấm dứt Phiên Hoạt động",
    
    // General Alerts
    saveAlert: "Cấu hình hệ thống được cập nhật thành công!"
  }
};


export default function Settings({ onLogout, locale, onLocaleChange }) {
  const [activeTab, setActiveTab] = useState('interface'); // 'interface' | 'localization' | 'system'
  const [brightness, setBrightness] = useState(() => localStorage.getItem('glowup_admin_brightness') || 'obsidian');
  const [glassBlur, setGlassBlur] = useState(() => parseInt(localStorage.getItem('glowup_admin_glassblur')) || 12);
  const [fontScale, setFontScale] = useState(() => parseInt(localStorage.getItem('glowup_admin_fontscale')) || 14);
  
  // Advanced settings state
  const [backupsEnabled, setBackupsEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15m');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const t = translations[locale] || translations.en;

  // --- Dynamic Brightness Styles Setter ---
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('glowup_admin_brightness', brightness);
    
    if (brightness === 'obsidian') {
      root.style.setProperty('--bg-base', '#0A0A0B');
      root.style.setProperty('--bg-main', '#0A0A0B');
      root.style.setProperty('--bg-surface', '#111113');
      root.style.setProperty('--bg-surface-hover', '#1c1c1f');
      root.style.setProperty('--text-primary', '#e4e4e7');
      root.style.setProperty('--text-secondary', '#a1a1aa');
      root.style.setProperty('--text-muted', '#52525b');
      root.style.setProperty('--border-color', 'rgba(212, 175, 55, 0.12)');
    } else if (brightness === 'dim') {
      root.style.setProperty('--bg-base', '#131316');
      root.style.setProperty('--bg-main', '#131316');
      root.style.setProperty('--bg-surface', '#1a1a20');
      root.style.setProperty('--bg-surface-hover', '#262630');
      root.style.setProperty('--text-primary', '#dcdcdc');
      root.style.setProperty('--text-secondary', '#9ca3af');
      root.style.setProperty('--text-muted', '#6b7280');
      root.style.setProperty('--border-color', 'rgba(212, 175, 55, 0.18)');
    } else if (brightness === 'solar') {
      root.style.setProperty('--bg-base', '#FAF9F6');
      root.style.setProperty('--bg-main', '#FAF9F6');
      root.style.setProperty('--bg-surface', '#ffffff');
      root.style.setProperty('--bg-surface-hover', '#f3f2ee');
      root.style.setProperty('--text-primary', '#111111');
      root.style.setProperty('--text-secondary', '#4b5563');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--border-color', 'rgba(212, 175, 55, 0.3)');
    }
  }, [brightness]);

  // --- Dynamic Glassmorphism Setter ---
  useEffect(() => {
    localStorage.setItem('glowup_admin_glassblur', glassBlur);
    const root = document.documentElement;
    root.style.setProperty('--bg-glass', `rgba(10, 10, 11, ${brightness === 'solar' ? '0.04' : '0.2'})`);
    // Dynamic sidebar / modal backdrop blur overrides
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(el => {
      el.style.backdropFilter = `blur(${glassBlur}px)`;
      el.style.webkitBackdropFilter = `blur(${glassBlur}px)`;
    });
  }, [glassBlur, brightness]);

  // --- Font Scaling Setter ---
  useEffect(() => {
    localStorage.setItem('glowup_admin_fontscale', fontScale);
    document.documentElement.style.fontSize = `${(fontScale / 14) * 100}%`;
  }, [fontScale]);

  // --- Language Change Handler ---
  const handleLocaleChange = (newLocale) => {
    onLocaleChange(newLocale);
  };

  return (
    <div>
      {/* Title block */}
      <div className="header-bar">
        <div>
          <h1 className="page-title" style={{ fontSize: '2.25rem', color: 'var(--text-primary)' }}>{t.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>{t.subtitle}</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '16px', marginBottom: '28px' }}>
        {[
          { id: 'interface', label: t.tabInterface, icon: Sliders },
          { id: 'localization', label: t.tabLocalization, icon: Languages },
          { id: 'system', label: t.tabSystem, icon: Monitor },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                color: isSelected ? '#000' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* --- TAB 1: Interface Customizer --- */}
        {activeTab === 'interface' && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Brightness Presets */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Monitor size={18} color="var(--gold-primary)" />
                {t.brightnessTitle}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{t.brightnessSubtitle}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { id: 'obsidian', label: t.presetObsidian, desc: t.presetObsidianDesc, color: '#0A0A0B' },
                  { id: 'dim', label: t.presetDim, desc: t.presetDimDesc, color: '#131316' },
                  { id: 'solar', label: t.presetSolar, desc: t.presetSolarDesc, color: '#FAF9F6' }
                ].map(p => {
                  const isSelected = brightness === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setBrightness(p.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.04)',
                        background: isSelected ? 'rgba(212,175,55,0.06)' : 'rgba(0,0,0,0.15)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <span style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="#000" />
                        </span>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: p.color, border: '1px solid var(--gold-primary)' }} />
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.label}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Backdrop blur Glassmorphism controller */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>{t.glassTitle}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{t.glassSubtitle}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <input 
                  type="range" 
                  min="0" 
                  max="24" 
                  value={glassBlur}
                  onChange={e => setGlassBlur(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--gold-primary)',
                    cursor: 'pointer',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                />
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--gold-primary)', minWidth: '40px', textAlign: 'right' }}>{glassBlur}px</span>
              </div>

              {glassBlur > 12 && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: '500' }}>{t.glassWarning}</p>
                </div>
              )}
            </div>

            {/* Font scaling controller */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>{t.fontScaleTitle}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{t.fontScaleSubtitle}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <input 
                  type="range" 
                  min="12" 
                  max="20" 
                  value={fontScale}
                  onChange={e => setFontScale(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--gold-primary)',
                    cursor: 'pointer',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                />
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--gold-primary)', minWidth: '40px', textAlign: 'right' }}>{fontScale}px</span>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: Language & Locale --- */}
        {activeTab === 'localization' && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Languages size={18} color="var(--gold-primary)" />
                {t.langTitle}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>{t.langSubtitle}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{t.langSelect}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { id: 'en', label: 'English (EN)' },
                    { id: 'vi', label: 'Tiếng Việt (VI)' }
                  ].map(lang => {
                    const isSelected = locale === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => handleLocaleChange(lang.id)}
                        style={{
                          flex: 1,
                          padding: '12px 8px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.04)',
                          background: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                          color: isSelected ? '#000' : 'var(--text-primary)',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: Advanced System & Backups --- */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Operational configuration switches */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="var(--gold-primary)" />
                {t.sysTitle}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t.sysSubtitle}</p>

              {/* Backups switch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t.backupLabel}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.backupDesc}</p>
                </div>
                <button 
                  onClick={() => setBackupsEnabled(!backupsEnabled)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer' }}
                >
                  {backupsEnabled ? <ToggleRight size={44} /> : <ToggleLeft size={44} style={{ opacity: 0.3 }} />}
                </button>
              </div>

              {/* Inactivity lock dropdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t.timeoutLabel}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.timeoutDesc}</p>
                </div>
                <select 
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-primary)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="5m">5 Minutes</option>
                  <option value="15m">15 Minutes</option>
                  <option value="30m">30 Minutes</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Maintenance mode switch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t.maintenanceLabel}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.maintenanceDesc}</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer' }}
                >
                  {maintenanceMode ? <ToggleRight size={44} /> : <ToggleLeft size={44} style={{ opacity: 0.3 }} />}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* --- INTEGRATED SESSION DESTRUCTION (LOGOUT MODAL CARD) --- */}
      <div 
        style={{ 
          border: '1px solid var(--gold-primary)', 
          background: 'rgba(212,175,55,0.03)', 
          borderRadius: '16px', 
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(212,175,55,0.05)'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={20} color="var(--gold-primary)" />
            {t.logoutTitle}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {t.logoutDesc}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="btn"
          style={{
            padding: '12px 24px',
            fontSize: '0.875rem',
            fontWeight: '700',
            background: 'var(--gold-primary)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(212,175,55,0.3)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <LogOut size={16} />
          {t.logoutBtn}
        </button>
      </div>

    </div>
  );
}
