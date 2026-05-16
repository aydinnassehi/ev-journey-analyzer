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
            <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
              {/* Road */}
              <rect x="0" y="140" width="400" height="40" fill="#1a1a2e" rx="4"/>
              <line x1="20" y1="160" x2="80" y2="160" stroke="#333" strokeWidth="2" strokeDasharray="10,6"/>
              <line x1="110" y1="160" x2="170" y2="160" stroke="#333" strokeWidth="2" strokeDasharray="10,6"/>
              <line x1="200" y1="160" x2="260" y2="160" stroke="#333" strokeWidth="2" strokeDasharray="10,6"/>
              <line x1="290" y1="160" x2="350" y2="160" stroke="#333" strokeWidth="2" strokeDasharray="10,6"/>
              {/* Car body - Polestar 2 inspired sedan shape */}
              <path d="M80 130 L80 105 Q80 100 85 98 L130 95 L160 65 Q165 58 175 55 L240 52 Q255 52 265 60 L300 95 L330 98 Q340 98 340 105 L340 130 Q340 135 335 135 L310 135 L310 125 Q310 120 305 120 L295 120 Q290 120 290 125 L290 135 L260 135 Q255 145 240 145 Q225 145 220 135 L175 135 Q170 145 155 145 Q140 145 135 135 L105 135 Q95 135 90 130 Z" fill="#c0c0c8" stroke="#888" strokeWidth="1"/>
              {/* Windows */}
              <path d="M165 62 L195 60 L195 93 L135 93 Z" fill="#1a1a2e" stroke="#555" strokeWidth="0.5"/>
              <path d="L200 93 L200 58 L245 56 Q255 56 260 62 L295 93 Z" fill="#1a1a2e" stroke="#555" strokeWidth="0.5"/>
              {/* Window divider */}
              <line x1="200" y1="58" x2="200" y2="93" stroke="#888" strokeWidth="1.5"/>
              {/* Headlights */}
              <rect x="330" y="100" width="12" height="8" rx="2" fill="#f59e0b" opacity="0.8"/>
              <rect x="78" y="100" width="10" height="8" rx="2" fill="#ef4444" opacity="0.8"/>
              {/* Wheels */}
              <circle cx="145" cy="135" r="16" fill="#222" stroke="#444" strokeWidth="2"/>
              <circle cx="145" cy="135" r="8" fill="#333" stroke="#555" strokeWidth="1"/>
              <circle cx="145" cy="135" r="2" fill="#666"/>
              <circle cx="270" cy="135" r="16" fill="#222" stroke="#444" strokeWidth="2"/>
              <circle cx="270" cy="135" r="8" fill="#333" stroke="#555" strokeWidth="1"/>
              <circle cx="270" cy="135" r="2" fill="#666"/>
              {/* Polestar logo hint - diagonal line on hood */}
              <line x1="290" y1="90" x2="320" y2="95" stroke="#c0c0c8" strokeWidth="1" opacity="0.5"/>
              {/* Text */}
              <text x="200" y="178" text-anchor="middle" fill="#666" fontSize="11" fontFamily="system-ui">Polestar 2</text>
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
