import { useState, useRef } from 'react';
import { Upload, BatteryCharging, AlertCircle, Sparkles } from 'lucide-react';

function UploadScreen({ onUpload, onDemo, loading, error }) {
  const [dragOver, setDragOver] = useState(false);
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

  return (
    <div className="upload-screen">
      <div className="upload-container">
        <div className="logo">
          <BatteryCharging size={48} />
          <h1>EV Journey Analyzer</h1>
          <p>Upload your journey log CSV to discover insights about your electric travels</p>
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
              <p className="upload-hint">Supports BMW EV journey logs and similar formats</p>
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
