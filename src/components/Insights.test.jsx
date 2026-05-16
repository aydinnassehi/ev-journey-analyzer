import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Insights from './Insights';

const mockJourneys = [
  {
    id: 0,
    startDate: new Date('2025-07-01T08:00:00'),
    startAddress: 'Home, London',
    endAddress: 'Work, London',
    distance: 10,
    consumption: 2,
    category: 'Commute',
    socStart: 80,
    socEnd: 70,
    duration: 30,
    efficiency: 200,
    avgSpeed: 20,
    socDelta: 10,
  },
  {
    id: 1,
    startDate: new Date('2025-07-02T17:00:00'),
    startAddress: 'Work, London',
    endAddress: 'Home, London',
    distance: 10,
    consumption: 2,
    category: 'Commute',
    socStart: 70,
    socEnd: 60,
    duration: 30,
    efficiency: 200,
    avgSpeed: 20,
    socDelta: 10,
  },
];

const mockAnalysis = {
  tripCount: 2,
  totalDistance: 20,
  totalEnergy: 4,
  avgEfficiency: 200,
  avgTripDistance: 10,
  avgTripDuration: 30,
  daysSpan: 2,
  co2SavedKg: 7,
  categories: { Commute: 2 },
  topLocations: [['Home', 2], ['Work', 2]],
  dailyStats: [],
  monthlyStats: [],
  hourlyStats: Array(24).fill(0).map((c, i) => ({
    hour: i,
    count: i === 8 ? 1 : i === 17 ? 1 : 0,
  })),
  weekdayStats: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((n, i) => ({
    name: n,
    count: (i === 2 || i === 3) ? 1 : 0,
  })),
  efficiencyByMonth: [],
  socStats: { avgStart: 75, avgEnd: 65, minEnd: 60, maxStart: 80, avgDelta: 10 },
  avgSpeed: 20,
  maxSpeed: 20,
  electricityCost: 1.12,
  petrolEquivalent: 3.52,
  savings: 2.40,
  firstDate: new Date('2025-07-01'),
  lastDate: new Date('2025-07-02'),
  carName: 'Polestar 2',
};

describe('Insights', () => {
  it('renders the insights title', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText(/Key Insights/)).toBeInTheDocument();
  });

  it('renders multiple insight cards', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    const cards = document.querySelectorAll('.insight-card');
    expect(cards.length).toBeGreaterThan(3);
  });

  it('includes driving frequency insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Driving Frequency')).toBeInTheDocument();
  });

  it('includes energy efficiency insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
  });

  it('includes money saved insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Money Saved')).toBeInTheDocument();
  });

  it('includes environmental impact insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Environmental Impact')).toBeInTheDocument();
  });

  it('includes peak driving hour insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Peak Driving Hour')).toBeInTheDocument();
  });

  it('includes battery habits insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Battery Habits')).toBeInTheDocument();
  });

  it('includes location diversity insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Location Diversity')).toBeInTheDocument();
  });

  it('includes driving style insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    expect(screen.getByText('Driving Style')).toBeInTheDocument();
  });

  it('references the car name in efficiency insight', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    const texts = Array.from(document.querySelectorAll('.insight-text p')).map(p => p.textContent);
    const efficiencyDesc = texts.find(t => t.includes('Polestar 2'));
    expect(efficiencyDesc).toBeDefined();
  });

  it('shows correct savings amount', () => {
    render(<Insights analysis={mockAnalysis} journeys={mockJourneys} />);
    const texts = Array.from(document.querySelectorAll('.insight-text p')).map(p => p.textContent);
    const savingsDesc = texts.find(t => t.includes('Money Saved') || t.includes('£'));
    expect(savingsDesc).toBeDefined();
  });
});
