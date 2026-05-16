import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';

const mockJourneys = [
  {
    id: 0,
    startDate: new Date('2025-07-01T08:00:00'),
    endDate: new Date('2025-07-01T08:30:00'),
    startAddress: 'Home, London',
    endAddress: 'Work, London',
    distance: 10,
    consumption: 2,
    category: 'Commute',
    tripType: 'SINGLE',
    socStart: 80,
    socEnd: 70,
    startOdometer: 10000,
    endOdometer: 10010,
    startLat: 51.5,
    startLng: -0.1,
    endLat: 51.6,
    endLng: -0.1,
    comments: '',
    duration: 30,
    efficiency: 200,
    avgSpeed: 20,
    socDelta: 10,
  },
];

const mockAnalysis = {
  tripCount: 1,
  totalDistance: 10,
  totalEnergy: 2,
  avgEfficiency: 200,
  avgTripDistance: 10,
  avgTripDuration: 30,
  daysSpan: 1,
  co2SavedKg: 38,
  categories: { Commute: 1 },
  topLocations: [['Home', 2], ['Work', 1]],
  dailyStats: [{ date: '2025-07-01', distance: 10, energy: 2, count: 1 }],
  monthlyStats: [{ label: 'Jul 25', distance: 10, energy: 2, count: 1 }],
  hourlyStats: Array(24).fill(0).map((c, i) => ({ hour: i, count: i === 8 ? 1 : 0 })),
  weekdayStats: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((n, i) => ({ name: n, count: i === 2 ? 1 : 0 })),
  efficiencyByMonth: [{ label: 'Jul 25', efficiency: 200 }],
  socStats: { avgStart: 80, avgEnd: 70, minEnd: 70, maxStart: 80, avgDelta: 10 },
  avgSpeed: 20,
  maxSpeed: 20,
  electricityCost: 0.56,
  petrolEquivalent: 1.76,
  savings: 1.20,
  firstDate: new Date('2025-07-01'),
  lastDate: new Date('2025-07-01'),
  carName: 'Polestar 2',
};

const mockSettings = {
  carBrand: 'Polestar',
  carModel: '2',
  elecCost: 0.28,
  petrolCost: 1.43,
  gridCO2: 212,
  petrolCO2: 404,
};

describe('Dashboard', () => {
  it('renders the dashboard header with car name', () => {
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={() => {}}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={() => {}}
      />
    );
    expect(screen.getByText('Polestar 2 Analysis')).toBeInTheDocument();
  });

  it('renders all tab buttons', () => {
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={() => {}}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={() => {}}
      />
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('shows overview tab by default', () => {
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={() => {}}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={() => {}}
      />
    );
    // Overview tab should be active
    const overviewTab = screen.getByText('Overview').closest('button');
    expect(overviewTab).toHaveClass('active');
  });

  it('renders the reset button', () => {
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={() => {}}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={() => {}}
      />
    );
    expect(screen.getByText('New Analysis')).toBeInTheDocument();
  });

  it('renders the date range', () => {
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={() => {}}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={() => {}}
      />
    );
    expect(screen.getByText(/01\/07\/2025/)).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={onReset}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={() => {}}
      />
    );
    screen.getByText('New Analysis').click();
    expect(onReset).toHaveBeenCalled();
  });

  it('calls onReanalyze when Update Analysis button is clicked', async () => {
    const onReanalyze = vi.fn();
    render(
      <Dashboard
        journeys={mockJourneys}
        analysis={mockAnalysis}
        onReset={() => {}}
        settings={mockSettings}
        onSettingsChange={() => {}}
        onReanalyze={onReanalyze}
      />
    );
    // Open settings panel
    const settingsBtn = document.querySelector('.settings-toggle-btn');
    if (settingsBtn) {
      settingsBtn.click();
      await waitFor(() => {
        expect(screen.getByText('Update Analysis')).toBeInTheDocument();
      });
      screen.getByText('Update Analysis').click();
      expect(onReanalyze).toHaveBeenCalled();
    }
  });
});
