import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import JourneyTable from './JourneyTable';

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
  {
    id: 1,
    startDate: new Date('2025-07-02T17:00:00'),
    endDate: new Date('2025-07-02T17:45:00'),
    startAddress: 'Work, London',
    endAddress: 'Gym, Bristol',
    distance: 15,
    consumption: 3,
    category: 'Leisure',
    tripType: 'SINGLE',
    socStart: 70,
    socEnd: 55,
    startOdometer: 10010,
    endOdometer: 10025,
    startLat: 51.6,
    startLng: -0.1,
    endLat: 51.45,
    endLng: -2.6,
    comments: '',
    duration: 45,
    efficiency: 200,
    avgSpeed: 20,
    socDelta: 15,
  },
  {
    id: 2,
    startDate: new Date('2025-07-03T09:00:00'),
    endDate: new Date('2025-07-03T09:20:00'),
    startAddress: 'Home, London',
    endAddress: 'Shop, Manchester',
    distance: 5,
    consumption: 0.8,
    category: 'Shopping',
    tripType: 'SINGLE',
    socStart: 60,
    socEnd: 58,
    startOdometer: 10025,
    endOdometer: 10030,
    startLat: 51.5,
    startLng: -0.1,
    endLat: 53.48,
    endLng: -2.25,
    comments: '',
    duration: 20,
    efficiency: 160,
    avgSpeed: 15,
    socDelta: 2,
  },
];

describe('JourneyTable', () => {
  it('renders the table with column headers', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Dist (mi)')).toBeInTheDocument();
    expect(screen.getByText('kWh')).toBeInTheDocument();
    expect(screen.getByText('Wh/mi')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('SOC%')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByPlaceholderText(/Search addresses or categories/)).toBeInTheDocument();
  });

  it('shows the correct result count', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByText('3 trips')).toBeInTheDocument();
  });

  it('renders journey data in the table', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByText('10.0')).toBeInTheDocument();
    expect(screen.getByText('15.0')).toBeInTheDocument();
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('renders category badges', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByText('Commute')).toBeInTheDocument();
    expect(screen.getByText('Leisure')).toBeInTheDocument();
    expect(screen.getByText('Shopping')).toBeInTheDocument();
  });

  it('renders SOC values with arrow notation', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByText('80% → 70%')).toBeInTheDocument();
    expect(screen.getByText('70% → 55%')).toBeInTheDocument();
    expect(screen.getByText('60% → 58%')).toBeInTheDocument();
  });

  it('renders address columns', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
  });

  it('renders pagination when data exceeds page size', () => {
    // Create enough journeys to trigger pagination (pageSize = 25)
    const largeJourneys = Array.from({ length: 30 }, (_, i) => ({
      ...mockJourneys[0],
      id: i,
      startDate: new Date(`2025-07-${String(i + 1).padStart(2, '0')}T08:00:00`),
    }));

    render(<JourneyTable journeys={largeJourneys} />);
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
  });

  it('does not render pagination for small datasets', () => {
    render(<JourneyTable journeys={mockJourneys} />);
    expect(screen.queryByText(/Page 1/)).not.toBeInTheDocument();
  });

  it('renders prev and next buttons when paginated', () => {
    const largeJourneys = Array.from({ length: 50 }, (_, i) => ({
      ...mockJourneys[0],
      id: i,
      startDate: new Date(`2025-07-${String(Math.min(i + 1, 28)).padStart(2, '0')}T08:00:00`),
    }));

    render(<JourneyTable journeys={largeJourneys} />);
    expect(screen.getByText('← Prev')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });
});
