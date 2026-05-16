import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryCards from './SummaryCards';

const mockAnalysis = {
  tripCount: 551,
  totalDistance: 7708,
  totalEnergy: 2806,
  avgEfficiency: 364,
  avgTripDistance: 14,
  avgTripDuration: 35,
  daysSpan: 263,
  co2SavedKg: 2900,
  categories: { Commute: 500, Leisure: 51 },
  topLocations: [],
  dailyStats: [],
  monthlyStats: [],
  hourlyStats: [],
  weekdayStats: [],
  efficiencyByMonth: [],
  socStats: { avgStart: 73, avgEnd: 66, minEnd: 15, maxStart: 99, avgDelta: 7 },
  avgSpeed: 30,
  maxSpeed: 70,
  electricityCost: 785.68,
  petrolEquivalent: 1350,
  savings: 564.32,
  firstDate: new Date('2025-06-25'),
  lastDate: new Date('2026-03-15'),
  carName: 'Polestar 2',
};

describe('SummaryCards', () => {
  it('renders four summary cards', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    const cards = document.querySelectorAll('.summary-card');
    expect(cards).toHaveLength(4);
  });

  it('displays total trips count', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    expect(screen.getByText('551')).toBeInTheDocument();
  });

  it('displays total distance', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    expect(screen.getByText('7,708 mi')).toBeInTheDocument();
  });

  it('displays total energy', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    expect(screen.getByText('2,806 kWh')).toBeInTheDocument();
  });

  it('displays CO2 saved', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    expect(screen.getByText('2,900 kg')).toBeInTheDocument();
  });

  it('displays card labels', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    expect(screen.getByText('Total Trips')).toBeInTheDocument();
    expect(screen.getByText('Total Distance')).toBeInTheDocument();
    expect(screen.getByText('Energy Used')).toBeInTheDocument();
    expect(screen.getByText('CO₂ Saved')).toBeInTheDocument();
  });

  it('displays sub-info on cards', () => {
    render(<SummaryCards analysis={mockAnalysis} />);
    expect(screen.getByText(/over 263 days/)).toBeInTheDocument();
    expect(screen.getByText(/14 mi avg\/trip/)).toBeInTheDocument();
    expect(screen.getByText(/364 Wh\/mi avg/)).toBeInTheDocument();
    expect(screen.getByText(/vs petrol car/)).toBeInTheDocument();
  });
});
