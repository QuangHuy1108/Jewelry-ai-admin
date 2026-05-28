import React, { useState } from 'react';
import { 
  Box, 
  Upload, 
  Settings2, 
  Sparkles, 
  TrendingDown, 
  CheckCircle, 
  Cpu, 
  ArrowRight, 
  Eye, 
  RefreshCw,
  Sliders,
  Play
} from 'lucide-react';

const translations = {
  en: {
    title: "AR & AI Media Studio",
    subtitle: "Coordinate 3D models try-on anchor parameters and generate luxury advertising backdrops",
    tab3d: "3D AR Model Calibration",
    tabImage: "AI Creative Image Studio",
    anchorTitle: "3D AR Asset Coordinator",
    anchorSubtitle: "Upload virtual assets, fine-tune spatial coordinates for mobile rendering, and optimize models using Draco Compression.",
    anchorChoose: "Choose a .GLTF or .GLB file",
    anchorNoFile: "No GLTF model selected.",
    anchorLabel: "Augmented Reality Anchor Type",
    anchorDragDrop: "Drag and drop your 3D jewelry asset here (Max 50MB)",
    dracoTitle: "Draco Mesh Compression Simulation Pipeline",
    dracoDesc: "Run Draco optimization algorithms on the selected mesh asset to shrink bandwidth constraints and load times by up to 90% in mobile viewports.",
    dracoBtn: "Run Draco Pipeline",
    dracoCompacting: "Running Compression...",
    dracoOrig: "Raw Mesh Size",
    dracoOpt: "Compressed Size",
    dracoSave: "Bandwidth Saved",
    dracoTime: "Optimizing Execution Time:",
    dracoStatus: "Pipeline Status:",
    dracoLog: "Optimizing mesh densities, compressing vertices, packing buffers...",
    dracoDelay: "Delay",
    coordTitle: "Spatial Positioning Anchors (mm)",
    coordSubtitle: "Real-time slider controls representing absolute Firestore vector offsets",
    axisX: "Offset X (Ear-to-Ear)",
    axisY: "Offset Y (Vertical Alignment)",
    axisZ: "Offset Z (Depth Offset)",
    scale: "Scale multiplier",
    pitch: "Rotation Pitch (deg)",
    yaw: "Rotation Yaw (deg)",
    roll: "Rotation Roll (deg)",
    verifyAnchorBtn: "Verify Mobile Anchor Profile",
    studioTitle: "AI Background Enhancer Canvas",
    studioSubtitle: "Provide high-end visual product enhancements. Upload a raw jewelry shot and apply generative prompts to replace background textures.",
    studioUpload: "Select Raw Product Photo",
    studioNoImage: "No catalog jewelry image uploaded.",
    studioPrompt: "Generative AI Background Prompt",
    studioPromptPlaceholder: "Describe luxurious scenery (plinth textures, surfaces, light rays...)",
    studioEnhance: "Enhance Background with Gen-AI",
    studioEnhancing: "Generating Background in Cloud Engine...",
    studioLoaded: "Product Image Loaded",
    studioRemove: "Remove file",
    studioSupports: "Supports JPG, PNG, WEBP",
    studioPresets: "Select Premium Studio Presets:",
    studioCompleted: "Generative background replacement completed!",
    splitLabel: "Swipe comparison:",
    beforeText: "BEFORE RAW",
    afterText: "AFTER GEN-AI",
    ear: "Ear (Anchored Earring Try-on)",
    finger: "Finger (Anchored Ring Try-on)",
    neck: "Neck (Anchored Necklace Try-on)",
    wrist: "Wrist (Anchored Bracelet Try-on)"
  },
  vi: {
    title: "Trung Tâm AR & AI",
    subtitle: "Hiệu chỉnh tọa độ neo mô hình 3D thử đồ ảo và tạo ảnh nền quảng cáo sang trọng",
    tab3d: "Hiệu Chỉnh Mô Hình 3D AR",
    tabImage: "Phòng Thiết Kế Ảnh Sáng Tạo AI",
    anchorTitle: "Bộ Điều Phối Tài Nguyên 3D AR",
    anchorSubtitle: "Tải lên tài nguyên ảo, tinh chỉnh tọa độ không gian để hiển thị trên di động và tối ưu hóa lưới bằng Draco.",
    anchorChoose: "Chọn tệp .GLTF hoặc .GLB",
    anchorNoFile: "Chưa chọn mô hình GLTF nào.",
    anchorLabel: "Nhóm Điểm Neo Thử Đồ",
    anchorDragDrop: "Kéo thả tài nguyên trang sức 3D của bạn vào đây (Tối đa 50MB)",
    dracoTitle: "Hệ Thống Nén Lưới Draco",
    dracoDesc: "Chạy thuật toán tối ưu hóa lưới Draco trên tài nguyên đã chọn để giảm thiểu băng thông tải và tăng tốc độ hiển thị trên di động lên đến 90%.",
    dracoBtn: "Chạy Trình Nén Draco",
    dracoCompacting: "Đang tiến hành nén lưới...",
    dracoOrig: "Kích thước gốc",
    dracoOpt: "Kích thước nén",
    dracoSave: "Băng thông giảm",
    dracoTime: "Thời gian xử lý nén:",
    dracoStatus: "Trạng thái tiến trình:",
    dracoLog: "Đang tối ưu hóa mật độ lưới, nén đỉnh, đóng gói bộ đệm phân đoạn...",
    dracoDelay: "Thời gian trễ",
    coordTitle: "Cân Chỉnh Tọa Độ Không Gian (mm)",
    coordSubtitle: "Thanh trượt điều khiển thời gian thực đại diện cho các giá trị sai lệch vector trên Firestore",
    axisX: "Sai lệch X (Chiều rộng tai)",
    axisY: "Sai lệch Y (Độ cao dọc)",
    axisZ: "Sai lệch Z (Chiều sâu trục)",
    scale: "Tỉ lệ kích thước",
    pitch: "Góc nghiêng Pitch (độ)",
    yaw: "Góc xoay Yaw (độ)",
    roll: "Góc cuộn Roll (độ)",
    verifyAnchorBtn: "Xác Minh Cấu Hình Điểm Neo Di Động",
    studioTitle: "Bộ Công Cụ Thiết Kế Nền Ảnh AI",
    studioSubtitle: "Cung cấp các công cụ nâng cao chất lượng ảnh sản phẩm. Tải lên ảnh trang sức thô và dùng prompt AI để thay đổi ảnh nền.",
    studioUpload: "Chọn Ảnh Trang Sức Thô",
    studioNoImage: "Chưa có hình ảnh sản phẩm trang sức nào được tải lên.",
    studioPrompt: "Từ Khóa Prompt Tạo Nền AI Tùy Chỉnh",
    studioPromptPlaceholder: "Mô tả bệ đá sang trọng, phản chiếu ánh sáng, bóng đổ đổ bóng, chất liệu nền...",
    studioEnhance: "Tạo Ảnh Nền Nghệ Thuật Bằng AI",
    studioEnhancing: "Đang tạo ảnh nền nghệ thuật trên máy chủ đám mây...",
    studioLoaded: "Đã tải lên ảnh sản phẩm",
    studioRemove: "Gỡ bỏ ảnh",
    studioSupports: "Hỗ trợ tệp định dạng JPG, PNG, WEBP",
    studioPresets: "Chọn Giao Diện Nền Studio Cao Cấp:",
    studioCompleted: "Hoàn tất tạo ảnh nền nghệ thuật bằng AI!",
    splitLabel: "Thanh so sánh trước sau:",
    beforeText: "ẢNH GỐC THÔ",
    afterText: "NỀN AI SÁNG TẠO",
    ear: "Tai (Thử khuyên tai ảo)",
    finger: "Ngón Tay (Thử nhẫn ảo)",
    neck: "Cổ (Thử vòng cổ ảo)",
    wrist: "Cổ Tay (Thử vòng tay ảo)"
  }
};

export default function ArMediaHub({ locale = 'en' }) {
  const t = translations[locale] || translations.en;
  
  // --- 3D AR Asset Hub State ---
  const [modelFile, setModelFile] = useState(null);
  const [anchorType, setAnchorType] = useState('Finger'); // 'Ear' | 'Finger' | 'Neck' | 'Wrist'
  const [coordinates, setCoordinates] = useState({
    x: 0.00,
    y: 1.20,
    z: -0.50,
    scale: 1.00,
    pitch: 0,
    yaw: 90,
    roll: 0
  });

  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState(null);

  // --- Background Enhancer State ---
  const [sourceImage, setSourceImage] = useState(null);
  const [generativePrompt, setGenerativePrompt] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState(false);
  const [beforeAfterSplit, setBeforeAfterSplit] = useState(50); // 0 to 100 percentage slider

  // --- Preset Prompts ---
  const promptPresets = [
    { label: 'Obsidian Pedestal', text: 'placed on dark obsidian polished stone plinth, gold leaf cracks, dramatic backlighting, dark smoke fog, hyper-detailed 8k' },
    { label: 'Champagne Silk', text: 'soft champagne silk drapery base, luxurious warm studio lighting, cinematic shallow depth of field, delicate royal shadows' },
    { label: 'White Marble Spotlight', text: 'on clean white Carrara marble stand, reflective surface, bright overhead jewelry studio lighting, soft shadows, pristine luxury' },
    { label: 'Sand & Quartz', text: 'placed on textured pristine white sand, natural unrefined quartz crystals, warm morning sunlight, organic leaf shadows' }
  ];

  const handleCoordinateChange = (axis, val) => {
    setCoordinates(prev => ({
      ...prev,
      [axis]: parseFloat(val) || 0
    }));
  };

  const handle3DUploadSimulate = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModelFile(file);
      setCompressionResult(null);
    }
  };

  const runDracoCompression = () => {
    if (!modelFile) return;
    setCompressing(true);
    setCompressionResult(null);

    // Simulate 3D compression execution
    setTimeout(() => {
      const originalSize = modelFile.size ? (modelFile.size / 1024 / 1024) : 12.84;
      const ratio = 0.125 + Math.random() * 0.05; // 83% - 87% savings
      const compressedSize = originalSize * ratio;
      const saving = (1 - ratio) * 100;

      setCompressionResult({
        rawSize: originalSize.toFixed(2),
        optimizedSize: compressedSize.toFixed(2),
        savingsRatio: saving.toFixed(1),
        processingTime: (150 + Math.random() * 200).toFixed(0),
        status: 'DRACO OPTIMIZED'
      });
      setCompressing(false);
    }, 1800);
  };

  const handleImageUploadSimulate = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result);
        setEnhancedResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const runBackgroundEnhancer = () => {
    if (!sourceImage || !generativePrompt) return;
    setEnhancing(true);

    setTimeout(() => {
      setEnhancedResult(true);
      setEnhancing(false);
    }, 2200);
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title" style={{ fontSize: '2.25rem', color: 'var(--text-primary)' }}>{t.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>{t.subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* --- LEFT AXIS: 3D AR Asset Hub --- */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box size={22} color="var(--gold-primary)" />
            {t.anchorTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            {t.anchorSubtitle}
          </p>

          {/* Model Upload Area */}
          <div style={{ 
            border: '1px dashed rgba(212,175,55,0.2)', 
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px', 
            padding: '24px', 
            textAlign: 'center',
            marginBottom: '24px',
            position: 'relative'
          }}>
            <input 
              type="file" 
              accept=".gltf,.glb" 
              id="gltf-upload" 
              onChange={handle3DUploadSimulate}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
            <Upload size={32} color="var(--gold-primary)" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
            <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {modelFile ? modelFile.name : t.anchorChoose}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
              {t.anchorDragDrop}
            </p>
          </div>

          {modelFile && (
            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
              <button 
                disabled={compressing}
                onClick={runDracoCompression}
                className="btn btn-primary" 
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
              >
                {compressing ? (
                  <>
                    <RefreshCw size={16} className="spin" style={{ marginRight: '6px' }} />
                    {t.dracoCompacting}
                  </>
                ) : (
                  <>
                    <Cpu size={16} style={{ marginRight: '6px' }} />
                    {t.dracoBtn}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Draco Pipeline Compression Output */}
          {compressing && (
            <div className="glass-panel" style={{ background: '#0D0D0E', border: '1px solid rgba(212,175,55,0.1)', marginBottom: '24px', padding: '16px 20px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={14} className="spin" /> {t.dracoLog}
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--gold-primary)', height: '100%', width: '65%', animation: 'pulse 1.5s infinite' }} />
              </div>
            </div>
          )}

          {compressionResult && (
            <div className="glass-panel" style={{ background: '#0D0D0E', border: '1px solid rgba(76,175,80,0.2)', marginBottom: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> {compressionResult.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.dracoDelay}: {compressionResult.processingTime}ms</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.dracoOrig}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{compressionResult.rawSize} MB</p>
                </div>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.dracoOpt}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gold-primary)', marginTop: '4px' }}>{compressionResult.optimizedSize} MB</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.dracoSave}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-green)', marginTop: '4px' }}>-{compressionResult.savingsRatio}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Core Target Anchor Configurations */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            <div className="form-group">
              <label className="form-label">{t.anchorLabel}</label>
              <select 
                className="form-select" 
                value={anchorType}
                onChange={e => setAnchorType(e.target.value)}
              >
                <option value="Ear">{t.ear}</option>
                <option value="Finger">{t.finger}</option>
                <option value="Neck">{t.neck}</option>
                <option value="Wrist">{t.wrist}</option>
              </select>
            </div>

            {/* Translation Offsets Fine-Tuning */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sliders size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t.coordSubtitle}</span>
              </div>

              {/* Slider Controls */}
              {['x', 'y', 'z'].map(axis => (
                <div key={axis} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <span style={{ width: '80px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    {axis === 'x' ? t.axisX : axis === 'y' ? t.axisY : t.axisZ}:
                  </span>
                  <input 
                    type="range" 
                    min="-5.00" 
                    max="5.00" 
                    step="0.05"
                    value={coordinates[axis]} 
                    onChange={e => handleCoordinateChange(axis, e.target.value)}
                    style={{ flex: 1, accentColor: 'var(--gold-primary)' }}
                  />
                  <input 
                    type="number" 
                    step="0.01"
                    value={coordinates[axis]} 
                    onChange={e => handleCoordinateChange(axis, e.target.value)}
                    style={{ 
                      width: '75px', 
                      background: 'rgba(0,0,0,0.3)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '6px', 
                      padding: '4px 8px',
                      color: 'var(--text-primary)',
                      textAlign: 'right',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              ))}

              {/* Rotation & Scale fine configurations */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>{t.scale}</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={coordinates.scale}
                    onChange={e => handleCoordinateChange('scale', e.target.value)}
                    style={{ padding: '8px', fontSize: '0.85rem' }}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>{t.pitch}</label>
                  <input 
                    type="number" 
                    value={coordinates.pitch}
                    onChange={e => handleCoordinateChange('pitch', e.target.value)}
                    style={{ padding: '8px', fontSize: '0.85rem' }}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={!modelFile}
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '16px', gap: '8px', justifyContent: 'center' }}
            >
              <Eye size={16} />
              <span>{t.verifyAnchorBtn}</span>
            </button>
          </div>
        </div>

        {/* --- RIGHT AXIS: AI Background Enhancer Canvas --- */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="var(--gold-primary)" />
            {t.studioTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            {t.studioSubtitle}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            
            {/* Image Selection Area */}
            <div style={{ 
              border: '1px dashed rgba(212,175,55,0.2)', 
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'center',
              position: 'relative',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {sourceImage ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '0 12px' }}>
                  <img src={sourceImage} alt="Raw product" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{t.studioLoaded}</p>
                    <button 
                      onClick={() => { setSourceImage(null); setEnhancedResult(false); }}
                      style={{ border: 'none', background: 'none', color: '#F44336', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginTop: '4px' }}
                    >{t.studioRemove}</button>
                  </div>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="image-upload" 
                    onChange={handleImageUploadSimulate}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                  <Upload size={24} color="var(--gold-primary)" style={{ marginBottom: '8px', opacity: 0.8 }} />
                  <p style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.studioUpload}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>{t.studioSupports}</p>
                </>
              )}
            </div>

            {/* Prompt input with preset buttons */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t.studioPrompt}</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder={t.studioPromptPlaceholder}
                value={generativePrompt}
                onChange={e => setGenerativePrompt(e.target.value)}
                style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
              />

              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>{t.studioPresets}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {promptPresets.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setGenerativePrompt(preset.text)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid rgba(212,175,55,0.15)',
                        background: 'rgba(212,175,55,0.04)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--gold-primary)'; e.target.style.background = 'rgba(212,175,55,0.08)'; }}
                      onMouseLeave={e => { e.target.style.borderColor = 'rgba(212,175,55,0.15)'; e.target.style.background = 'rgba(212,175,55,0.04)'; }}
                    >
                      ✦ {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sourceImage && generativePrompt && (
              <button
                disabled={enhancing}
                onClick={runBackgroundEnhancer}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {enhancing ? (
                  <>
                    <RefreshCw className="spin" size={16} style={{ marginRight: '6px' }} />
                    {t.studioEnhancing}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} style={{ marginRight: '6px' }} />
                    {t.studioEnhance}
                  </>
                )}
              </button>
            )}

            {/* Before / After Interactive Visual Swipe Slider */}
            {enhancedResult && !enhancing && (
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="var(--accent-green)" /> {t.studioCompleted}
                </p>

                {/* Combined Slider Canvas Container */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '240px', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(212,175,55,0.2)' 
                }}>
                  {/* AFTER: Generative Enhancements Background */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, #2d2716 0%, #0c0a06 100%)', // luxury glowing gold plinth mock
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    inset: 0
                  }}>
                    <img 
                      src={sourceImage} 
                      alt="Product" 
                      style={{ 
                        width: '140px', 
                        height: '140px', 
                        objectFit: 'contain', 
                        filter: 'drop-shadow(0 15px 25px rgba(212,175,55,0.4))' // gold shadow
                      }} 
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '12px', 
                      right: '12px', 
                      background: 'rgba(0,0,0,0.6)', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: 'var(--gold-primary)',
                      border: '1px solid rgba(212,175,55,0.2)'
                    }}>{t.afterText}</div>
                  </div>

                  {/* BEFORE: Raw Photo clipping mask */}
                  <div style={{
                    width: `${beforeAfterSplit}%`,
                    height: '100%',
                    background: '#1d1d1f', // plain gray background typical of raw uploads
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    borderRight: '2px solid var(--gold-primary)'
                  }}>
                    <div style={{ width: '400px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                      <img 
                        src={sourceImage} 
                        alt="Raw product" 
                        style={{ 
                          width: '140px', 
                          height: '140px', 
                          objectFit: 'contain',
                          filter: 'opacity(0.8)'
                        }} 
                      />
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '12px', 
                      left: '12px', 
                      background: 'rgba(0,0,0,0.6)', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)'
                    }}>{t.beforeText}</div>
                  </div>
                </div>

                {/* Range Input controlling before/after split percentage */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.splitLabel}</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={beforeAfterSplit} 
                    onChange={e => setBeforeAfterSplit(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--gold-primary)' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>{beforeAfterSplit}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
