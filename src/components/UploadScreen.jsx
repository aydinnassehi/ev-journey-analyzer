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
          <div className="car-image-wrapper">
            <img src="/polestar2.png" alt="Polestar 2" className="car-image" />
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
                  <label>Petrol Cost (£/mile)</label>
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
