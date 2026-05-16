import { describe, it, expect } from 'vitest';
import { analyzeJourneys } from './analysis';

// Helper to create test journey objects
function makeJourney(overrides = {}) {
  return {
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
    ...overrides,
  };
}

function makeJourneys(count, dayOffset = 0) {
  return Array.from({ length: count }, (_, i) =>
    makeJourney({
      id: i,
      startDate: new Date(`2025-07-${String(1 + i + dayOffset).padStart(2, '0')}T08:00:00`),
      endDate: new Date(`2025-07-${String(1 + i + dayOffset).padStart(2, '0')}T08:30:00`),
      distance: 10 + i,
      consumption: 2 + i * 0.1,
    })
  );
}

describe('analyzeJourneys', () => {
  it('returns null for empty journeys', () => {
    expect(analyzeJourneys([])).toBeNull();
  });

  it('computes basic statistics correctly', () => {
    const journeys = [
      makeJourney({ id: 0, distance: 10, consumption: 2 }),
      makeJourney({ id: 1, distance: 20, consumption: 4 }),
      makeJourney({ id: 2, distance: 30, consumption: 6 }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.tripCount).toBe(3);
    expect(result.totalDistance).toBe(60);
    expect(result.totalEnergy).toBe(12);
    expect(result.avgEfficiency).toBe(200); // 12/60 * 1000
  });

  it('computes CO2 savings', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const result = analyzeJourneys(journeys);

    // 100 * 404 - 20 * 212 = 40400 - 4240 = 36160g = 36.16kg ≈ 36
    expect(result.co2SavedKg).toBeGreaterThan(0);
    expect(result.co2SavedKg).toBe(36);
  });

  it('computes CO2 savings with custom settings', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const settings = { gridCO2: 100, petrolCO2: 500 };
    const result = analyzeJourneys(journeys, settings);

    // 100 * 500 - 20 * 100 = 50000 - 2000 = 48000g = 48kg
    expect(result.co2SavedKg).toBe(48);
  });

  it('computes cost savings with UK petrol price per litre', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const settings = { elecCost: 0.28, petrolCost: 1.43 };
    const result = analyzeJourneys(journeys, settings);

    expect(result.electricityCost).toBe(5.6); // 20 * 0.28
    expect(result.savings).toBeGreaterThan(0);
  });

  it('computes category breakdown', () => {
    const journeys = [
      makeJourney({ id: 0, category: 'Commute' }),
      makeJourney({ id: 1, category: 'Commute' }),
      makeJourney({ id: 2, category: 'Leisure' }),
      makeJourney({ id: 3, category: 'Shopping' }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.categories).toEqual({
      Commute: 2,
      Leisure: 1,
      Shopping: 1,
    });
  });

  it('computes SOC statistics', () => {
    const journeys = [
      makeJourney({ id: 0, socStart: 80, socEnd: 60, socDelta: 20 }),
      makeJourney({ id: 1, socStart: 90, socEnd: 70, socDelta: 20 }),
      makeJourney({ id: 2, socStart: 70, socEnd: 50, socDelta: 20 }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.socStats.avgStart).toBe(80);
    expect(result.socStats.avgEnd).toBe(60);
    expect(result.socStats.minEnd).toBe(50);
    expect(result.socStats.maxStart).toBe(90);
    expect(result.socStats.avgDelta).toBe(20);
  });

  it('computes speed statistics', () => {
    const journeys = [
      makeJourney({ id: 0, avgSpeed: 30 }),
      makeJourney({ id: 1, avgSpeed: 50 }),
      makeJourney({ id: 2, avgSpeed: 40 }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.avgSpeed).toBe(40);
    expect(result.maxSpeed).toBe(50);
  });

  it('uses car name from settings', () => {
    const journeys = [makeJourney()];
    const result = analyzeJourneys(journeys, { carName: 'Polestar 2' });

    expect(result.carName).toBe('Polestar 2');
  });

  it('defaults car name to EV', () => {
    const journeys = [makeJourney()];
    const result = analyzeJourneys(journeys, {});

    expect(result.carName).toBe('EV');
  });

  it('computes days span correctly', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-01-01T08:00:00'),
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-01-31T08:00:00'),
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.daysSpan).toBe(30); // Jan 1 to Jan 31 = 30 days
  });

  it('handles single journey', () => {
    const journeys = [makeJourney()];
    const result = analyzeJourneys(journeys);

    expect(result.tripCount).toBe(1);
    expect(result.daysSpan).toBe(1);
  });

  it('returns top locations sorted by frequency', () => {
    const journeys = [
      makeJourney({ id: 0, startAddress: 'Home, London', endAddress: 'Work, London' }),
      makeJourney({ id: 1, startAddress: 'Home, London', endAddress: 'Shop, Bristol' }),
      makeJourney({ id: 2, startAddress: 'Work, London', endAddress: 'Home, London' }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.topLocations).toHaveLength(3);
    expect(result.topLocations[0][0]).toBe('Home');
    expect(result.topLocations[0][1]).toBe(3); // appears 3 times
  });
});

describe('daily stats', () => {
  it('groups journeys by date', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-07-01T08:00:00'),
        distance: 10,
        consumption: 2,
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-07-01T14:00:00'),
        distance: 15,
        consumption: 3,
      }),
      makeJourney({
        id: 2,
        startDate: new Date('2025-07-02T08:00:00'),
        distance: 20,
        consumption: 4,
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.dailyStats).toHaveLength(2);
    expect(result.dailyStats[0].date).toBe('2025-07-01');
    expect(result.dailyStats[0].distance).toBe(25);
    expect(result.dailyStats[0].count).toBe(2);
  });

  it('sorts daily stats chronologically', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-07-03T08:00:00'),
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-07-01T08:00:00'),
      }),
      makeJourney({
        id: 2,
        startDate: new Date('2025-07-02T08:00:00'),
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.dailyStats[0].date).toBe('2025-07-01');
    expect(result.dailyStats[1].date).toBe('2025-07-02');
    expect(result.dailyStats[2].date).toBe('2025-07-03');
  });
});

describe('monthly stats', () => {
  it('groups journeys by month', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-06-15T08:00:00'),
        distance: 10,
        consumption: 2,
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-06-20T08:00:00'),
        distance: 15,
        consumption: 3,
      }),
      makeJourney({
        id: 2,
        startDate: new Date('2025-07-05T08:00:00'),
        distance: 20,
        consumption: 4,
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.monthlyStats).toHaveLength(2);
    expect(result.monthlyStats[0].label).toBe('Jun 25');
    expect(result.monthlyStats[0].distance).toBe(25);
    expect(result.monthlyStats[1].label).toBe('Jul 25');
  });

  it('sorts months chronologically even across year boundaries', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-12-01T08:00:00'),
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-01-15T08:00:00'),
      }),
      makeJourney({
        id: 2,
        startDate: new Date('2025-06-10T08:00:00'),
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.monthlyStats[0].label).toBe('Jan 25');
    expect(result.monthlyStats[1].label).toBe('Jun 25');
    expect(result.monthlyStats[2].label).toBe('Dec 25');
  });

  it('does not contain internal _key field', () => {
    const journeys = [makeJourney()];
    const result = analyzeJourneys(journeys);

    expect(result.monthlyStats[0]._key).toBeUndefined();
  });
});

describe('hourly stats', () => {
  it('counts trips per hour of day', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-07-01T08:00:00'),
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-07-01T08:30:00'),
      }),
      makeJourney({
        id: 2,
        startDate: new Date('2025-07-01T17:00:00'),
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.hourlyStats).toHaveLength(24);
    expect(result.hourlyStats[8].count).toBe(2);
    expect(result.hourlyStats[17].count).toBe(1);
    expect(result.hourlyStats[0].count).toBe(0);
  });
});

describe('weekday stats', () => {
  it('counts trips per weekday', () => {
    // 2025-07-01 is Tuesday, 2025-07-02 is Wednesday, 2025-07-03 is Thursday
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-07-01T08:00:00'), // Tue
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-07-02T08:00:00'), // Wed
      }),
      makeJourney({
        id: 2,
        startDate: new Date('2025-07-03T08:00:00'), // Thu
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.weekdayStats).toHaveLength(7);
    expect(result.weekdayStats.find(d => d.name === 'Tue').count).toBe(1);
    expect(result.weekdayStats.find(d => d.name === 'Wed').count).toBe(1);
    expect(result.weekdayStats.find(d => d.name === 'Thu').count).toBe(1);
    expect(result.weekdayStats.find(d => d.name === 'Mon').count).toBe(0);
  });
});

describe('efficiency by month', () => {
  it('computes average efficiency per month', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-06-15T08:00:00'),
        distance: 10,
        consumption: 2, // 200 Wh/mi
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-07-05T08:00:00'),
        distance: 20,
        consumption: 4, // 200 Wh/mi
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.efficiencyByMonth).toHaveLength(2);
    expect(result.efficiencyByMonth[0].efficiency).toBe(200);
    expect(result.efficiencyByMonth[1].efficiency).toBe(200);
  });

  it('sorts months chronologically', () => {
    const journeys = [
      makeJourney({
        id: 0,
        startDate: new Date('2025-12-01T08:00:00'),
        distance: 10,
        consumption: 2,
      }),
      makeJourney({
        id: 1,
        startDate: new Date('2025-03-15T08:00:00'),
        distance: 10,
        consumption: 2,
      }),
    ];
    const result = analyzeJourneys(journeys);

    expect(result.efficiencyByMonth[0].label).toBe('Mar 25');
    expect(result.efficiencyByMonth[1].label).toBe('Dec 25');
  });

  it('does not contain internal _key field', () => {
    const journeys = [makeJourney()];
    const result = analyzeJourneys(journeys);

    expect(result.efficiencyByMonth[0]._key).toBeUndefined();
  });
});

describe('cost calculations', () => {
  it('uses default UK costs when no settings provided', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const result = analyzeJourneys(journeys);

    expect(result.electricityCost).toBeGreaterThan(0);
    expect(result.petrolEquivalent).toBeGreaterThan(0);
    expect(result.savings).toBeGreaterThan(0);
  });

  it('allows custom electricity cost', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const result = analyzeJourneys(journeys, { elecCost: 0.35 });

    expect(result.electricityCost).toBe(7.0); // 20 * 0.35
  });

  it('converts petrol cost from £/litre using UK avg MPG', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const result = analyzeJourneys(journeys, { petrolCost: 1.50 });

    // 100 mi * (4.546/36.7 litres/mi) * £1.50
    const expected = 100 * (4.546 / 36.7) * 1.50;
    expect(result.petrolEquivalent).toBeCloseTo(expected, 2);
  });

  it('handles zero electricity cost (free charging)', () => {
    const journeys = [makeJourney({ distance: 100, consumption: 20 })];
    const result = analyzeJourneys(journeys, { elecCost: 0 });

    expect(result.electricityCost).toBe(0);
    expect(result.savings).toBe(result.petrolEquivalent);
  });
});
