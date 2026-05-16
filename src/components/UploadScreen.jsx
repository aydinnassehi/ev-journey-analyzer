import { useState, useRef } from 'react';
import { Upload, BatteryCharging, AlertCircle, Sparkles, Settings2, ChevronDown, ChevronUp } from 'lucide-react';

function UploadScreen({ onUpload, onDemo, loading, error, settings, onSettingsChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      onUpload(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  const updateSetting = (key, value) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className="upload-screen">
      <div className="upload-container">
        <div className="logo">
          <div className="car-illustration">
            <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4d4dc"/>
                  <stop offset="40%" stopColor="#b8b8c0"/>
                  <stop offset="100%" stopColor="#909098"/>
                </linearGradient>
                <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a2a3a"/>
                  <stop offset="100%" stopColor="#14141e"/>
                </linearGradient>
                <linearGradient id="headlightGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fbbf24"/>
                  <stop offset="100%" stopColor="#f59e0b"/>
                </linearGradient>
                <linearGradient id="taillightGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#dc2626"/>
                  <stop offset="100%" stopColor="#ef4444"/>
                </linearGradient>
                <filter id="shadow" x="-5%" y="-5%" width="110%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.35"/>
                </filter>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Ground / road reflection */}
              <ellipse cx="300" cy="245" rx="260" ry="18" fill="#0a0a14" opacity="0.6"/>

              <g filter="url(#shadow)">
                {/* Car body - main shape (Polestar 2 fastback sedan) */}
                <path d="M100 200 L100 175 Q100 165 108 160 L160 155 L200 120 Q210 108 225 100 L280 92 Q300 88 320 90 L380 92 Q400 94 415 105 L455 148 L490 155 Q500 158 500 165 L500 200 Q500 208 492 208 L460 208 Q455 220 440 220 Q425 220 420 208 L385 208 Q380 220 365 220 Q350 220 345 208 L255 208 Q250 220 235 220 Q220 220 215 208 L130 208 Q108 208 100 200 Z" fill="url(#bodyGrad)" stroke="#777" strokeWidth="0.8"/>

                {/* Roof line */}
                <path d="M200 120 Q210 108 225 100 L280 92 Q300 88 320 90 L380 92 Q400 94 415 105" fill="none" stroke="#aaa" strokeWidth="1"/>

                {/* Front window (driver side) */}
                <path d="M208 116 L235 103 L280 95 Q295 92 305 94 L305 148 L175 148 Z" fill="url(#windowGrad)" stroke="#555" strokeWidth="0.6"/>

                {/* Rear window */}
                <path d="M310 94 L375 96 Q395 98 408 106 L445 145 L310 148 Z" fill="url(#windowGrad)" stroke="#555" strokeWidth="0.6"/>

                {/* B-pillar */}
                <rect x="303" y="93" width="5" height="56" fill="#888" rx="1"/>

                {/* C-pillar */}
                <path d="M445 145 L455 148 L455 140 L440 135 Z" fill="#888"/>

                {/* Front door line */}
                <line x1="308" y1="148" x2="308" y2="195" stroke="#999" strokeWidth="0.5" opacity="0.5"/>

                {/* Rear door line */}
                <line x1="375" y1="148" x2="378" y2="195" stroke="#999" strokeWidth="0.5" opacity="0.5"/>

                {/* Door handles */}
                <rect x="255" y="168" width="18" height="3" rx="1.5" fill="#aaa" opacity="0.6"/>
                <rect x="330" y="168" width="18" height="3" rx="1.5" fill="#aaa" opacity="0.6"/>

                {/* Hood / bonnet */}
                <path d="M455 148 L490 155 Q500 158 500 165 L500 170 Q500 172 495 172 L455 170 Z" fill="#c8c8d0" stroke="#888" strokeWidth="0.5"/>

                {/* Front bumper */}
                <path d="M490 170 Q500 172 500 180 L500 200 Q500 208 492 208 L475 208 Q470 200 470 190 L470 175 Z" fill="#808088" stroke="#777" strokeWidth="0.5"/>

                {/* Rear bumper */}
                <path d="M100 200 Q100 208 108 208 L125 208 Q130 200 130 190 L130 175 Q130 172 125 170 L108 172 Q100 172 100 180 Z" fill="#808088" stroke="#777" strokeWidth="0.5"/>

                {/* Headlight - Thor's Hammer DRL */}
                <g filter="url(#glow)">
                  <rect x="485" y="158" width="15" height="5" rx="2" fill="url(#headlightGrad)" opacity="0.9"/>
                  <rect x="485" y="164" width="15" height="3" rx="1.5" fill="#fff" opacity="0.7"/>
                  {/* Vertical DRL strip */}
                  <rect x="495" y="148" width="3" height="14" rx="1" fill="url(#headlightGrad)" opacity="0.8"/>
                </g>

                {/* Taillight - vertical LED */}
                <g filter="url(#glow)">
                  <rect x="100" y="158" width="14" height="5" rx="2" fill="url(#taillightGrad)" opacity="0.9"/>
                  {/* Vertical taillight strip */}
                  <rect x="102" y="148" width="3" height="14" rx="1" fill="url(#taillightGrad)" opacity="0.8"/>
                </g>

                {/* Front grille area (closed, EV) */}
                <rect x="465" y="175" width="30" height="12" rx="3" fill="#606068" stroke="#777" strokeWidth="0.5"/>

                {/* Polestar badge on front */}
                <circle cx="480" cy="182" r="4" fill="none" stroke="#ccc" strokeWidth="0.8"/>
                <line x1="480" y1="178" x2="480" y2="186" stroke="#ccc" strokeWidth="0.5"/>
                <line x1="476" y1="182" x2="484" y2="182" stroke="#ccc" strokeWidth="0.5"/>

                {/* Side mirror */}
                <ellipse cx="175" cy="155" rx="8" ry="5" fill="#b0b0b8" stroke="#888" strokeWidth="0.5"/>
                <ellipse cx="448" cy="155" rx="8" ry="5" fill="#b0b0b8" stroke="#888" strokeWidth="0.5"/>

                {/* Front wheel */}
                <g>
                  <circle cx="435" cy="210" r="24" fill="#1a1a22" stroke="#333" strokeWidth="1.5"/>
                  <circle cx="435" cy="210" r="18" fill="#2a2a32" stroke="#444" strokeWidth="1"/>
                  <circle cx="435" cy="210" r="12" fill="#333" stroke="#555" strokeWidth="0.8"/>
                  {/* Rim spokes */}
                  <line x1="435" y1="198" x2="435" y2="222" stroke="#555" strokeWidth="0.8"/>
                  <line x1="423" y1="210" x2="447" y2="210" stroke="#555" strokeWidth="0.8"/>
                  <line x1="427" y1="202" x2="443" y2="218" stroke="#555" strokeWidth="0.8"/>
                  <line x1="443" y1="202" x2="427" y2="218" stroke="#555" strokeWidth="0.8"/>
                  <circle cx="435" cy="210" r="4" fill="#666" stroke="#888" strokeWidth="0.5"/>
                </g>

                {/* Rear wheel */}
                <g>
                  <circle cx="225" cy="210" r="24" fill="#1a1a22" stroke="#333" strokeWidth="1.5"/>
                  <circle cx="225" cy="210" r="18" fill="#2a2a32" stroke="#444" strokeWidth="1"/>
                  <circle cx="225" cy="210" r="12" fill="#333" stroke="#555" strokeWidth="0.8"/>
                  {/* Rim spokes */}
                  <line x1="225" y1="198" x2="225" y2="222" stroke="#555" strokeWidth="0.8"/>
                  <line x1="213" y1="210" x2="237" y2="210" stroke="#555" strokeWidth="0.8"/>
                  <line x1="217" y1="202" x2="233" y2="218" stroke="#555" strokeWidth="0.8"/>
                  <line x1="233" y1="202" x2="217" y2="218" stroke="#555" strokeWidth="0.8"/>
                  <circle cx="225" cy="210" r="4" fill="#666" stroke="#888" strokeWidth="0.5"/>
                </g>

                {/* Lower body line / rocker panel */}
                <line x1="130" y1="195" x2="470" y2="195" stroke="#888" strokeWidth="0.5" opacity="0.4"/>

                {/* Front fender line */}
                <path d="M455 170 Q460 180 460 195" fill="none" stroke="#999" strokeWidth="0.5" opacity="0.3"/>

                {/* Character line along side */}
                <path d="M130 175 Q200 172 300 170 Q400 172 460 175" fill="none" stroke="#aaa" strokeWidth="0.6" opacity="0.4"/>
              </g>

              {/* Ground line */}
              <line x1="50" y1="235" x2="550" y2="235" stroke="#2a2a3a" strokeWidth="1" opacity="0.3"/>

              {/* Label */}
              <text x="300" y="265" text-anchor="middle" fill="#888" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="2">POLESTAR 2</text>
            </svg>
          </div>
          <div className="logo-text">
            <BatteryCharging size={32} className="logo-icon" />
            <h1>EV Journey Analyzer</h1>
            <p>Upload your journey log CSV to discover insights about your electric travels</p>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="settings-panel">
          <button
            className="settings-toggle"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings2 size={16} />
            Your Vehicle & Costs
            {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showSettings && (
            <div className="settings-form">
              <div className="settings-row">
                <div className="setting-group">
                  <label>Brand</label>
                  <select
                    value={settings.carBrand}
                    onChange={(e) => updateSetting('carBrand', e.target.value)}
                  >
                    <option value="Polestar">Polestar</option>
                    <option value="Tesla">Tesla</option>
                    <option value="BMW">BMW</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Audi">Audi</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Ford">Ford</option>
                    <option value="Volvo">Volvo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="setting-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={settings.carModel}
                    onChange={(e) => updateSetting('carModel', e.target.value)}
                    placeholder="e.g. 2, Model 3, i4"
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="setting-group">
                  <label>Electricity Cost (£/kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.elecCost}
                    onChange={(e) => updateSetting('elecCost', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="setting-group">
                  <label>Petrol Cost (£/litre)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.petrolCost}
                    onChange={(e) => updateSetting('petrolCost', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="settings-row">
                <div className="setting-group">
                  <label>Grid CO₂ (g/kWh)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={settings.gridCO2}
                    onChange={(e) => updateSetting('gridCO2', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="setting-group">
                  <label>Petrol CO₂ (g/mile)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={settings.petrolCO2}
                    onChange={(e) => updateSetting('petrolCO2', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden-input"
          />
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <p>Analyzing your journeys...</p>
            </div>
          ) : (
            <>
              <Upload size={48} className="upload-icon" />
              <p className="upload-text">Drop your CSV file here or click to browse</p>
              <p className="upload-hint">Supports BMW EV, Polestar, and similar journey log formats</p>
            </>
          )}
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button className="demo-btn" onClick={onDemo} disabled={loading}>
          <Sparkles size={18} />
          Try with demo data
        </button>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Detailed Statistics</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🗺️</span>
            <span>Interactive Map</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📈</span>
            <span>Trend Analysis</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔋</span>
            <span>Battery Insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadScreen;
