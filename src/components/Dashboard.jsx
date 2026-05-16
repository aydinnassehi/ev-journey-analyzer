import { useState } from 'react';
import SummaryCards from './SummaryCards';
import TripMap from './TripMap';
import Charts from './Charts';
import Insights from './Insights';
import JourneyTable from './JourneyTable';
import { ArrowLeft } from 'lucide-react';

function Dashboard({ journeys, analysis, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'data', label: 'Data', icon: '📋' },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button className="reset-btn" onClick={onReset}>
          <ArrowLeft size={16} />
          New Analysis
        </button>
        <h2>Your EV Journey Analysis</h2>
        <div className="date-range">
          {analysis.firstDate?.toLocaleDateString()} — {analysis.lastDate?.toLocaleDateString()}
        </div>
      </header>

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
