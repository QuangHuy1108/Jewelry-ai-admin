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

export default function ArMediaHub() {
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
          <h1 className="page-title" style={{ fontSize: '2.25rem', color: 'var(--text-primary)' }}>AR & AI Media Studio</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Manage 3D augmented reality models and run visual generative background assets</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* --- LEFT AXIS: 3D AR Asset Hub --- */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box size={22} color="var(--gold-primary)" />
            3D AR Asset Coordinator
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Upload virtual assets, fine-tune spatial coordinates for mobile rendering, and optimize models using Draco Compression.
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
              {modelFile ? modelFile.name : 'Choose a .GLTF or .GLB file'}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
              Drag and drop your 3D jewelry asset here (Max 50MB)
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
                    Running Compression...
                  </>
                ) : (
                  <>
                    <Cpu size={16} style={{ marginRight: '6px' }} />
                    Run Draco Pipeline
                  </>
                )}
              </button>
            </div>
          )}

          {/* Draco Pipeline Compression Output */}
          {compressing && (
            <div className="glass-panel" style={{ background: '#0D0D0E', border: '1px solid rgba(212,175,55,0.1)', marginBottom: '24px', padding: '16px 20px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={14} className="spin" /> Optimize mesh densities, compress vertices, packing buffers...
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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delay: {compressionResult.processingTime}ms</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Raw Mesh Size</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{compressionResult.rawSize} MB</p>
                </div>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compressed Size</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gold-primary)', marginTop: '4px' }}>{compressionResult.optimizedSize} MB</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bandwidth Saved</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-green)', marginTop: '4px' }}>-{compressionResult.savingsRatio}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Core Target Anchor Configurations */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            <div className="form-group">
              <label className="form-label">Augmented Reality Anchor Type</label>
              <select 
                className="form-select" 
                value={anchorType}
                onChange={e => setAnchorType(e.target.value)}
              >
                <option value="Ear">Ear (Anchored Earring Try-on)</option>
                <option value="Finger">Finger (Anchored Ring Try-on)</option>
                <option value="Neck">Neck (Anchored Necklace Try-on)</option>
                <option value="Wrist">Wrist (Anchored Bracelet Try-on)</option>
              </select>
            </div>

            {/* Translation Offsets Fine-Tuning */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sliders size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Spatial Positioning Anchors (mm)</span>
              </div>

              {/* Slider Controls */}
              {['x', 'y', 'z'].map(axis => (
                <div key={axis} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <span style={{ width: '60px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    Offset {axis}:
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
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Scale multiplier</label>
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
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Rotation Pitch (deg)</label>
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
              <span>Verify Mobile Anchor Profile</span>
            </button>
          </div>
        </div>

        {/* --- RIGHT AXIS: AI Background Enhancer Canvas --- */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="var(--gold-primary)" />
            AI Background Enhancer Canvas
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Provide high-end visual product enhancements. Upload a raw jewelry shot and apply generative prompts to replace background textures.
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
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-all' }}>Product Image Loaded</p>
                    <button 
                      onClick={() => { setSourceImage(null); setEnhancedResult(false); }}
                      style={{ border: 'none', background: 'none', color: '#F44336', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginTop: '4px' }}
                    >Remove file</button>
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
                  <p style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Select Raw Product Photo</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>Supports JPG, PNG, WEBP</p>
                </>
              )}
            </div>

            {/* Prompt input with preset buttons */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Generative AI Background Prompt</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Describe luxurious scenery (plinth textures, surfaces, light rays...)"
                value={generativePrompt}
                onChange={e => setGenerativePrompt(e.target.value)}
                style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
              />

              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Select Premium Studio Presets:</p>
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
                    Generating Background in Cloud Engine...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} style={{ marginRight: '6px' }} />
                    Enhance Background with Gen-AI
                  </>
                )}
              </button>
            )}

            {/* Before / After Interactive Visual Swipe Slider */}
            {enhancedResult && !enhancing && (
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="var(--accent-green)" /> Generative background replacement completed!
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
                    }}>AFTER GEN-AI</div>
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
                    }}>BEFORE RAW</div>
                  </div>
                </div>

                {/* Range Input controlling before/after split percentage */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Swipe comparison:</span>
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
