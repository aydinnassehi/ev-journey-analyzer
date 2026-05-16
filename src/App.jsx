import { useState, useCallback } from 'react';
import UploadScreen from './components/UploadScreen';
import Dashboard from './components/Dashboard';
import { parseCSV } from './utils/csvParser';
import { analyzeJourneys } from './utils/analysis';

function App() {
  const [journeys, setJourneys] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const parsedJourneys = await parseCSV(file);
      if (parsedJourneys.length === 0) {
        setError('No valid journey data found in the file.');
        return;
      }
      const result = analyzeJourneys(parsedJourneys);
      setJourneys(parsedJourneys);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to parse the file. Please check the CSV format.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setJourneys(null);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleDemoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/journey_example.csv');
      const blob = await response.blob();
      const file = new File([blob], 'journey_example.csv', { type: 'text/csv' });
      const parsedJourneys = await parseCSV(file);
      const result = analyzeJourneys(parsedJourneys);
      setJourneys(parsedJourneys);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to load demo data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (journeys && analysis) {
    return <Dashboard journeys={journeys} analysis={analysis} onReset={handleReset} />;
  }

  return (
    <UploadScreen
      onUpload={handleFileUpload}
      onDemo={handleDemoData}
      loading={loading}
      error={error}
    />
  );
}

export default App;
