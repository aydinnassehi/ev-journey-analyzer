import { useState } from 'react';
import SummaryCards from './SummaryCards';
import TripMap from './TripMap';
import Charts from './Charts';
import Insights from './Insights';
import JourneyTable from './JourneyTable';
import { ArrowLeft, Settings2, ChevronDown, ChevronUp } from 'lucide-react';

function Dashboard({ journeys, analysis, onReset, settings, onSettingsChange, onReanalyze }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'data', label: 'Data', icon: '📋' },
  ];

  const updateSetting = (key, value) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button className="reset-btn" onClick={onReset}>
          <ArrowLeft size={16} />
          New Analysis
        </button>
        <h2>
          {analysis.carName} Analysis
        </h2>
        <div className="header-right">
          <div className="date-range">
            {analysis.firstDate?.toLocaleDateString()} — {analysis.lastDate?.toLocaleDateString()}
          </div>
          <button
            className="settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings2 size={16} />
            {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="dashboard-settings">
          <div className="settings-row">
            <div className="setting-group">
              <label>Brand</label>
              <select value={settings.carBrand} onChange={(e) => updateSetting('carBrand', e.target.value)}>
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
              <input type="text" value={settings.carModel} onChange={(e) => updateSetting('carModel', e.target.value)} />
            </div>
            <div className="setting-group">
              <label>Electricity (£/kWh)</label>
              <input type="number" step="0.01" min="0" value={settings.elecCost} onChange={(e) => updateSetting('elecCost', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="setting-group">
              <label>Petrol (£/mile)</label>
              <input type="number" step="0.01" min="0" value={settings.petrolCost} onChange={(e) => updateSetting('petrolCost', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="setting-group">
              <label>Grid CO₂ (g/kWh)</label>
              <input type="number" step="1" min="0" value={settings.gridCO2} onChange={(e) => updateSetting('gridCO2', parseInt(e.target.value) || 0)} />
            </div>
            <div className="setting-group">
              <label>Petrol CO₂ (g/mi)</label>
              <input type="number" step="1" min="0" value={settings.petrolCO2} onChange={(e) => updateSetting('petrolCO2', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <button className="reanalyze-btn" onClick={onReanalyze}>Update Analysis</button>
        </div>
      )}

      <nav className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <SummaryCards analysis={analysis} />
            <Charts analysis={analysis} />
          </>
        )}
        {activeTab === 'map' && <TripMap journeys={journeys} />}
        {activeTab === 'trends' && <Charts analysis={analysis} fullView />}
        {activeTab === 'insights' && <Insights analysis={analysis} journeys={journeys} />}
        {activeTab === 'data' && <JourneyTable journeys={journeys} />}
      </main>
    </div>
  );
}

export default Dashboard;
