import { useState, useCallback } from 'react';
import UploadScreen from './components/UploadScreen';
import Dashboard from './components/Dashboard';
import { parseCSV } from './utils/csvParser';
import { analyzeJourneys } from './utils/analysis';
import { generateDemoData } from './utils/demoData';

function App() {
  const [journeys, setJourneys] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User settings
  const [settings, setSettings] = useState({
    carBrand: 'Polestar',
    carModel: '2',
    elecCost: 0.28,
    petrolCost: 1.43,
    gridCO2: 212,
    petrolCO2: 404,
  });

  const runAnalysis = useCallback((journeys) => {
    const result = analyzeJourneys(journeys, settings);
    setJourneys(journeys);
    setAnalysis(result);
  }, [settings]);

  const handleFileUpload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const parsedJourneys = await parseCSV(file);
      if (parsedJourneys.length === 0) {
        setError('No valid journey data found in the file.');
        return;
      }
      runAnalysis(parsedJourneys);
    } catch (err) {
      setError('Failed to parse the file. Please check the CSV format.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [runAnalysis]);

  const handleReset = useCallback(() => {
    setJourneys(null);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleDemoData = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const demoJourneys = generateDemoData(120);
        runAnalysis(demoJourneys);
      } catch (err) {
        setError('Failed to generate demo data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [runAnalysis]);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Re-analyze when settings change
  const handleReanalyze = useCallback(() => {
    if (journeys) {
      runAnalysis(journeys);
    }
  }, [journeys, runAnalysis]);

  if (journeys && analysis) {
    return (
      <Dashboard
        journeys={journeys}
        analysis={analysis}
        onReset={handleReset}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onReanalyze={handleReanalyze}
      />
    );
  }

  return (
    <UploadScreen
      onUpload={handleFileUpload}
      onDemo={handleDemoData}
      loading={loading}
      error={error}
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
  );
}

export default App;
